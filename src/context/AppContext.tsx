import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, initialProducts } from "../data/products";

export interface SiteImages {
  heroSlides: string[];
  bannerBg: string;
  testimonialsBg: string;
  testimonialsAvatars: string[];
  benefitsImages: string[];
}

const defaultSiteImages: SiteImages = {
  heroSlides: [
    "https://readdy.ai/api/search-image?query=brazilian+food+marmita+lunch+box+rice+beans+meat+salad+overhead&width=1600&height=1200&seq=1&orientation=landscape",
    "https://readdy.ai/api/search-image?query=brazilian+barbecue+churrasco+grilled+meat+picanha&width=1600&height=1200&seq=2&orientation=landscape",
    "https://readdy.ai/api/search-image?query=food+delivery+driver+delivering+package+red+helmet&width=1600&height=1200&seq=3&orientation=landscape",
  ],
  bannerBg: "https://readdy.ai/api/search-image?query=restaurant+professional+kitchen+chef+cooking+fire+dynamic&width=1600&height=900&seq=10&orientation=landscape",
  testimonialsBg: "https://readdy.ai/api/search-image?query=warm+cozy+brazilian+restaurant+interior+blurred+background&width=1600&height=900&seq=16&orientation=landscape",
  testimonialsAvatars: [
    "https://readdy.ai/api/search-image?query=portrait+young+brazilian+man+smiling&width=200&height=200&seq=14&orientation=squarish",
    "https://readdy.ai/api/search-image?query=portrait+young+brazilian+woman+smiling&width=200&height=200&seq=15&orientation=squarish",
  ],
  benefitsImages: [
    "https://readdy.ai/api/search-image?query=fresh+ingredients+vegetables+kitchen+prep+tomatoes+crisp&width=800&height=800&seq=11&orientation=squarish",
    "https://readdy.ai/api/search-image?query=express+food+delivery+motorcycle+red+delivery+box+motion+blur&width=800&height=800&seq=12&orientation=squarish",
    "https://readdy.ai/api/search-image?query=variety+of+delicious+brazilian+food+dishes+buffet+overhead&width=800&height=800&seq=13&orientation=squarish",
  ],
};

interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  siteImages: SiteImages;
  setSiteImages: React.Dispatch<React.SetStateAction<SiteImages>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [siteImages, setSiteImages] = useState<SiteImages>(defaultSiteImages);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load from local storage for persistence during modifications
  useEffect(() => {
    const savedProducts = localStorage.getItem("vitoria_products");
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to parse saved products");
      }
    }
    const savedImages = localStorage.getItem("vitoria_site_images");
    if (savedImages) {
      try {
        setSiteImages(JSON.parse(savedImages));
      } catch (e) {
        console.error("Failed to parse saved images");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vitoria_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("vitoria_site_images", JSON.stringify(siteImages));
  }, [siteImages]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isOrderModalOpen,
        setIsOrderModalOpen,
        isAdmin,
        setIsAdmin,
        siteImages,
        setSiteImages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
