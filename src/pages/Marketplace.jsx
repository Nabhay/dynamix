import React, { useState, useRef } from 'react';
import { ShoppingCart, Plus } from 'lucide-react';

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

const ProductCard = ({ product, onAddToCart }) => {
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
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
          >
            <Plus size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </SpotlightCard>
  );
};

const MarketplacePage = () => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const products = [{
      id: 1,
      name: "Wireless Headphones",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      description: "Premium wireless headphones with noise-cancelling technology and 30-hour battery life. Perfect for music lovers and professionals."
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      description: "Advanced smartwatch with health monitoring, GPS tracking, and seamless smartphone integration. Water-resistant design."
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
      description: "Ergonomic aluminum laptop stand that improves posture and reduces neck strain. Compatible with all laptop sizes."
    },
    {
      id: 4,
      name: "Mechanical Keyboard",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=300&fit=crop",
      description: "RGB mechanical keyboard with tactile switches, customizable lighting, and programmable keys for gaming and productivity."
    },
    {
      id: 5,
      name: "Wireless Mouse",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop",
      description: "Precision wireless mouse with ergonomic design, long battery life, and customizable DPI settings for any task."
    },
    {
      id: 6,
      name: "USB-C Hub",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=300&fit=crop",
      description: "Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and fast charging capabilities for modern devices."
    },
    {
      id: 7,
      name: "Portable Speaker",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
      description: "Waterproof Bluetooth speaker with 360-degree sound, 12-hour battery, and rugged design for outdoor adventures."
    },
    {
      id: 8,
      name: "Phone Case",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
      description: "Military-grade protective case with shock absorption, wireless charging support, and premium materials."
    },
    {
      id: 9,
      name: "Desk Lamp",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
      description: "LED desk lamp with adjustable brightness, color temperature control, and USB charging port. Eye-care technology."
    },
    {
      id: 10,
      name: "Cable Organizer",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      description: "Magnetic cable management system that keeps your workspace tidy and cables easily accessible. Multiple sizes included."
    },
    {
      id: 11,
      name: "Power Bank",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1609592432032-3a8daa2e937b?w=400&h=300&fit=crop",
      description: "High-capacity portable charger with fast charging, multiple ports, and LED display showing remaining power."
    },
    {
      id: 12,
      name: "Monitor Stand",
      price: 119.99,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
      description: "Adjustable monitor stand with height, tilt, and rotation controls. Improves ergonomics and saves desk space."
    }
  ];

  const handleAddToCart = (product) => {
    setCart(prev => [...prev, product]);
    setCartCount(prev => prev + 1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "100vh",
        overflowY: "auto",
        padding: "8rem 4rem 8rem", // Top, right/left, and bottom padding
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
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;