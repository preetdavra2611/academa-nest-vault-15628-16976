-- Add material_type column to materials table to distinguish between Materials and PYQs
ALTER TABLE public.materials ADD COLUMN material_type TEXT NOT NULL DEFAULT 'material' CHECK (material_type IN ('material', 'pyq'));

-- Add comment for clarity
COMMENT ON COLUMN public.materials.material_type IS 'Type of material: material for regular study materials, pyq for previous year questions';