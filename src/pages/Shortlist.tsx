import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Heart, FileText } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import {
  calculatePrice,
  diamondQualities,
  DiamondQuality,
} from "@/data/products";
import { useState } from "react";
import QuoteModal from "@/components/QuoteModal";

const Shortlist = () => {
  const { shortlist, removeFromShortlist, updateDiamondQuality, clearShortlist } =
    useStore();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const totalEstimate = shortlist.reduce((sum, item) => {
    return sum + calculatePrice(item.set, item.selectedDiamondQuality);
  }, 0);

  return (
    <div className="min-h-screen bg-velvet">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <h1 className="font-serif text-4xl text-foreground">
                Your Shortlist
              </h1>
            </div>
            <p className="text-muted-foreground">
              {shortlist.length === 0
                ? "Your shortlist is empty"
                : `${shortlist.length} item${
                    shortlist.length > 1 ? "s" : ""
                  } selected`}
            </p>
          </motion.div>

          {shortlist.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-2xl text-foreground mb-3">
                No Items Yet
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Browse our collections and add your favorite pieces to the
                shortlist to request a quote.
              </p>
              <Link to="/collections">
                <Button variant="gold">Explore Collections</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                {shortlist.map((item, index) => (
                  <motion.div
                    key={item.set.id}
                    className="luxury-card p-4 flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Image */}
                    <Link
                      to={`/set/${item.set.id}`}
                      className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden"
                    >
                      <img
                        src={item.set.coverImage}
                        alt={item.set.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/set/${item.set.id}`}
                        className="font-serif text-lg text-foreground hover:text-primary transition-colors"
                      >
                        {item.set.name}
                      </Link>
                      <p className="text-muted-foreground text-sm mt-1">
                        {item.set.goldPurity} • {item.set.goldWeightGrams}g
                      </p>

                      {/* Diamond quality selector */}
                      {item.set.hasDiamond && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-2">
                            Diamond Quality:
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {diamondQualities.map((quality: DiamondQuality) => (
                              <button
                                key={quality.id}
                                onClick={() =>
                                  updateDiamondQuality(item.set.id, quality.id)
                                }
                                className={`px-3 py-1 text-xs rounded-full transition-all ${
                                  item.selectedDiamondQuality === quality.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-muted-foreground hover:border-primary/50"
                                }`}
                              >
                                {quality.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className="text-right flex flex-col justify-between">
                      <div>
                        <p className="text-primary font-serif text-lg">
                          {calculatePrice(
                            item.set,
                            item.selectedDiamondQuality
                          ).toLocaleString()}{" "}
                          BHD
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromShortlist(item.set.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Clear all */}
                <div className="text-center pt-4">
                  <button
                    onClick={clearShortlist}
                    className="text-muted-foreground hover:text-destructive text-sm transition-colors"
                  >
                    Clear all items
                  </button>
                </div>
              </div>

              {/* Summary Card */}
              <div className="lg:col-span-1">
                <motion.div
                  className="luxury-card p-6 sticky top-24"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-serif text-xl text-foreground mb-6">
                    Summary
                  </h3>

                  <div className="space-y-3 mb-6">
                    {shortlist.map((item) => (
                      <div
                        key={item.set.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground truncate pr-2">
                          {item.set.name}
                        </span>
                        <span className="text-foreground">
                          {calculatePrice(
                            item.set,
                            item.selectedDiamondQuality
                          ).toLocaleString()}{" "}
                          BHD
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border/30 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Estimated Total
                      </span>
                      <span className="font-serif text-xl text-primary">
                        {totalEstimate.toLocaleString()} BHD
                      </span>
                    </div>
                    <p className="text-muted-foreground/60 text-xs mt-2">
                      Final pricing may vary based on live gold rate and
                      customization.
                    </p>
                  </div>

                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={() => setQuoteModalOpen(true)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Request Quote for Shortlist
                  </Button>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-serif text-2xl text-gold-gradient mb-2">Devji</h3>
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            Bridal World
          </p>
        </div>
      </footer>

      {/* Quote Modal */}
      <QuoteModal
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        selectedSets={shortlist.map((item) => ({
          set: item.set,
          diamondQuality: item.selectedDiamondQuality,
        }))}
      />
    </div>
  );
};

export default Shortlist;
