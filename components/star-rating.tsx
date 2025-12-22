"use client";

import { Star } from "lucide-react";
import { useState, useRef, useCallback } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [focusedStar, setFocusedStar] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readonly || !onRatingChange) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const starWidth = rect.width / 5;
    const starIndex = Math.floor(x / starWidth);
    const positionInStar = (x % starWidth) / starWidth;

    // If in left half of star, use .5, if in right half use full star
    const newRating = starIndex + (positionInStar > 0.5 ? 1 : 0.5);
    const clampedRating = Math.max(0.5, Math.min(5, newRating));

    setHoverRating(clampedRating);
  };

  const handleClick = () => {
    if (readonly || !onRatingChange || hoverRating === null) return;
    onRatingChange(hoverRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent, starValue: number) => {
    if (readonly || !onRatingChange) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onRatingChange(starValue);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (starValue < 5) {
          const nextStar = document.querySelector(`[data-star="${starValue + 1}"]`) as HTMLElement;
          nextStar?.focus();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (starValue > 1) {
          const prevStar = document.querySelector(`[data-star="${starValue - 1}"]`) as HTMLElement;
          prevStar?.focus();
        }
        break;
      case 'Home': {
        e.preventDefault();
        const firstStar = document.querySelector('[data-star="1"]') as HTMLElement;
        firstStar?.focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        const lastStar = document.querySelector('[data-star="5"]') as HTMLElement;
        lastStar?.focus();
        break;
      }
    }
  }, [readonly, onRatingChange]);

  const displayRating = hoverRating !== null ? hoverRating : (focusedStar !== null ? focusedStar : rating);

  return (
    <div className="flex items-center gap-2">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`flex items-center gap-0.5 ${
          readonly ? "cursor-default" : "cursor-pointer"
        }`}
        role={readonly ? "img" : "group"}
        aria-label={readonly ? `Rating: ${rating} out of 5 stars` : "Rate this book"}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = displayRating >= star;
          const isHalf = displayRating >= star - 0.5 && displayRating < star;
          const isInteractive = !readonly && onRatingChange;

          return (
            <div
              key={star}
              data-star={star}
              tabIndex={isInteractive ? 0 : -1}
              role={isInteractive ? "button" : undefined}
              aria-label={isInteractive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
              aria-pressed={isInteractive ? rating >= star : undefined}
              onKeyDown={(e) => handleKeyDown(e, star)}
              onFocus={() => !readonly && setFocusedStar(star)}
              onBlur={() => setFocusedStar(null)}
              className={`relative ${
                !readonly && "hover:scale-110 focus:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded"
              } transition-transform`}
            >
              <Star
                className={`${sizes[size]} ${
                  isFull || isHalf
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40"
                }`}
                aria-hidden="true"
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    className={`${sizes[size]} fill-amber-400 text-amber-400`}
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!readonly && (hoverRating !== null || focusedStar !== null) && (
        <span className="text-xs text-muted-foreground font-medium min-w-[2rem]" aria-live="polite">
          {(hoverRating || focusedStar || 0).toFixed(1)}
        </span>
      )}
    </div>
  );
}
