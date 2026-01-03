import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JewelrySet, calculatePrice, diamondQualities } from "@/data/products";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

interface SetCardProps {
  set: JewelrySet;
  index?: number;
  featured?: boolean;
}

const SetCard = ({ set, index = 0, featured = false }: SetCardProps) => {
  const navigate = useNavigate();
  const { addToShortlist, removeFromShortlist, isInShortlist } = useStore();
  const inShortlist = isInShortlist(set.id);

  const basePrice = calculatePrice(set, diamondQualities[0]?.id);

  const handleShortlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inShortlist) {
      removeFromShortlist(set.id);
      toast.info(`${set.name} removed from shortlist`);
    } else {
      addToShortlist(set, set.hasDiamond ? diamondQualities[0].id : undefined);
      toast.success(`${set.name} added to shortlist`);
    }
  };

  return (
    <motion.div
      className={`group relative luxury-card overflow-hidden cursor-pointer ${
        featured ? "h-[420px] md:h-[500px]" : "h-[350px] md:h-[400px]"
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/set/${set.id}`)}
    >
      {/* Image container */}
      <div className="relative h-2/3 overflow-hidden bg-card">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card z-10"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <img
          src={set.coverImage}
          alt={set.name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 p-2"
        />
        
        {/* Shortlist button */}
        <motion.button
          className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
            inShortlist
              ? "bg-primary text-primary-foreground"
              : "bg-background/30 text-foreground hover:bg-primary/80 hover:text-primary-foreground"
          }`}
          onClick={handleShortlistToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className={`w-5 h-5 ${inShortlist ? "fill-current" : ""}`} />
        </motion.button>

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium tracking-wider uppercase rounded-sm">
            Featured
          </div>
        )}

        {/* Gold shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer" />
      </div>

      {/* Content */}
      <div className="p-5 h-1/3 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl text-foreground group-hover:text-gold-gradient transition-colors duration-300">
            {set.name}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {set.shortDescription}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              From
            </p>
            <p className="text-primary font-serif text-lg">
              {basePrice.toLocaleString()} BHD
            </p>
          </div>
          <Button variant="goldOutline" size="sm" className="text-xs">
            Explore
          </Button>
        </div>
      </div>

      {/* Hover border glow */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: "inset 0 0 0 1px hsl(var(--primary) / 0.4)",
        }}
      />
    </motion.div>
  );
};

export default SetCard;
