// Demo image mappings for jewelry sets using local assets
import rubyRoyaleNecklace from "@/assets/jewelry/ruby-royale-necklace.jpg";
import rubyRoyaleModel from "@/assets/jewelry/ruby-royale-model.png";
import rubyRoyaleVideo from "@/assets/jewelry/ruby-royale-video.mp4";
import maroonMajestyNecklace from "@/assets/jewelry/maroon-majesty-necklace.jpg";
import maroonMajestyBracelet from "@/assets/jewelry/maroon-majesty-bracelet.jpg";
import maroonMajestyVideo1 from "@/assets/jewelry/maroon-majesty-video1.mp4";
import maroonMajestyVideo2 from "@/assets/jewelry/maroon-majesty-video2.mp4";

export interface DemoMedia {
  coverImage: string;
  images: string[];
  videos: string[];
}

// Map slugs to their demo media
export const demoMediaBySlug: Record<string, DemoMedia> = {
  "ruby-royale": {
    coverImage: rubyRoyaleNecklace,
    images: [rubyRoyaleNecklace, rubyRoyaleModel],
    videos: [rubyRoyaleVideo],
  },
  "maroon-majesty": {
    coverImage: maroonMajestyNecklace,
    images: [maroonMajestyNecklace, maroonMajestyBracelet],
    videos: [maroonMajestyVideo1, maroonMajestyVideo2],
  },
};

export const getDemoMedia = (slug: string): DemoMedia | null => {
  return demoMediaBySlug[slug] || null;
};

export const getDemoCoverImage = (slug: string): string | null => {
  const media = demoMediaBySlug[slug];
  return media?.coverImage || null;
};
