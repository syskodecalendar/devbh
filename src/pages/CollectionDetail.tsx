import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft, Filter } from "lucide-react";
import Header from "@/components/Header";
import { useJewelrySetsByCollection, useCollections } from "@/hooks/useJewelrySets";

// Price filter options
const priceFilterOptions = [
  { id: "all", name: "All Prices", min: 0, max: Infinity },
  { id: "below-5000", name: "Below 5,000 BHD", min: 0, max: 5000 },
  { id: "5000-10000", name: "5,000 - 10,000 BHD", min: 5000, max: 10000 },
  { id: "10000-20000", name: "10,000 - 20,000 BHD", min: 10000, max: 20000 },
  { id: "above-20000", name: "Above 20,000 BHD", min: 20000, max: Infinity },
];

const CollectionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: sets, isLoading } = useJewelrySetsByCollection(slug || "");
  const { data: collections } = useCollections();
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>("all");

  const collection = collections?.find((c) => c.slug === slug);

  // Filter sets by price
  const filteredSets = useMemo(() => {
    if (!sets) return [];
    const filter = priceFilterOptions.find((f) => f.id === selectedPriceFilter);
    if (!filter || filter.id === "all") return sets;

    return sets.filter((set) => {
      const price = set.base_price || 0;
      return price >= filter.min && price <= filter.max;
    });
  }, [sets, selectedPriceFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-velvet flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-velvet">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Back button */}
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/style-library"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Style Library</span>
          </Link>
        </div>

        {/* Collection Header */}
        <div className="container mx-auto px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium mb-2 block">
              Collection
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              {collection?.name || "Collection"}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {collection?.description || collection?.short_description}
            </p>
          </motion.div>

          {/* Price Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 p-4 luxury-card max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-2 mb-3 justify-center">
              <Filter className="w-4 h-4 text-primary" />
              <h3 className="font-serif text-lg text-foreground">Filter by Price</h3>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {priceFilterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedPriceFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedPriceFilter === filter.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/60 text-foreground border border-border/50 hover:border-primary/50"
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          <p className="text-center text-muted-foreground text-sm mb-8">
            Showing {filteredSets.length} {filteredSets.length === 1 ? "design" : "designs"}
          </p>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSets.map((set, index) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/set/${set.slug}`}
                  className="block luxury-card overflow-hidden group"
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={set.cover_image || "/placeholder.svg"}
                      alt={set.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-serif text-xl text-foreground mb-1">
                      {set.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {set.short_description}
                    </p>
                    <p className="text-primary font-medium">
                      {set.base_price
                        ? `${set.base_price.toLocaleString()} BHD`
                        : "Price on request"}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* No results */}
          {filteredSets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No designs found in this price range.
              </p>
              <button
                onClick={() => setSelectedPriceFilter("all")}
                className="text-primary hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollectionDetail;