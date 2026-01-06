-- Add metal_color column to jewelry_media table to support color-specific images
ALTER TABLE public.jewelry_media 
ADD COLUMN metal_color TEXT DEFAULT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN public.jewelry_media.metal_color IS 'Metal color variant for this media: white, yellow, rose, or NULL for default/all colors';