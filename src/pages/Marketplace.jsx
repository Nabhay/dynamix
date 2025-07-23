import React, { useState, useRef } from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const SpotlightCard = ({ children, className = "", style = {} }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
        border: "1px solid #1e293b",
        background: "linear-gradient(to right, #0f172a, #1e293b)",
        padding: "1.5rem",
        ...style
      }}
    >
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: "-1px",
          opacity: opacity,
          transition: "opacity 300ms",
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, cart, onQuantityChange }) => {
  const cartItem = cart.find(item => item.id === product.id);
  return (
    <SpotlightCard style={{ height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
        <div style={{ marginBottom: "1rem" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "12rem",
              objectFit: "cover",
              borderRadius: "0.5rem",
            }}
          />
        </div>
        <div style={{ flexGrow: 1 }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#fff", marginBottom: "0.5rem" }}>
            {product.name}
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "1rem", lineHeight: "1.5" }}>
            {product.description}
          </p>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#60a5fa", marginBottom: "1rem" }}>
            ${product.price}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
          {cartItem && cartItem.quantity > 0 ? (
            <input
              type="number"
              min={0}
              value={cartItem.quantity}
              onChange={e => onQuantityChange(product, Number(e.target.value))}
              style={{
                width: 64,
                borderRadius: 8,
                border: 'none',
                padding: '0.5rem 1rem',
                textAlign: 'center',
                fontWeight: 700,
                background: '#2563eb',
                color: '#fff',
                fontSize: '1rem',
                height: 40,
                outline: 'none',
                boxShadow: '0 0 0 2px #2563eb22',
                transition: 'box-shadow 0.2s',
              }}
            />
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s",
                height: 40,
                fontWeight: 700,
                fontSize: '1rem',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
            >
              <Plus size={16} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

const getCartFromCookie = () => {
  const cart = Cookies.get('cart');
  return cart ? JSON.parse(cart) : [];
};
const setCartToCookie = (cart) => {
  Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
};

const MarketplacePage = () => {
  const [cart, setCart] = useState(getCartFromCookie());
  const [cartCount, setCartCount] = useState(cart.reduce((acc, item) => acc + (item.quantity || 1), 0));
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Aetherium Ingot",
      price: 12.99,
      image: "./src/assets/1.png",
      description: "A solid ingot of superconductive Aetherium, used in high-efficiency power grids."
    },
    {
      id: 2,
      name: "NeuroSteel Rod",
      price: 23.99,
      image: "./src/assets/2.png",
      description: "Precision-forged rod of NeuroSteel, ideal for robotic actuators and exoskeletons."
    },
    {
      id: 3,
      name: "Cobaltite Plate",
      price: 33.99,
      image: "./src/assets/3.png",
      description: "A high-purity cobaltite plate, essential for battery arrays and energy storage."
    },
    {
      id: 4,
      name: "Iridium Alloy Core",
      price: 89.99,
      image: "./src/assets/4.png",
      description: "Dense iridium alloy core, highly resistant to corrosion and used in quantum processors."
    },
    {
      id: 5,
      name: "Titanite Fragment",
      price: 17.49,
      image: "./src/assets/5.png",
      description: "A fragment of titanite, valued for its strength-to-weight ratio in aerospace engineering."
    },
    {
      id: 6,
      name: "Vibranium Bar",
      price: 27.99,
      image: "./src/assets/6.png",
      description: "A solid bar of vibranium, legendary for its energy absorption and vibration dampening."
    },
    {
      id: 7,
      name: "Synaptium Crystal",
      price: 33.99,
      image: "./src/assets/7.png",
      description: "Polished disc of Synaptium alloy, used in AI hardware for rapid neural data transfer."
    },
    {
      id: 8,
      name: "Abyssium Crystal Cluster",
      price: 59.99,
      image: "./src/assets/8.png",
      description: "A cluster of deep-sea Abyssium crystals, highly conductive for marine energy grids."
    },
    {
      id: 9,
      name: "GeoCore Metal Alloy",
      price: 23.99,
      image: "./src/assets/9.png",
      description: "A dense sphere of GeoCore metal, ideal for seismic sensors and geophysical equipment."
    },
    {
      id: 10,
      name: "NanoSteel Mesh",
      price: 12.99,
      image: "./src/assets/10.png",
      description: "Flexible mesh of NanoSteel, self-repairing and perfect for advanced construction."
    },
    {
      id: 11,
      name: "Hydronium Alloy Block",
      price: 33.99,
      image: "./src/assets/11.png",
      description: "A solid block of hydronium alloy, used in safe extraction of underwater methane hydrates."
    },
    {
      id: 12,
      name: "EchoTitan Beacon",
      price: 19.99,
      image: "./src/assets/12.png",
      description: "A titanium-based beacon that emits sonar pulses, guiding autonomous subs in the deep sea."
    }
  ];

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map(item => item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      setCartToCookie(newCart);
      setCartCount(newCart.reduce((acc, item) => acc + (item.quantity || 1), 0));
      return newCart;
    });
  };

  const handleQuantityChange = (product, quantity) => {
    setCart(prev => {
      let newCart;
      if (quantity <= 0) {
        newCart = prev.filter(item => item.id !== product.id);
      } else {
        const exists = prev.find(item => item.id === product.id);
        if (exists) {
          newCart = prev.map(item => item.id === product.id ? { ...item, quantity } : item);
        } else {
          newCart = [...prev, { ...product, quantity }];
        }
      }
      setCartToCookie(newCart);
      setCartCount(newCart.reduce((acc, item) => acc + (item.quantity || 1), 0));
      return newCart;
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "96px 4rem 4rem", // Add 96px top padding for navbar spacing
        background: `
          radial-gradient(circle at 15% 85%, rgba(0, 140, 140, 0.6) 0%, transparent 40%),
          radial-gradient(circle at 85% 15%, rgba(25, 59, 112, 0.7) 0%, transparent 45%),
          radial-gradient(circle at 45% 60%, rgba(0, 140, 140, 0.4) 0%, transparent 35%),
          radial-gradient(circle at 70% 80%, rgba(25, 59, 112, 0.5) 0%, transparent 30%),
          linear-gradient(135deg, rgba(0, 140, 140, 0.2) 0%, rgba(25, 59, 112, 0.3) 50%, rgba(26, 35, 50, 1) 100%)
        `,
        fontFamily: '"Inter", sans-serif',
        color: "var(--text-light)",
        overscrollBehavior: "none"
      }}
    >
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}>
          <div>
            <h1 style={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "3.5rem",
              fontWeight: 700,
              color: "var(--text-light)",
              marginBottom: "0.5rem",
              lineHeight: 1.1
            }}>
              Tech Marketplace
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>
              Discover premium tech accessories and gadgets
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <button
              style={{
                backgroundColor: "#1e293b",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                border: "none",
                cursor: "pointer"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#334155"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
              onClick={() => navigate('/checkout')}
            >
              <ShoppingCart size={20} />
              Cart ({cartCount})
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem"
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} cart={cart} onQuantityChange={handleQuantityChange} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;