import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, initialProducts, ProductCategory } from "../data/products";

export type { ProductCategory };

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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pendente" | "preparando" | "saiu_entrega" | "entregue" | "cancelado";
  createdAt: Date;
  deliveryAddress?: string;
  paymentMethod?: string;
}

export interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  rating: number;
  text: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  phone?: string;
  email?: string;
  address?: string;
  loyaltyPoints: number;
  memberSince: Date;
}

const defaultProfile: UserProfile = {
  id: "user-1",
  name: "Usuario",
  handle: "usuario",
  avatar: "",
  loyaltyPoints: 0,
  memberSince: new Date(),
};

const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    userId: "user-carlos",
    userName: "Carlos Eduardo",
    userHandle: "carlos_edu",
    userAvatar: "https://readdy.ai/api/search-image?query=portrait+young+brazilian+man+smiling&width=200&height=200&seq=14&orientation=squarish",
    rating: 5,
    text: "Moro sozinho e a Marmitaria Vitoria salvou a minha vida. O tempero e maravilhoso, lembra comida de mae. E a entrega sempre no horario!",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "test-2",
    userId: "user-mariana",
    userName: "Mariana Silva",
    userHandle: "mari_silva",
    userAvatar: "https://readdy.ai/api/search-image?query=portrait+young+brazilian+woman+smiling&width=200&height=200&seq=15&orientation=squarish",
    rating: 5,
    text: "O churrasco no kilo no fim de semana e de lei aqui em casa. Picanha sempre no ponto, farofa perfeita. Melhor custo-beneficio de Campo Novo.",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "test-3",
    userId: "user-joao",
    userName: "Joao Pedro",
    userHandle: "joaopedro_fit",
    userAvatar: "https://readdy.ai/api/search-image?query=portrait+brazilian+young+man+athletic&width=200&height=200&seq=50&orientation=squarish",
    rating: 4,
    text: "As marmitas fitness sao otimas para quem treina. Frango com batata doce no ponto certo, e a porcao e generosa. Recomendo!",
    createdAt: new Date("2024-03-10"),
  },
];

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
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
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void;
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, "id" | "createdAt">) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addLoyaltyPoints: (points: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [siteImages, setSiteImages] = useState<SiteImages>(defaultSiteImages);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

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
    const savedOrders = localStorage.getItem("vitoria_orders");
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders.map((o: Order) => ({ ...o, createdAt: new Date(o.createdAt) })));
      } catch (e) {
        console.error("Failed to parse saved orders");
      }
    }
    const savedTestimonials = localStorage.getItem("vitoria_testimonials");
    if (savedTestimonials) {
      try {
        const parsedTestimonials = JSON.parse(savedTestimonials);
        setTestimonials(parsedTestimonials.map((t: Testimonial) => ({ ...t, createdAt: new Date(t.createdAt) })));
      } catch (e) {
        console.error("Failed to parse saved testimonials");
      }
    }
    const savedProfile = localStorage.getItem("vitoria_profile");
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile({ ...parsedProfile, memberSince: new Date(parsedProfile.memberSince) });
      } catch (e) {
        console.error("Failed to parse saved profile");
      }
    }
    const savedCart = localStorage.getItem("vitoria_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse saved cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vitoria_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("vitoria_site_images", JSON.stringify(siteImages));
  }, [siteImages]);

  useEffect(() => {
    localStorage.setItem("vitoria_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("vitoria_testimonials", JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem("vitoria_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("vitoria_cart", JSON.stringify(cart));
  }, [cart]);

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

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const addOrder = (order: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      createdAt: new Date(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    // Add loyalty points (1 point per R$10)
    const pointsEarned = Math.floor(order.total / 10);
    if (pointsEarned > 0) {
      addLoyaltyPoints(pointsEarned);
    }
  };

  const addTestimonial = (testimonial: Omit<Testimonial, "id" | "createdAt">) => {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: `test-${Date.now()}`,
      createdAt: new Date(),
    };
    setTestimonials((prev) => [newTestimonial, ...prev]);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addLoyaltyPoints = (points: number) => {
    setProfile((prev) => ({ ...prev, loyaltyPoints: prev.loyaltyPoints + points }));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
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
        orders,
        addOrder,
        testimonials,
        addTestimonial,
        profile,
        updateProfile,
        addLoyaltyPoints,
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
