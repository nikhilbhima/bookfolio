"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
}

export function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Reset when modal opens - intentional state sync
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setZoom(1);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosition({ x: 0, y: 0 });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageLoaded(false);
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Draw preview on canvas whenever zoom or position changes
  useEffect(() => {
    if (!imageLoaded || !previewCanvasRef.current || !imageRef.current || !containerRef.current) return;

    const previewCanvas = previewCanvasRef.current;
    const ctx = previewCanvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current;
    const image = imageRef.current;

    // Set canvas size to match container
    previewCanvas.width = container.clientWidth;
    previewCanvas.height = container.clientHeight;

    // Clear canvas
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Calculate image dimensions after zoom
    const imageWidth = image.naturalWidth * zoom;
    const imageHeight = image.naturalHeight * zoom;

    // Calculate position to center the image initially, then apply user position offset
    const x = (previewCanvas.width - imageWidth) / 2 + position.x;
    const y = (previewCanvas.height - imageHeight) / 2 + position.y;

    // Draw the image
    ctx.drawImage(image, x, y, imageWidth, imageHeight);
  }, [zoom, position, imageLoaded]);

  const handleCrop = useCallback(async () => {
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    const image = imageRef.current;
    const container = containerRef.current;

    if (!canvas || !image || !container || !previewCanvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set output canvas size
    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Get what's currently visible in the preview canvas
    const previewCtx = previewCanvas.getContext("2d");
    if (!previewCtx) return;

    // Get the image data from preview canvas (what the user sees)
    const previewData = previewCtx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);

    // Create a temporary canvas to hold the preview
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = previewCanvas.width;
    tempCanvas.height = previewCanvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;
    tempCtx.putImageData(previewData, 0, 0);

    // Draw the preview to the output canvas, scaling to output size
    ctx.drawImage(tempCanvas, 0, 0, outputSize, outputSize);

    const croppedImage = canvas.toDataURL("image/jpeg", 0.95);
    onCropComplete(croppedImage);
    onClose();
  }, [onCropComplete, onClose]);

  const handleCancel = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Crop & Adjust Photo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Crop Area */}
          <div
            ref={containerRef}
            className="relative w-full aspect-square bg-black/5 rounded-lg overflow-hidden cursor-move border-2 border-dashed border-border"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Preview Canvas */}
            <canvas
              ref={previewCanvasRef}
              className="absolute inset-0 w-full h-full"
            />

            {/* Hidden image for loading - using <img> instead of Next Image for canvas manipulation */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Source"
              className="hidden"
              onLoad={() => setImageLoaded(true)}
              crossOrigin="anonymous"
            />

            {/* Crop overlay guide */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Zoom</span>
              <span className="font-medium">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Drag the image to reposition • Use the slider to zoom
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCrop}>
            Apply
          </Button>
        </DialogFooter>

        {/* Hidden canvas for final crop output */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
