import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { useJewelrySetsByCollection, useCollections } from "@/hooks/useJewelrySets";

const CollectionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: sets, isLoading } = useJewelrySetsByCollection(slug || "");
  const { data: collections } = useCollections();

  const collection = collections?.find((c) => c.slug === slug);

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

          {/* Results count */}
          <p className="text-center text-muted-foreground text-sm mb-8">
            {sets?.length || 0} {(sets?.length || 0) === 1 ? "design" : "designs"}
          </p>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sets?.map((set, index) => (
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
          {(!sets || sets.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No designs found in this collection.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollectionDetail;