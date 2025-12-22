"use client";

import { useState, useEffect, useRef } from "react";
import { useBookStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { X, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageCropModal } from "./image-crop-modal";
import {
  SOCIAL_PLATFORMS,
  getPlatformById,
  extractValueFromUrl,
} from "@/lib/social-platforms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SocialLink } from "@/lib/mock-data";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_GENRES = [
  "Fiction",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Historical Fiction",
  "Non-Fiction",
  "Biography",
  "Self-Help",
];

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const profile = useBookStore((state) => state.profile);
  const updateProfile = useBookStore((state) => state.updateProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState("");

  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio,
    profilePhoto: profile.profilePhoto,
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>(profile.favoriteGenres);
  const [customGenre, setCustomGenre] = useState("");
  const [showCustomGenre, setShowCustomGenre] = useState(false);

  // Social links state
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(profile.socialLinks || []);

  // Reset form data when modal opens - intentional state sync
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: profile.name,
        bio: profile.bio,
        profilePhoto: profile.profilePhoto,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedGenres(profile.favoriteGenres);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocialLinks(profile.socialLinks || []);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCustomGenre("");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowCustomGenre(false);
    }
  }, [isOpen, profile]);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageSrc(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setFormData({ ...formData, profilePhoto: croppedImage });
  };

  const handleDeletePhoto = () => {
    setFormData({ ...formData, profilePhoto: "" });
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const handleAddCustomGenre = () => {
    if (customGenre.trim() && !selectedGenres.includes(customGenre.trim())) {
      setSelectedGenres([...selectedGenres, customGenre.trim()]);
      setCustomGenre("");
      setShowCustomGenre(false);
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g !== genre));
  };

  // Social links handlers
  const handleAddSocialLink = (platformId: string) => {
    const newLink: SocialLink = {
      id: `${Date.now()}-${Math.random()}`,
      platform: platformId,
      value: "",
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const handleRemoveSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  };

  const handleSocialLinkChange = (id: string, value: string) => {
    setSocialLinks(
      socialLinks.map((link) =>
        link.id === id ? { ...link, value } : link
      )
    );
  };

  const getAvailablePlatforms = () => {
    const usedPlatformIds = new Set(socialLinks.map((link) => link.platform));
    return SOCIAL_PLATFORMS.filter((platform) =>
      platform.allowMultiple || !usedPlatformIds.has(platform.id)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Process social links - filter out empty values
    const processedSocialLinks = socialLinks
      .filter((link) => link.value.trim())
      .map((link) => ({
        ...link,
        value: link.value.trim(),
      }));

    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        profilePhoto: formData.profilePhoto,
        favoriteGenres: selectedGenres,
        socialLinks: processedSocialLinks,
      });
      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative"
              onMouseEnter={() => setIsPhotoHovered(true)}
              onMouseLeave={() => setIsPhotoHovered(false)}
            >
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-border">
                <AvatarImage src={formData.profilePhoto || undefined} alt={formData.name} />
                <AvatarFallback>{formData.name.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              {isPhotoHovered && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center gap-2 transition-all">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500/30 transition-all"
                    aria-label="Change profile photo"
                  >
                    <Edit className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    className="p-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all"
                    aria-label="Delete profile photo"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="hidden"
            />
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your full name"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell us about yourself..."
              className="mt-1.5 min-h-[100px]"
            />
          </div>

          {/* Genres Section */}
          <div>
            <Label>Favorite Genres</Label>
            <div className="mt-2 space-y-3">
              {/* Selected Genres */}
              {selectedGenres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedGenres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5"
                    >
                      {genre}
                      <button
                        type="button"
                        onClick={() => handleRemoveGenre(genre)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Popular Genres Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_GENRES.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                      selectedGenres.includes(genre)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary/50 text-secondary-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {/* Custom Genre Input */}
              {showCustomGenre ? (
                <div className="flex gap-2">
                  <Input
                    value={customGenre}
                    onChange={(e) => setCustomGenre(e.target.value)}
                    placeholder="Enter custom genre"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomGenre())}
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomGenre}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowCustomGenre(false);
                      setCustomGenre("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomGenre(true)}
                  className="gap-2"
                >
                  <Plus className="w-3 h-3" />
                  Add Custom Genre
                </Button>
              )}
            </div>
          </div>

          {/* Social Links Section */}
          <div className="space-y-3">
            <Label>Social Links</Label>

            {/* Existing Social Links */}
            {socialLinks.map((link) => {
              const platform = getPlatformById(link.platform);
              if (!platform) return null;

              const Icon = platform.icon;
              const displayValue = extractValueFromUrl(platform, link.value);

              return (
                <div key={link.id} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-secondary/50 border border-border flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={displayValue}
                      onChange={(e) => handleSocialLinkChange(link.id, e.target.value)}
                      placeholder={platform.placeholder}
                      type={platform.inputType === "email" ? "email" : "text"}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveSocialLink(link.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}

            {/* Add New Social Link - Dropdown only, adds immediately on selection */}
            <div className="flex gap-2 items-center">
              <Select
                value=""
                onValueChange={(platformId) => {
                  handleAddSocialLink(platformId);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a platform..." />
                </SelectTrigger>
                <SelectContent>
                  {getAvailablePlatforms().map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <SelectItem key={platform.id} value={platform.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {platform.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>

      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={tempImageSrc}
        onCropComplete={handleCropComplete}
      />
    </Dialog>
  );
}
