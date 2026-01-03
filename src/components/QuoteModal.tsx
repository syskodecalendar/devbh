import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { JewelrySet } from "@/data/products";
import { toast } from "sonner";

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  selectedSets: Array<{ set: JewelrySet; diamondQuality?: string }>;
}

const QuoteModal = ({ open, onClose, selectedSets }: QuoteModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    preferredContact: "whatsapp",
    occasionDate: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Quote request submitted successfully!", {
      description: "Our team will contact you shortly.",
    });

    setIsSubmitting(false);
    onClose();
    setFormData({
      name: "",
      mobile: "",
      email: "",
      preferredContact: "whatsapp",
      occasionDate: "",
      notes: "",
    });
  };

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto luxury-card p-6 md:p-8"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-serif text-2xl text-foreground mb-2">
          Request a Quote
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Fill in your details and we'll get back to you with pricing and
          availability.
        </p>

        {/* Selected items */}
        {selectedSets.length > 0 && (
          <div className="mb-6 p-4 bg-card/50 rounded-lg border border-border/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Selected Items
            </p>
            {selectedSets.map(({ set }) => (
              <p key={set.id} className="text-foreground text-sm">
                • {set.name}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              placeholder="+973 XXXX XXXX"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="your@email.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label>Preferred Contact Method</Label>
            <RadioGroup
              value={formData.preferredContact}
              onValueChange={(value) =>
                setFormData({ ...formData, preferredContact: value })
              }
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp" className="font-normal cursor-pointer">
                  WhatsApp
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="call" id="call" />
                <Label htmlFor="call" className="font-normal cursor-pointer">
                  Call
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="emailOption" />
                <Label htmlFor="emailOption" className="font-normal cursor-pointer">
                  Email
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="occasionDate">Occasion Date (Optional)</Label>
            <Input
              id="occasionDate"
              type="date"
              value={formData.occasionDate}
              onChange={(e) =>
                setFormData({ ...formData, occasionDate: e.target.value })
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any specific requirements or questions..."
              rows={3}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            className="w-full mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Quote Request"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default QuoteModal;
