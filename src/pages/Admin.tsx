import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Upload, Trash2, Edit, LogOut, Package, Layers, Image, X } from "lucide-react";
import devjiLogo from "@/assets/devji-logo.png";
import type { User } from "@supabase/supabase-js";

interface Collection {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  cover_image: string | null;
  featured: boolean | null;
  display_order: number | null;
}

interface JewelrySet {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  cover_image: string | null;
  base_price: number | null;
  has_diamond: boolean | null;
  featured: boolean | null;
  collection_id: string | null;
}

interface JewelryMedia {
  id: string;
  set_id: string;
  type: string;
  url: string;
  alt_text: string | null;
  is_cover: boolean | null;
  display_order: number | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [jewelrySets, setJewelrySets] = useState<JewelrySet[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [newCollection, setNewCollection] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
  });
  const [newSet, setNewSet] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    base_price: "",
    has_diamond: false,
    collection_id: "",
  });

  // Edit modal states
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editingSet, setEditingSet] = useState<JewelrySet | null>(null);
  const [editCollectionForm, setEditCollectionForm] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    featured: false,
    display_order: 0,
  });
  const [editSetForm, setEditSetForm] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    base_price: "",
    has_diamond: false,
    featured: false,
    collection_id: "",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [collectionsRes, setsRes] = await Promise.all([
        supabase.from("collections").select("*").order("display_order"),
        supabase.from("jewelry_sets").select("*").order("display_order"),
      ]);

      if (collectionsRes.error) throw collectionsRes.error;
      if (setsRes.error) throw setsRes.error;

      setCollections(collectionsRes.data || []);
      setJewelrySets(setsRes.data || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("jewelry-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("jewelry-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("collections").insert({
        name: newCollection.name,
        slug: newCollection.slug || newCollection.name.toLowerCase().replace(/\s+/g, "-"),
        short_description: newCollection.short_description,
        description: newCollection.description,
      });

      if (error) throw error;

      toast.success("Collection created successfully!");
      setNewCollection({ name: "", slug: "", short_description: "", description: "" });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create collection");
    }
  };

  const handleCreateSet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("jewelry_sets").insert({
        name: newSet.name,
        slug: newSet.slug || newSet.name.toLowerCase().replace(/\s+/g, "-"),
        short_description: newSet.short_description,
        description: newSet.description,
        base_price: parseFloat(newSet.base_price) || 0,
        has_diamond: newSet.has_diamond,
        collection_id: newSet.collection_id || null,
      });

      if (error) throw error;

      toast.success("Jewelry set created successfully!");
      setNewSet({
        name: "",
        slug: "",
        short_description: "",
        description: "",
        base_price: "",
        has_diamond: false,
        collection_id: "",
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create jewelry set");
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    
    try {
      const { error } = await supabase.from("collections").delete().eq("id", id);
      if (error) throw error;
      toast.success("Collection deleted");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete collection");
    }
  };

  const handleDeleteSet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this jewelry set?")) return;
    
    try {
      const { error } = await supabase.from("jewelry_sets").delete().eq("id", id);
      if (error) throw error;
      toast.success("Jewelry set deleted");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete jewelry set");
    }
  };

  // Edit handlers
  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setEditCollectionForm({
      name: collection.name,
      slug: collection.slug,
      short_description: collection.short_description || "",
      description: collection.description || "",
      featured: collection.featured || false,
      display_order: collection.display_order || 0,
    });
  };

  const handleEditSet = (set: JewelrySet) => {
    setEditingSet(set);
    setEditSetForm({
      name: set.name,
      slug: set.slug,
      short_description: set.short_description || "",
      description: set.description || "",
      base_price: set.base_price?.toString() || "",
      has_diamond: set.has_diamond || false,
      featured: set.featured || false,
      collection_id: set.collection_id || "",
    });
  };

  const handleUpdateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection) return;

    try {
      const { error } = await supabase
        .from("collections")
        .update({
          name: editCollectionForm.name,
          slug: editCollectionForm.slug,
          short_description: editCollectionForm.short_description,
          description: editCollectionForm.description,
          featured: editCollectionForm.featured,
          display_order: editCollectionForm.display_order,
        })
        .eq("id", editingCollection.id);

      if (error) throw error;

      toast.success("Collection updated successfully!");
      setEditingCollection(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update collection");
    }
  };

  const handleUpdateSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSet) return;

    try {
      const { error } = await supabase
        .from("jewelry_sets")
        .update({
          name: editSetForm.name,
          slug: editSetForm.slug,
          short_description: editSetForm.short_description,
          description: editSetForm.description,
          base_price: parseFloat(editSetForm.base_price) || 0,
          has_diamond: editSetForm.has_diamond,
          featured: editSetForm.featured,
          collection_id: editSetForm.collection_id || null,
        })
        .eq("id", editingSet.id);

      if (error) throw error;

      toast.success("Jewelry set updated successfully!");
      setEditingSet(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update jewelry set");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, `sets/${setId}`);
      if (url) {
        // Add to jewelry_media
        const { error } = await supabase.from("jewelry_media").insert({
          set_id: setId,
          type: file.type.startsWith("video/") ? "video" : "image",
          url,
          alt_text: file.name,
        });

        if (error) throw error;
        toast.success("Image uploaded successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={devjiLogo} alt="Devji" className="h-10 brightness-0 invert" />
            <span className="text-foreground font-serif text-lg">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm hidden md:block">
              {user?.email}
            </span>
            <Button variant="goldOutline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="collections" className="space-y-6">
          <TabsList className="bg-card border border-border/30">
            <TabsTrigger value="collections" className="data-[state=active]:bg-primary/10">
              <Layers className="w-4 h-4 mr-2" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="sets" className="data-[state=active]:bg-primary/10">
              <Package className="w-4 h-4 mr-2" />
              Jewelry Sets
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-primary/10">
              <Image className="w-4 h-4 mr-2" />
              Media
            </TabsTrigger>
          </TabsList>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Collection Form */}
              <motion.div
                className="luxury-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-serif text-xl text-foreground mb-4">
                  <Plus className="w-5 h-5 inline mr-2" />
                  Create Collection
                </h2>
                <form onSubmit={handleCreateCollection} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={newCollection.name}
                      onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                      placeholder="Collection name"
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug (URL-friendly name)</Label>
                    <Input
                      value={newCollection.slug}
                      onChange={(e) => setNewCollection({ ...newCollection, slug: e.target.value })}
                      placeholder="collection-name"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Input
                      value={newCollection.short_description}
                      onChange={(e) => setNewCollection({ ...newCollection, short_description: e.target.value })}
                      placeholder="Brief description"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Full Description</Label>
                    <Textarea
                      value={newCollection.description}
                      onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                      placeholder="Detailed description"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <Button type="submit" variant="gold" className="w-full">
                    Create Collection
                  </Button>
                </form>
              </motion.div>

              {/* Collections List */}
              <motion.div
                className="luxury-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-serif text-xl text-foreground mb-4">
                  Existing Collections ({collections.length})
                </h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {collections.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No collections yet. Create your first one!
                    </p>
                  ) : (
                    collections.map((collection) => (
                      <div
                        key={collection.id}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">{collection.name}</p>
                          <p className="text-sm text-muted-foreground">{collection.short_description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCollection(collection)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCollection(collection.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Jewelry Sets Tab */}
          <TabsContent value="sets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Set Form */}
              <motion.div
                className="luxury-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-serif text-xl text-foreground mb-4">
                  <Plus className="w-5 h-5 inline mr-2" />
                  Create Jewelry Set
                </h2>
                <form onSubmit={handleCreateSet} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={newSet.name}
                      onChange={(e) => setNewSet({ ...newSet, name: e.target.value })}
                      placeholder="Set name"
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Collection</Label>
                    <select
                      value={newSet.collection_id}
                      onChange={(e) => setNewSet({ ...newSet, collection_id: e.target.value })}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-md text-foreground"
                    >
                      <option value="">Select collection</option>
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Base Price (BHD)</Label>
                    <Input
                      type="number"
                      value={newSet.base_price}
                      onChange={(e) => setNewSet({ ...newSet, base_price: e.target.value })}
                      placeholder="0.00"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Input
                      value={newSet.short_description}
                      onChange={(e) => setNewSet({ ...newSet, short_description: e.target.value })}
                      placeholder="Brief description"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Full Description</Label>
                    <Textarea
                      value={newSet.description}
                      onChange={(e) => setNewSet({ ...newSet, description: e.target.value })}
                      placeholder="Detailed description"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasDiamond"
                      checked={newSet.has_diamond}
                      onChange={(e) => setNewSet({ ...newSet, has_diamond: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="hasDiamond">Has Diamond</Label>
                  </div>
                  <Button type="submit" variant="gold" className="w-full">
                    Create Jewelry Set
                  </Button>
                </form>
              </motion.div>

              {/* Sets List */}
              <motion.div
                className="luxury-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-serif text-xl text-foreground mb-4">
                  Existing Jewelry Sets ({jewelrySets.length})
                </h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {jewelrySets.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No jewelry sets yet. Create your first one!
                    </p>
                  ) : (
                    jewelrySets.map((set) => (
                      <div
                        key={set.id}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{set.name}</p>
                          <p className="text-sm text-muted-foreground">{set.short_description}</p>
                          <p className="text-xs text-primary mt-1">
                            {set.base_price ? `${set.base_price} BHD` : "Price not set"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, set.id)}
                              disabled={uploading}
                            />
                            <Button variant="ghost" size="icon" asChild>
                              <span>
                                <Upload className="w-4 h-4" />
                              </span>
                            </Button>
                          </label>
                          <Button variant="ghost" size="icon" onClick={() => handleEditSet(set)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSet(set.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <motion.div
              className="luxury-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-serif text-xl text-foreground mb-4">
                Media Management
              </h2>
              <p className="text-muted-foreground">
                Upload images and videos for your jewelry sets. Select a set from the Jewelry Sets tab and click the upload icon to add media.
              </p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {jewelrySets.map((set) => (
                  <div key={set.id} className="bg-secondary rounded-lg p-4">
                    <p className="font-medium text-sm text-foreground mb-2">{set.name}</p>
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, set.id)}
                        disabled={uploading}
                      />
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                        <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">
                          {uploading ? "Uploading..." : "Click to upload"}
                        </span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Collection Modal */}
      <Dialog open={!!editingCollection} onOpenChange={() => setEditingCollection(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-foreground">Edit Collection</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCollection} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editCollectionForm.name}
                onChange={(e) => setEditCollectionForm({ ...editCollectionForm, name: e.target.value })}
                placeholder="Collection name"
                required
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL-friendly name)</Label>
              <Input
                value={editCollectionForm.slug}
                onChange={(e) => setEditCollectionForm({ ...editCollectionForm, slug: e.target.value })}
                placeholder="collection-name"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Short Description</Label>
              <Input
                value={editCollectionForm.short_description}
                onChange={(e) => setEditCollectionForm({ ...editCollectionForm, short_description: e.target.value })}
                placeholder="Brief description"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Full Description</Label>
              <Textarea
                value={editCollectionForm.description}
                onChange={(e) => setEditCollectionForm({ ...editCollectionForm, description: e.target.value })}
                placeholder="Detailed description"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={editCollectionForm.display_order}
                onChange={(e) => setEditCollectionForm({ ...editCollectionForm, display_order: parseInt(e.target.value) || 0 })}
                className="bg-secondary border-border"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editCollectionFeatured"
                checked={editCollectionForm.featured}
                onChange={(e) => setEditCollectionForm({ ...editCollectionForm, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="editCollectionFeatured">Featured Collection</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingCollection(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Jewelry Set Modal */}
      <Dialog open={!!editingSet} onOpenChange={() => setEditingSet(null)}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-foreground">Edit Jewelry Set</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSet} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editSetForm.name}
                onChange={(e) => setEditSetForm({ ...editSetForm, name: e.target.value })}
                placeholder="Set name"
                required
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Collection</Label>
              <select
                value={editSetForm.collection_id}
                onChange={(e) => setEditSetForm({ ...editSetForm, collection_id: e.target.value })}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-md text-foreground"
              >
                <option value="">Select collection</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Base Price (BHD)</Label>
              <Input
                type="number"
                value={editSetForm.base_price}
                onChange={(e) => setEditSetForm({ ...editSetForm, base_price: e.target.value })}
                placeholder="0.00"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL-friendly name)</Label>
              <Input
                value={editSetForm.slug}
                onChange={(e) => setEditSetForm({ ...editSetForm, slug: e.target.value })}
                placeholder="set-name"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Short Description</Label>
              <Input
                value={editSetForm.short_description}
                onChange={(e) => setEditSetForm({ ...editSetForm, short_description: e.target.value })}
                placeholder="Brief description"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Full Description</Label>
              <Textarea
                value={editSetForm.description}
                onChange={(e) => setEditSetForm({ ...editSetForm, description: e.target.value })}
                placeholder="Detailed description"
                className="bg-secondary border-border"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editSetHasDiamond"
                  checked={editSetForm.has_diamond}
                  onChange={(e) => setEditSetForm({ ...editSetForm, has_diamond: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="editSetHasDiamond">Has Diamond</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editSetFeatured"
                  checked={editSetForm.featured}
                  onChange={(e) => setEditSetForm({ ...editSetForm, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="editSetFeatured">Featured</Label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingSet(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
