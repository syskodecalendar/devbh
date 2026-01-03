import rubyRoyaleNecklace from "@/assets/jewelry/ruby-royale-necklace.jpg";
import rubyRoyaleModel from "@/assets/jewelry/ruby-royale-model.png";
import rubyRoyaleVideo from "@/assets/jewelry/ruby-royale-video.mp4";

export interface JewelrySet {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  galleryImages: string[];
  galleryVideos: string[];
  goldPurity: "18K" | "22K";
  goldWeightGrams: number;
  sku: string;
  hasDiamond: boolean;
  diamondBaseBHD?: number;
  baseGoldPriceBHD: number;
  makingChargeBHD: number;
  stoneDetails?: string;
  collection: string;
  isFeatured: boolean;
}

export interface DiamondQuality {
  id: string;
  name: string;
  description: string;
  multiplier: number;
}

export const diamondQualities: DiamondQuality[] = [
  {
    id: "si-gh",
    name: "SI / GH",
    description: "Slightly Included, Good to High Color",
    multiplier: 1.0,
  },
  {
    id: "vs-gh",
    name: "VS / GH",
    description: "Very Slightly Included, Good to High Color",
    multiplier: 1.25,
  },
  {
    id: "vvs-ef",
    name: "VVS / EF",
    description: "Very Very Slightly Included, Excellent to Fine Color",
    multiplier: 1.6,
  },
];

export const jewelrySets: JewelrySet[] = [
  {
    id: "ruby-royale",
    name: "Diamond Cascade",
    description: "An exquisite diamond necklace featuring brilliant-cut and baguette diamonds in a cascading three-row design. The intricate pattern showcases exceptional craftsmanship with mixed-cut stones creating a mesmerizing river of light. Perfect for the bride who desires timeless elegance.",
    shortDescription: "18K White Gold with brilliant-cut diamonds",
    coverImage: rubyRoyaleNecklace,
    galleryImages: [rubyRoyaleModel, rubyRoyaleNecklace],
    galleryVideos: [rubyRoyaleVideo],
    goldPurity: "18K",
    goldWeightGrams: 85,
    sku: "DV-DC-2024-001",
    hasDiamond: true,
    diamondBaseBHD: 8500,
    baseGoldPriceBHD: 5500,
    makingChargeBHD: 2800,
    stoneDetails: "Brilliant Cut Diamonds (6.8 carats), Baguette Diamonds (4.2 carats)",
    collection: "Diamond Luxe",
    isFeatured: true,
  },
  {
    id: "maroon-majesty",
    name: "Maroon Majesty",
    description: "A stunning ensemble that captures the essence of bridal opulence. This 22K gold set features deep maroon enamel work complemented by polki diamonds and kundan settings. Each piece is meticulously crafted to ensure the bride radiates magnificence on her special day.",
    shortDescription: "22K Gold with maroon enamel and polki diamonds",
    coverImage: "/placeholder.svg",
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    galleryVideos: [],
    goldPurity: "22K",
    goldWeightGrams: 210,
    sku: "DV-MM-2024-002",
    hasDiamond: true,
    diamondBaseBHD: 3200,
    baseGoldPriceBHD: 14200,
    makingChargeBHD: 2100,
    stoneDetails: "Polki Diamonds (8.5 carats), Maroon Meenakari Enamel",
    collection: "Bridal Luxe",
    isFeatured: true,
  },
  {
    id: "golden-dreams",
    name: "Golden Dreams",
    description: "Pure 22K gold crafted into an ethereal bridal set that speaks of dreams realized. The temple-inspired design features intricate filigree work and antique finish, creating a look that is both traditional and contemporary. Ideal for the modern bride honoring her roots.",
    shortDescription: "22K Pure gold with temple-inspired design",
    coverImage: "/placeholder.svg",
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    galleryVideos: [],
    goldPurity: "22K",
    goldWeightGrams: 165,
    sku: "DV-GD-2024-003",
    hasDiamond: false,
    baseGoldPriceBHD: 11200,
    makingChargeBHD: 1500,
    collection: "Temple Heritage",
    isFeatured: true,
  },
  {
    id: "emerald-enchantment",
    name: "Emerald Enchantment",
    description: "A breathtaking creation featuring Colombian emeralds set in 18K gold with diamond accents. The contemporary design blends seamlessly with traditional craftsmanship, making it perfect for brides who appreciate modern luxury with classic sensibilities.",
    shortDescription: "18K Gold with Colombian emeralds",
    coverImage: "/placeholder.svg",
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    galleryVideos: [],
    goldPurity: "18K",
    goldWeightGrams: 145,
    sku: "DV-EE-2024-004",
    hasDiamond: true,
    diamondBaseBHD: 1800,
    baseGoldPriceBHD: 9800,
    makingChargeBHD: 1400,
    stoneDetails: "Colombian Emeralds (6.8 carats), Round Brilliant Diamonds (2.1 carats)",
    collection: "Contemporary Luxe",
    isFeatured: false,
  },
  {
    id: "pearl-paradise",
    name: "Pearl Paradise",
    description: "South Sea pearls meet 22K gold in this divine bridal collection. Each pearl is hand-selected for its luster and perfectly complemented by delicate gold work. The set exudes grace and sophistication, perfect for the bride with refined taste.",
    shortDescription: "22K Gold with South Sea pearls",
    coverImage: "/placeholder.svg",
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    galleryVideos: [],
    goldPurity: "22K",
    goldWeightGrams: 128,
    sku: "DV-PP-2024-005",
    hasDiamond: false,
    baseGoldPriceBHD: 8700,
    makingChargeBHD: 1200,
    stoneDetails: "South Sea Pearls (18 pieces, 10-14mm)",
    collection: "Pearl Collection",
    isFeatured: false,
  },
];

export const getFeaturedSets = (): JewelrySet[] => {
  return jewelrySets.filter((set) => set.isFeatured);
};

export const getSetById = (id: string): JewelrySet | undefined => {
  return jewelrySets.find((set) => set.id === id);
};

export const calculatePrice = (
  set: JewelrySet,
  diamondQualityId?: string
): number => {
  let total = set.baseGoldPriceBHD + set.makingChargeBHD;
  
  if (set.hasDiamond && set.diamondBaseBHD && diamondQualityId) {
    const quality = diamondQualities.find((q) => q.id === diamondQualityId);
    if (quality) {
      total += set.diamondBaseBHD * quality.multiplier;
    }
  }
  
  return total;
};
