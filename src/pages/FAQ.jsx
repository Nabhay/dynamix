import React, { useState, useEffect, useRef } from 'react';
import AnimatedList from '../components/AnimatedList';

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const faqListRef = useRef(null);
  const isScrolling = useRef(false);
  const autoScrollInterval = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const faqData = [
    {
      question: "Lorem ipsum dolor sit amet consectetur?",
      answer: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris."
    },
    {
      question: "Consectetur adipiscing elit sed do eiusmod?",
      answer: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      question: "Tempor incididunt ut labore et dolore?",
      answer: "Ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor."
    },
    {
      question: "Magna aliqua ut enim ad minim veniam?",
      answer: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat."
    },
    {
      question: "Nostrud exercitation ullamco laboris nisi?",
      answer: "Ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat."
    },
    {
      question: "Aliquip ex ea commodo consequat duis?",
      answer: "Aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia."
    }
  ];

  // Stepper scroll logic
  useEffect(() => {
    const list = faqListRef.current;
    if (!list) return;
    let lastTouchY = null;
    const handleWheel = (e) => {
      e.preventDefault();
      if (isScrolling.current) return;
      isScrolling.current = true;
      setTimeout(() => { isScrolling.current = false; }, 350);
      if (e.deltaY > 0) {
        setExpandedIndex(idx => Math.min(idx + 1, faqData.length - 1));
      } else if (e.deltaY < 0) {
        setExpandedIndex(idx => Math.max(idx - 1, 0));
      }
    };
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        lastTouchY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e) => {
      if (lastTouchY === null) return;
      const currentY = e.touches[0].clientY;
      const diff = lastTouchY - currentY;
      if (Math.abs(diff) > 30 && !isScrolling.current) {
        isScrolling.current = true;
        setTimeout(() => { isScrolling.current = false; }, 350);
        if (diff > 0) {
          setExpandedIndex(idx => Math.min(idx + 1, faqData.length - 1));
        } else if (diff < 0) {
          setExpandedIndex(idx => Math.max(idx - 1, 0));
        }
        lastTouchY = currentY;
      }
    };
    const handleTouchEnd = () => {
      lastTouchY = null;
    };
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        setExpandedIndex(idx => Math.min(idx + 1, faqData.length - 1));
      } else if (e.key === 'ArrowUp') {
        setExpandedIndex(idx => Math.max(idx - 1, 0));
      }
    };
    list.addEventListener('wheel', handleWheel, { passive: false });
    list.addEventListener('touchstart', handleTouchStart, { passive: false });
    list.addEventListener('touchmove', handleTouchMove, { passive: false });
    list.addEventListener('touchend', handleTouchEnd, { passive: false });
    list.addEventListener('keydown', handleKeyDown);
    list.tabIndex = 0;
    list.style.outline = 'none';
    return () => {
      list.removeEventListener('wheel', handleWheel);
      list.removeEventListener('touchstart', handleTouchStart);
      list.removeEventListener('touchmove', handleTouchMove);
      list.removeEventListener('touchend', handleTouchEnd);
      list.removeEventListener('keydown', handleKeyDown);
    };
  }, [faqData.length]);

  // Auto-advance when not hovered
  useEffect(() => {
    if (!isHovered) {
      autoScrollInterval.current = setInterval(() => {
        setExpandedIndex(idx => {
          if (idx < faqData.length - 1) {
            return idx + 1;
          } else {
            return 0;
          }
        });
      }, 2000);
    } else {
      clearInterval(autoScrollInterval.current);
    }
    return () => clearInterval(autoScrollInterval.current);
  }, [isHovered, faqData.length]);

  const faqItems = faqData.map((item, index) => (
    <div key={index} style={{ 
      marginBottom: '1.2rem',
      transition: 'all 0.6s cubic-bezier(.4,0,.2,1)',
      opacity: expandedIndex === index ? 1 : 0.6,
      transform: expandedIndex === index ? 'scale(1.04)' : 'scale(0.98)',
      pointerEvents: expandedIndex === index ? 'auto' : 'none',
    }}>
      <div style={{
        padding: '1.2rem 1.5rem',
        background: 'rgba(20, 40, 60, 0.7)',
        borderRadius: '24px',
        border: expandedIndex === index ? '2px solid #00b3b3' : '1px solid rgba(0, 140, 140, 0.25)',
        boxShadow: expandedIndex === index ? '0 8px 32px 4px rgba(0,200,200,0.18)' : '0 4px 16px rgba(0,140,140,0.10)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        color: '#fff',
        fontFamily: '"Inter", sans-serif',
        fontWeight: 500,
        fontSize: '1.1rem',
        letterSpacing: '0.01em',
        zIndex: expandedIndex === index ? 2 : 1,
        transition: 'all 0.6s cubic-bezier(.4,0,.2,1)'
      }}>
        {item.question}
      </div>
      {expandedIndex === index && (
        <div style={{
          padding: '1.1rem 1.5rem 1.2rem 1.5rem',
          background: 'rgba(0, 140, 140, 0.18)',
          borderRadius: '0 0 24px 24px',
          border: '1px solid rgba(0, 140, 140, 0.18)',
          marginTop: '-0.2rem',
          marginBottom: '0.2rem',
          boxShadow: '0 2px 12px rgba(0,140,140,0.10)',
          color: 'rgba(255,255,255,0.92)',
          fontSize: '1rem',
          lineHeight: '1.5',
          fontFamily: '"Inter", sans-serif',
          transition: 'all 0.6s cubic-bezier(.4,0,.2,1)'
        }}>
          {item.answer}
        </div>
      )}
    </div>
  ));

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '8rem 4rem 8rem', 
      background: `
        radial-gradient(circle at 15% 85%, rgba(0, 140, 140, 0.6) 0%, transparent 40%),
        radial-gradient(circle at 85% 15%, rgba(25, 59, 112, 0.7) 0%, transparent 45%),
        linear-gradient(135deg, rgba(0, 140, 140, 0.2) 0%, rgba(25, 59, 112, 0.3) 50%, rgba(26, 35, 50, 1) 100%)
      `,
      display: 'flex',
      gap: '4rem',
      alignItems: 'flex-start'
    }}>
      <div style={{ 
        flex: '1',
        paddingRight: '2rem'
      }}>
        <h1 style={{ 
          color: '#ffffff', 
          fontSize: '4rem', 
          fontWeight: 700, 
          marginBottom: '2rem',
          lineHeight: '1.1',
          fontFamily: '"Poppins", sans-serif'
        }}>
          Frequently Asked Questions
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1.2rem',
          lineHeight: '1.6',
          fontFamily: '"Inter", sans-serif',
          marginBottom: '3rem'
        }}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.
        </p>
      </div>
      <div style={{ 
        flex: '1',
        maxWidth: '600px',
        height: 'auto',
        overflow: 'visible',
        outline: 'none',
      }}>
        <div
          id="faq-list"
          ref={faqListRef}
          tabIndex={0}
          style={{ outline: 'none' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {faqItems}
        </div>
      </div>
    </div>
  );
}
