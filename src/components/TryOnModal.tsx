import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { X, Camera, Upload, RotateCw, ZoomIn, ZoomOut, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface TryOnModalProps {
  open: boolean;
  onClose: () => void;
  setName: string;
}

const TryOnModal = ({ open, onClose, setName }: TryOnModalProps) => {
  const [activeMode, setActiveMode] = useState<"camera" | "upload">("camera");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [necklaceSettings, setNecklaceSettings] = useState({
    scale: 100,
    positionY: 60,
    rotation: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Camera access denied", {
        description: "Please allow camera access or use photo upload mode.",
      });
      setActiveMode("upload");
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  // Handle mode change
  useEffect(() => {
    if (open && activeMode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [open, activeMode, startCamera, stopCamera]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const deltaY = e.clientY - dragOffset.y;
        setNecklaceSettings((prev) => ({
          ...prev,
          positionY: Math.max(0, Math.min(100, prev.positionY + deltaY * 0.2)),
        }));
        setDragOffset({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Save image
  const saveImage = () => {
    toast.success("Preview saved!", {
      description: "Your try-on preview has been saved.",
    });
  };

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden luxury-card"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div>
            <h2 className="font-serif text-xl text-foreground">
              Virtual Try-On
            </h2>
            <p className="text-muted-foreground text-sm">{setName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeMode}
          onValueChange={(v) => setActiveMode(v as "camera" | "upload")}
          className="flex-1"
        >
          <TabsList className="w-full justify-start px-4 py-2 border-b border-border/30 bg-transparent">
            <TabsTrigger
              value="camera"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Camera className="w-4 h-4 mr-2" />
              Live Camera
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Photo Upload
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {/* Main View */}
            <div className="md:col-span-2">
              <TabsContent value="camera" className="mt-0">
                <div className="relative aspect-[4/3] bg-maroon-dark rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  {/* Necklace overlay */}
                  <div
                    className="absolute left-1/2 cursor-move"
                    style={{
                      top: `${necklaceSettings.positionY}%`,
                      transform: `translateX(-50%) scale(${
                        necklaceSettings.scale / 100
                      }) rotate(${necklaceSettings.rotation}deg)`,
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    {/* Placeholder necklace - will be replaced with actual asset */}
                    <div className="w-48 h-24 border-4 border-primary rounded-b-full border-t-0 opacity-80">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full" />
                    </div>
                  </div>
                  {!cameraStream && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Starting camera...
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-0">
                <div className="relative aspect-[4/3] bg-maroon-dark rounded-lg overflow-hidden">
                  {uploadedImage ? (
                    <>
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
                      {/* Necklace overlay */}
                      <div
                        className="absolute left-1/2 cursor-move"
                        style={{
                          top: `${necklaceSettings.positionY}%`,
                          transform: `translateX(-50%) scale(${
                            necklaceSettings.scale / 100
                          }) rotate(${necklaceSettings.rotation}deg)`,
                        }}
                        onMouseDown={handleMouseDown}
                      >
                        <div className="w-48 h-24 border-4 border-primary rounded-b-full border-t-0 opacity-80">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-maroon-light/20 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Click to upload a photo
                      </p>
                      <p className="text-muted-foreground/60 text-sm mt-1">
                        JPG, PNG up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </TabsContent>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ZoomIn className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Scale</span>
                </div>
                <Slider
                  value={[necklaceSettings.scale]}
                  onValueChange={([value]) =>
                    setNecklaceSettings((prev) => ({ ...prev, scale: value }))
                  }
                  min={50}
                  max={150}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Move className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Vertical Position
                  </span>
                </div>
                <Slider
                  value={[necklaceSettings.positionY]}
                  onValueChange={([value]) =>
                    setNecklaceSettings((prev) => ({ ...prev, positionY: value }))
                  }
                  min={20}
                  max={80}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <RotateCw className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Rotation</span>
                </div>
                <Slider
                  value={[necklaceSettings.rotation]}
                  onValueChange={([value]) =>
                    setNecklaceSettings((prev) => ({ ...prev, rotation: value }))
                  }
                  min={-30}
                  max={30}
                  step={1}
                />
              </div>

              <div className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-4">
                  💡 Tip: Drag the necklace overlay to reposition it, or use the
                  sliders for precise control.
                </p>

                <Button
                  variant="gold"
                  className="w-full"
                  onClick={saveImage}
                >
                  Save Preview
                </Button>

                {activeMode === "upload" && uploadedImage && (
                  <Button
                    variant="goldOutline"
                    className="w-full mt-2"
                    onClick={() => setUploadedImage(null)}
                  >
                    Upload New Photo
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground/60 italic">
                Note: This is a preview experience. For the best try-on
                experience, visit our showroom.
              </p>
            </div>
          </div>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default TryOnModal;
