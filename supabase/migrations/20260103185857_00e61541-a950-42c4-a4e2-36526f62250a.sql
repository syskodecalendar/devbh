-- Create jewelry collections table
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  cover_image TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jewelry sets/products table
CREATE TABLE public.jewelry_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  cover_image TEXT,
  base_price DECIMAL(10,2) DEFAULT 0,
  has_diamond BOOLEAN DEFAULT false,
  diamond_price_per_carat DECIMAL(10,2) DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jewelry items table (individual pieces in a set)
CREATE TABLE public.jewelry_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  set_id UUID REFERENCES public.jewelry_sets(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- necklace, bracelet, earrings, ring, etc.
  weight_grams DECIMAL(8,2),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media table for images and videos
CREATE TABLE public.jewelry_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  set_id UUID REFERENCES public.jewelry_sets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  alt_text TEXT,
  is_cover BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create diamond qualities reference table
CREATE TABLE public.diamond_qualities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  price_multiplier DECIMAL(4,2) DEFAULT 1.00,
  display_order INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jewelry_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jewelry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jewelry_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diamond_qualities ENABLE ROW LEVEL SECURITY;

-- Create public read policies (anyone can view products)
CREATE POLICY "Anyone can view collections" 
ON public.collections FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view jewelry sets" 
ON public.jewelry_sets FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view jewelry items" 
ON public.jewelry_items FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view jewelry media" 
ON public.jewelry_media FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view diamond qualities" 
ON public.diamond_qualities FOR SELECT 
USING (true);

-- Create role enum and user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin policies for collections
CREATE POLICY "Admins can insert collections"
ON public.collections FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update collections"
ON public.collections FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete collections"
ON public.collections FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for jewelry_sets
CREATE POLICY "Admins can insert jewelry sets"
ON public.jewelry_sets FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update jewelry sets"
ON public.jewelry_sets FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete jewelry sets"
ON public.jewelry_sets FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for jewelry_items
CREATE POLICY "Admins can insert jewelry items"
ON public.jewelry_items FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update jewelry items"
ON public.jewelry_items FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete jewelry items"
ON public.jewelry_items FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for jewelry_media
CREATE POLICY "Admins can insert jewelry media"
ON public.jewelry_media FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update jewelry media"
ON public.jewelry_media FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete jewelry media"
ON public.jewelry_media FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for diamond_qualities
CREATE POLICY "Admins can insert diamond qualities"
ON public.diamond_qualities FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update diamond qualities"
ON public.diamond_qualities FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete diamond qualities"
ON public.diamond_qualities FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for jewelry images
INSERT INTO storage.buckets (id, name, public) VALUES ('jewelry-images', 'jewelry-images', true);

-- Storage policies
CREATE POLICY "Anyone can view jewelry images"
ON storage.objects FOR SELECT
USING (bucket_id = 'jewelry-images');

CREATE POLICY "Authenticated users can upload jewelry images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'jewelry-images');

CREATE POLICY "Authenticated users can update jewelry images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'jewelry-images');

CREATE POLICY "Authenticated users can delete jewelry images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'jewelry-images');

-- Insert default diamond qualities
INSERT INTO public.diamond_qualities (name, code, description, price_multiplier, display_order) VALUES
('VS1', 'vs1', 'Very Slightly Included 1', 1.00, 1),
('VVS1', 'vvs1', 'Very Very Slightly Included 1', 1.25, 2),
('VVS2', 'vvs2', 'Very Very Slightly Included 2', 1.15, 3),
('IF', 'if', 'Internally Flawless', 1.50, 4),
('FL', 'fl', 'Flawless', 2.00, 5);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_collections_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_jewelry_sets_updated_at
BEFORE UPDATE ON public.jewelry_sets
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add trigger for profiles updated_at
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();