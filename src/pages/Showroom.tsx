import { motion } from "framer-motion";
import Header from "@/components/Header";
import SetCardDB from "@/components/SetCardDB";
import { useFeaturedSets } from "@/hooks/useJewelrySets";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Showroom = () => {
  const { data: featuredSets, isLoading } = useFeaturedSets();

  return (
    <div className="min-h-screen bg-velvet">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)_/_0.08),_transparent_50%)]" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">
                The Showroom
              </span>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-6">
              Curated
              <span className="block text-gold-gradient mt-2">Bridal Masterpieces</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Discover our finest selection of handcrafted gold sets, each piece
              telling a story of timeless elegance and unmatched craftsmanship.
            </p>

            <Link to="/collections">
              <Button variant="goldOutline" size="lg" className="group">
                View All Collections
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Sets Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Featured Collections
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our most coveted pieces, handpicked for brides who seek
              extraordinary beauty
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : featuredSets && featuredSets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredSets.map((set, index) => (
                <SetCardDB key={set.id} set={set} index={index} featured />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No featured collections yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(var(--primary)_/_0.1),_transparent_60%)]" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6">
              Begin Your Journey
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              Explore our complete collection and find the perfect set that
              resonates with your vision of bridal elegance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/collections">
                <Button variant="gold" size="xl">
                  Explore Collections
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-serif text-2xl text-gold-gradient mb-2">Devji</h3>
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            Bridal World
          </p>
          <p className="text-muted-foreground/60 text-xs mt-4">
            Where Dreams Meet Tradition
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Showroom;
