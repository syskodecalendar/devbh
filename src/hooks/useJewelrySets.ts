import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface JewelrySetDB {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  cover_image: string | null;
  base_price: number | null;
  has_diamond: boolean | null;
  diamond_price_per_carat: number | null;
  featured: boolean | null;
  collection_id: string | null;
  display_order: number | null;
  collection?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  media?: JewelryMediaDB[];
}

export interface JewelryMediaDB {
  id: string;
  set_id: string;
  type: string;
  url: string;
  alt_text: string | null;
  is_cover: boolean | null;
  display_order: number | null;
}

export interface CollectionDB {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  cover_image: string | null;
  featured: boolean | null;
  display_order: number | null;
}

export interface DiamondQualityDB {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price_multiplier: number | null;
  display_order: number | null;
}

export const useJewelrySets = () => {
  return useQuery({
    queryKey: ["jewelry-sets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jewelry_sets")
        .select(`
          *,
          collection:collections(id, name, slug)
        `)
        .order("display_order");

      if (error) throw error;
      return data as JewelrySetDB[];
    },
  });
};

export const useFeaturedSets = () => {
  return useQuery({
    queryKey: ["jewelry-sets", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jewelry_sets")
        .select(`
          *,
          collection:collections(id, name, slug)
        `)
        .eq("featured", true)
        .order("display_order");

      if (error) throw error;
      return data as JewelrySetDB[];
    },
  });
};

export const useJewelrySetBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["jewelry-set", slug],
    queryFn: async () => {
      const { data: setData, error: setError } = await supabase
        .from("jewelry_sets")
        .select(`
          *,
          collection:collections(id, name, slug)
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (setError) throw setError;
      if (!setData) return null;

      // Fetch media for this set
      const { data: mediaData, error: mediaError } = await supabase
        .from("jewelry_media")
        .select("*")
        .eq("set_id", setData.id)
        .order("display_order");

      if (mediaError) throw mediaError;

      return {
        ...setData,
        media: mediaData || [],
      } as JewelrySetDB;
    },
    enabled: !!slug,
  });
};

export const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as CollectionDB[];
    },
  });
};

export const useDiamondQualities = () => {
  return useQuery({
    queryKey: ["diamond-qualities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diamond_qualities")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as DiamondQualityDB[];
    },
  });
};

export const useSetMedia = (setId: string) => {
  return useQuery({
    queryKey: ["jewelry-media", setId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jewelry_media")
        .select("*")
        .eq("set_id", setId)
        .order("display_order");

      if (error) throw error;
      return data as JewelryMediaDB[];
    },
    enabled: !!setId,
  });
};

// Helper to calculate price similar to static version
export const calculateSetPrice = (
  set: JewelrySetDB,
  diamondQuality?: DiamondQualityDB
): number => {
  const basePrice = set.base_price || 0;
  
  if (set.has_diamond && diamondQuality && set.diamond_price_per_carat) {
    const multiplier = diamondQuality.price_multiplier || 1;
    return basePrice + (set.diamond_price_per_carat * multiplier);
  }
  
  return basePrice;
};
