import { create } from "zustand";
import { persist } from "zustand/middleware";
import { JewelrySet } from "@/data/products";
import { JewelrySetDB } from "@/hooks/useJewelrySets";

export interface ShortlistItem {
  set: JewelrySet;
  selectedDiamondQuality?: string;
  addedAt: Date;
}

export interface ShortlistItemDB {
  setId: string;
  setName: string;
  coverImage: string | null;
  basePrice: number | null;
  hasDiamond: boolean | null;
  selectedDiamondQuality?: string;
  addedAt: Date;
}

interface AppState {
  // Door state
  hasEnteredShowroom: boolean;
  setHasEnteredShowroom: (value: boolean) => void;

  // Shortlist (legacy for static data)
  shortlist: ShortlistItem[];
  addToShortlist: (set: JewelrySet, diamondQuality?: string) => void;
  
  // Shortlist for DB items
  shortlistDB: ShortlistItemDB[];
  addToShortlistDB: (set: JewelrySetDB, diamondQuality?: string) => void;
  
  removeFromShortlist: (setId: string) => void;
  updateDiamondQuality: (setId: string, quality: string) => void;
  clearShortlist: () => void;
  isInShortlist: (setId: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Door state
      hasEnteredShowroom: false,
      setHasEnteredShowroom: (value) => set({ hasEnteredShowroom: value }),

      // Shortlist (legacy)
      shortlist: [],
      
      addToShortlist: (jewelrySet, diamondQuality) => {
        const { shortlist } = get();
        if (!shortlist.find((item) => item.set.id === jewelrySet.id)) {
          set({
            shortlist: [
              ...shortlist,
              {
                set: jewelrySet,
                selectedDiamondQuality: diamondQuality,
                addedAt: new Date(),
              },
            ],
          });
        }
      },

      // Shortlist for DB items
      shortlistDB: [],
      
      addToShortlistDB: (jewelrySet, diamondQuality) => {
        const { shortlistDB } = get();
        if (!shortlistDB.find((item) => item.setId === jewelrySet.id)) {
          set({
            shortlistDB: [
              ...shortlistDB,
              {
                setId: jewelrySet.id,
                setName: jewelrySet.name,
                coverImage: jewelrySet.cover_image,
                basePrice: jewelrySet.base_price,
                hasDiamond: jewelrySet.has_diamond,
                selectedDiamondQuality: diamondQuality,
                addedAt: new Date(),
              },
            ],
          });
        }
      },

      removeFromShortlist: (setId) => {
        set({
          shortlist: get().shortlist.filter((item) => item.set.id !== setId),
          shortlistDB: get().shortlistDB.filter((item) => item.setId !== setId),
        });
      },

      updateDiamondQuality: (setId, quality) => {
        set({
          shortlist: get().shortlist.map((item) =>
            item.set.id === setId
              ? { ...item, selectedDiamondQuality: quality }
              : item
          ),
          shortlistDB: get().shortlistDB.map((item) =>
            item.setId === setId
              ? { ...item, selectedDiamondQuality: quality }
              : item
          ),
        });
      },

      clearShortlist: () => set({ shortlist: [], shortlistDB: [] }),

      isInShortlist: (setId) => {
        return get().shortlist.some((item) => item.set.id === setId) ||
               get().shortlistDB.some((item) => item.setId === setId);
      },
    }),
    {
      name: "devji-bridal-world",
      partialize: (state) => ({
        shortlist: state.shortlist,
        shortlistDB: state.shortlistDB,
        hasEnteredShowroom: state.hasEnteredShowroom,
      }),
    }
  )
);
