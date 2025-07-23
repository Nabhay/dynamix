import React, { useState } from 'react';
import AnimatedList from '../components/AnimatedList';

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState(null);

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
    },
    {
      question: "Irure dolor in reprehenderit in voluptate?",
      answer: "Velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      question: "Esse cillum dolore eu fugiat nulla?",
      answer: "Pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis unde omnis iste natus."
    },
    {
      question: "Excepteur sint occaecat cupidatat non?",
      answer: "Proident sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
    },
    {
      question: "Sunt in culpa qui officia deserunt?",
      answer: "Mollit anim id est laborum sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo."
    }
  ];

  const handleQuestionSelect = (item, index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqItems = faqData.map((item, index) => (
    <div key={index}>
      <div style={{
        padding: '0.5rem 0.8rem',
        background: 'linear-gradient(135deg, rgba(0, 140, 140, 0.2) 0%, rgba(25, 59, 112, 0.15) 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(0, 140, 140, 0.3)',
        cursor: 'pointer',
        marginBottom: expandedIndex === index ? '0' : '0.3rem',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 32px rgba(0, 140, 140, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 140, 140, 0.3) 0%, rgba(25, 59, 112, 0.2) 100%)',
          opacity: expandedIndex === index ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }} />
        <h3 style={{
          color: '#ffffff',
          fontSize: '0.75rem',
          fontWeight: 500,
          margin: 0,
          fontFamily: '"Inter", sans-serif',
          position: 'relative',
          zIndex: 1
        }}>
          {item.question}
        </h3>
      </div>
      {expandedIndex === index && (
        <div style={{
          padding: '0.8rem',
          background: 'linear-gradient(135deg, rgba(0, 140, 140, 0.25) 0%, rgba(0, 140, 140, 0.15) 100%)',
          borderRadius: '0 0 24px 24px',
          border: '1px solid rgba(0, 140, 140, 0.4)',
          borderTop: 'none',
          marginBottom: '0.3rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 140, 140, 0.2)'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.75rem',
            lineHeight: '1.4',
            margin: 0,
            fontFamily: '"Inter", sans-serif'
          }}>
            {item.answer}
          </p>
        </div>
      )}
    </div>
  ));

  return (
    <div style={{ 
      height: '100vh', 
      padding: '8rem 4rem 8rem', 
      background: `
        radial-gradient(circle at 15% 85%, rgba(0, 140, 140, 0.6) 0%, transparent 40%),
        radial-gradient(circle at 85% 15%, rgba(25, 59, 112, 0.7) 0%, transparent 45%),
        linear-gradient(135deg, rgba(0, 140, 140, 0.2) 0%, rgba(25, 59, 112, 0.3) 50%, rgba(26, 35, 50, 1) 100%)
      `,
      display: 'flex',
      gap: '4rem',
      alignItems: 'flex-start',
      overflow: 'hidden',
      overscrollBehavior: 'none'
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
        height: '100%',
        overflow: 'hidden'
      }}>
        <AnimatedList
          items={faqItems}
          onItemSelect={handleQuestionSelect}
          showGradients={false}
          enableArrowNavigation={false}
          displayScrollbar={false}
          initialSelectedIndex={-1}
        />
      </div>
    </div>
  );
}
