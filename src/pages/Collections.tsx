import { motion } from "framer-motion";
import Header from "@/components/Header";
import SetCard from "@/components/SetCard";
import { jewelrySets } from "@/data/products";

const Collections = () => {
  return (
    <div className="min-h-screen bg-velvet">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)_/_0.08),_transparent_50%)]" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium mb-4 block">
              Our Collections
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6">
              Complete
              <span className="block text-gold-gradient mt-2">Bridal Library</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse through our entire collection of exquisite bridal jewelry,
              each piece crafted with passion and precision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {jewelrySets.map((set, index) => (
              <SetCard key={set.id} set={set} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 border-t border-border/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-primary/30 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">
                Certified Quality
              </h3>
              <p className="text-muted-foreground text-sm">
                Every piece comes with authenticity certification and quality
                assurance.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-primary/30 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">
                Custom Designs
              </h3>
              <p className="text-muted-foreground text-sm">
                Personalize any set to match your unique vision and style
                preferences.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-primary/30 flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">
                Luxury Packaging
              </h3>
              <p className="text-muted-foreground text-sm">
                Each set arrives in elegant packaging, perfect for the momentous
                occasion.
              </p>
            </motion.div>
          </div>
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

export default Collections;
