import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import devjiLogo from "@/assets/devji-logo.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { shortlist, setHasEnteredShowroom } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      // Show header after scrolling past 80% of viewport height
      const scrollThreshold = window.innerHeight * 0.8;
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHomeClick = () => {
    setHasEnteredShowroom(false);
    navigate("/");
  };

  const navItems = [
    { path: "/showroom", label: "Showroom" },
    { path: "/collections", label: "Collections" },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/30"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/showroom" className="flex items-center gap-2">
          <motion.img
            src={devjiLogo}
            alt="Devji"
            className="h-10 md:h-12 w-auto brightness-0 invert"
            whileHover={{ scale: 1.02 }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative py-2"
            >
              <span
                className={`text-sm tracking-wider uppercase transition-colors duration-300 ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </span>
              {location.pathname === item.path && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Home button - resets to door experience */}
          <motion.button
            onClick={handleHomeClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full border border-border/50 hover:border-primary/50 transition-colors duration-300"
            title="Return to entrance"
          >
            <Home className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </motion.button>

          <Link to="/shortlist" className="relative">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full border border-border/50 hover:border-primary/50 transition-colors duration-300"
            >
              <Heart className="w-5 h-5 text-primary" />
              {shortlist.length > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {shortlist.length}
                </motion.span>
              )}
            </motion.div>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className="md:hidden bg-card border-b border-border/30"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm tracking-wider uppercase py-2 ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default Header;
