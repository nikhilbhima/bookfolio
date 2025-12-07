"use client";

import { useState, useRef } from "react";
import { Edit, Camera } from "lucide-react";
import { useBookStore } from "@/lib/store";
import { UserProfile } from "@/lib/mock-data";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { EditProfileModal } from "./edit-profile-modal";
import { ImageCropModal } from "./image-crop-modal";
import { getPlatformById, buildSocialUrl } from "@/lib/social-platforms";

interface ProfileCardProps {
  profile?: UserProfile;
  isPublic?: boolean;
}

export function ProfileCard({ profile: propProfile, isPublic = false }: ProfileCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storeProfile = useBookStore((state) => state.profile);
  const updateProfile = useBookStore((state) => state.updateProfile);

  const profile = propProfile || storeProfile;

  const handleProfilePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageSrc(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    updateProfile({ profilePhoto: croppedImage });
  };

  return (
    <>
      <Card className="p-4 sm:p-6 md:p-8 py-5 sm:py-8 md:py-10">
        <div className="flex flex-row items-start gap-3 sm:gap-4 md:gap-6">
          {/* Profile Photo */}
          <div
            className={`relative ${!isPublic ? "cursor-pointer" : ""} group shrink-0`}
            onMouseEnter={() => !isPublic && setIsAvatarHovered(true)}
            onMouseLeave={() => !isPublic && setIsAvatarHovered(false)}
            onClick={!isPublic ? handleProfilePhotoClick : undefined}
          >
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 border-border">
              <AvatarImage src={profile.profilePhoto || undefined} alt={profile.name} />
              <AvatarFallback className="text-lg sm:text-xl">{profile.name?.charAt(0) || profile.username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            {!isPublic && isAvatarHovered && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-all">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            )}
          </div>

          {/* Hidden file input */}
          {!isPublic && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          )}

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1 sm:mb-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold truncate">
                  {profile.name}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  @{profile.username}
                </p>
              </div>
              {!isPublic && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                  className="gap-1 sm:gap-2 ml-2 shrink-0 h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                >
                  <Edit className="w-3 h-3" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-foreground mb-2 sm:mb-3 leading-relaxed line-clamp-2 sm:line-clamp-none">
              {profile.bio}
            </p>

            {/* Favorite Genres */}
            {profile.favoriteGenres.length > 0 && (
              <div className="mb-2 sm:mb-3">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-1.5">
                  Favorite Genres
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {profile.favoriteGenres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-foreground font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              {profile.socialLinks.map((link) => {
                const platform = getPlatformById(link.platform);
                if (!platform || !link.value) return null;

                const Icon = platform.icon;
                const url = buildSocialUrl(platform, link.value);

                return (
                  <a
                    key={link.id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground hover:bg-secondary/80 p-1.5 sm:p-2 rounded-full transition-all"
                    title={platform.label}
                  >
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {!isPublic && (
        <>
          <EditProfileModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
          />

          <ImageCropModal
            isOpen={isCropModalOpen}
            onClose={() => setIsCropModalOpen(false)}
            imageSrc={tempImageSrc}
            onCropComplete={handleCropComplete}
          />
        </>
      )}
    </>
  );
}
