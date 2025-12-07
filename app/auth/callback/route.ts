import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const cookieStore = await cookies()

    // Create Supabase client for session management
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Exchange code for session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError || !sessionData?.user) {
      return NextResponse.redirect(`${origin}/login?error=session_failed`)
    }

    const user = sessionData.user

    // Use service role client for profile operations
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Check if profile exists using maybeSingle to avoid errors
    const { data: profile } = await adminClient
      .from('profiles')
      .select('username')
      .eq('user_id', user.id)
      .maybeSingle()

    // If no profile exists, create one
    if (!profile) {

      const displayName = user.user_metadata?.full_name ||
                         user.user_metadata?.name ||
                         user.email?.split('@')[0] ||
                         'User'

      // Get pending username from cookie, or generate one from user data
      let pendingUsername: string = cookieStore.get('pending_username')?.value || ''

      if (!pendingUsername) {
        // Generate username from email or name if no pending username cookie
        const emailPart = user.email?.split('@')[0] || ''
        const namePart = (user.user_metadata?.full_name || user.user_metadata?.name || '')
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_-]/g, '')

        pendingUsername = namePart || emailPart || `user_${Date.now().toString().slice(-6)}`
      }

      // Ensure username meets requirements (3-20 chars, lowercase + numbers + _ -)
      pendingUsername = pendingUsername.slice(0, 20).toLowerCase()
      if (pendingUsername.length < 3) {
        pendingUsername = `user_${Date.now().toString().slice(-6)}`
      }

      // Re-check username availability to prevent race condition
      const { data: existingUsername } = await adminClient
        .from('profiles')
        .select('username')
        .ilike('username', pendingUsername)
        .maybeSingle()

      let finalUsername = pendingUsername.toLowerCase()

      // If username was taken, generate a unique one
      if (existingUsername) {
        finalUsername = `${pendingUsername.toLowerCase()}_${Date.now().toString().slice(-6)}`
      }

      // Create profile
      const { error: insertError } = await adminClient
        .from('profiles')
        .insert({
          user_id: user.id,
          username: finalUsername,
          name: displayName,
          bio: '',
          profile_photo: user.user_metadata?.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
          favorite_genres: [],
          social_links: [],
        })

      if (insertError) {
        console.error('[AUTH CALLBACK] Profile creation error:', insertError.message)
        return NextResponse.redirect(`${origin}/login?error=profile_creation_failed`)
      }

      // Clear the pending username cookie
      cookieStore.delete('pending_username')
    }

    return NextResponse.redirect(`${origin}/dashboard`)

  } catch (error) {
    console.error('[AUTH CALLBACK] Unexpected error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.redirect(`${origin}/login?error=unexpected`)
  }
}
