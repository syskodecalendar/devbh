import { create } from "zustand";
import { persist } from "zustand/middleware";
import { JewelrySet } from "@/data/products";

export interface ShortlistItem {
  set: JewelrySet;
  selectedDiamondQuality?: string;
  addedAt: Date;
}

interface AppState {
  // Door state
  hasEnteredShowroom: boolean;
  setHasEnteredShowroom: (value: boolean) => void;

  // Shortlist
  shortlist: ShortlistItem[];
  addToShortlist: (set: JewelrySet, diamondQuality?: string) => void;
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

      // Shortlist
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

      removeFromShortlist: (setId) => {
        set({
          shortlist: get().shortlist.filter((item) => item.set.id !== setId),
        });
      },

      updateDiamondQuality: (setId, quality) => {
        set({
          shortlist: get().shortlist.map((item) =>
            item.set.id === setId
              ? { ...item, selectedDiamondQuality: quality }
              : item
          ),
        });
      },

      clearShortlist: () => set({ shortlist: [] }),

      isInShortlist: (setId) => {
        return get().shortlist.some((item) => item.set.id === setId);
      },
    }),
    {
      name: "devji-bridal-world",
      partialize: (state) => ({
        shortlist: state.shortlist,
        hasEnteredShowroom: state.hasEnteredShowroom,
      }),
    }
  )
);
