import { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./GooeyNav.css";
import logo from '../assets/logo.svg';
import { User } from 'lucide-react';
import Cookies from 'js-cookie';

const GooeyNav = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}) => {
  const location = useLocation();
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = items.findIndex(item => item.href === location.pathname);
    return idx !== -1 ? idx : -1;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Listen for login events and cookie changes
  useEffect(() => {
    const checkLogin = () => {
      const email = Cookies.get('email');
      const password = Cookies.get('password');
      setIsLoggedIn(!!email && !!password);
    };
    checkLogin();
    // Listen for custom login event
    window.addEventListener('user-logged-in', checkLogin);
    // Listen for storage changes (in case of multi-tab)
    window.addEventListener('storage', checkLogin);
    return () => {
      window.removeEventListener('user-logged-in', checkLogin);
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle =
      ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate:
        rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove("active");

      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty(
          "--color",
          `var(--color-${p.color}, white)`
        );
        particle.style.setProperty("--rotate", `${p.rotate}deg`);

        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add("active");
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element) => {
    if (!containerRef.current || !filterRef.current || !textRef.current)
      return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e, index) => {
    const liEl = e.currentTarget.closest('li');
    if (activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(liEl);

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll(".particle");
      particles.forEach((p) => filterRef.current.removeChild(p));
    }

    if (textRef.current) {
      textRef.current.classList.remove("active");

      void textRef.current.offsetWidth;
      textRef.current.classList.add("active");
    }

    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) {
        handleClick({ currentTarget: liEl }, index);
      }
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll("li")[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add("active");
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi =
        navRef.current?.querySelectorAll("li")[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  // Update activeIndex on route change
  useEffect(() => {
    const idx = items.findIndex(item => item.href === location.pathname);
    setActiveIndex(idx !== -1 ? idx : -1);
  }, [location.pathname, items]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      {scrolled ? (
        <div className="gooey-nav-glass">
          <nav>
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img src={logo} alt="Logo" style={{ height: 48, width: 48 }} />
            </Link>
            {!isMobile && (
              <ul ref={navRef}>
                {items.filter(item => !['Sign up / Sign In'].includes(item.label)).map((item, index) => (
                  <li
                    key={index}
                    className={activeIndex === index ? 'active' : ''}
                  >
                    <Link
                      to={item.href}
                      onClick={(e) => handleClick(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      tabIndex={0}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 100 }}>
              {!isMobile && (
                isLoggedIn ? (
                  <div style={{ position: 'relative' }}>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        transition: 'background 0.2s',
                      }}
                      onClick={() => setUserMenuOpen(open => !open)}
                      onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                      aria-label="User menu"
                      tabIndex={0}
                    >
                      <User size={28} />
                    </button>
                    {userMenuOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '110%',
                          background: 'var(--color-mid)',
                          borderRadius: 12,
                          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                          minWidth: 140,
                          zIndex: 200,
                          padding: '0.5rem 0',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <Link
                          to="/profile"
                          style={{
                            color: '#fff',
                            padding: '0.75rem 1.5rem',
                            textDecoration: 'none',
                            fontWeight: 500,
                            fontSize: '1rem',
                            fontFamily: '"Inter", sans-serif',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            borderRadius: 8,
                            transition: 'background 0.2s',
                          }}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          style={{
                            color: '#fff',
                            padding: '0.75rem 1.5rem',
                            textDecoration: 'none',
                            fontWeight: 500,
                            fontSize: '1rem',
                            fontFamily: '"Inter", sans-serif',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            borderRadius: 8,
                            transition: 'background 0.2s',
                          }}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Orders
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/auth" style={{ 
                    textDecoration: 'none', 
                    color: '#ffffff', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '8px', 
                    background: '#008080', 
                    fontWeight: 500, 
                    fontSize: '1rem',
                    fontFamily: '"Inter", sans-serif'
                  }}>Sign Up</Link>
                )
              )}
              {isMobile && (
                <button
                  className="hamburger"
                  aria-label="Toggle menu"
                  onClick={e => { e.stopPropagation(); setMenuOpen(open => !open); }}
                  style={{ marginLeft: '1rem', zIndex: 101 }}
                  type="button"
                >
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar" />
                </button>
              )}
            </div>
            <ul
              className="mobile-dropdown"
              data-open={menuOpen ? "true" : "false"}
            >
              {items.filter(item => !['Sign up / Sign In'].includes(item.label)).map((item, index) => (
                <li
                  key={index}
                  className={activeIndex === index ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  <Link
                    to={item.href}
                    onClick={(e) => handleClick(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    tabIndex={0}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : (
        <nav>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ height: 48, width: 48 }} />
          </Link>
          {!isMobile && (
            <ul ref={navRef}>
              {items.filter(item => !['Sign up / Sign In'].includes(item.label)).map((item, index) => (
                <li
                  key={index}
                  className={activeIndex === index ? 'active' : ''}
                >
                  <Link
                    to={item.href}
                    onClick={(e) => handleClick(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    tabIndex={0}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 100 }}>
            {!isMobile && (
              isLoggedIn ? (
                <div style={{ position: 'relative' }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      transition: 'background 0.2s',
                    }}
                    onClick={() => setUserMenuOpen(open => !open)}
                    onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                    aria-label="User menu"
                    tabIndex={0}
                  >
                    <User size={28} />
                  </button>
                  {userMenuOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '110%',
                        background: 'var(--color-mid)',
                        borderRadius: 12,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                        minWidth: 140,
                        zIndex: 200,
                        padding: '0.5rem 0',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <Link
                        to="/profile"
                        style={{
                          color: '#fff',
                          padding: '0.75rem 1.5rem',
                          textDecoration: 'none',
                          fontWeight: 500,
                          fontSize: '1rem',
                          fontFamily: '"Inter", sans-serif',
                          border: 'none',
                          background: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          borderRadius: 8,
                          transition: 'background 0.2s',
                        }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        style={{
                          color: '#fff',
                          padding: '0.75rem 1.5rem',
                          textDecoration: 'none',
                          fontWeight: 500,
                          fontSize: '1rem',
                          fontFamily: '"Inter", sans-serif',
                          border: 'none',
                          background: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          borderRadius: 8,
                          transition: 'background 0.2s',
                        }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Orders
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/auth" style={{ 
                  textDecoration: 'none', 
                  color: '#ffffff', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '8px', 
                  background: '#008080', 
                  fontWeight: 500, 
                  fontSize: '1rem',
                  fontFamily: '"Inter", sans-serif'
                }}>Sign Up</Link>
              )
            )}
            {isMobile && (
              <button
                className="hamburger"
                aria-label="Toggle menu"
                onClick={e => { e.stopPropagation(); setMenuOpen(open => !open); }}
                style={{ marginLeft: '1rem', zIndex: 101 }}
                type="button"
              >
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
              </button>
            )}
          </div>
          <ul
            className="mobile-dropdown"
            data-open={menuOpen ? "true" : "false"}
          >
            {items.filter(item => !['Sign up / Sign In'].includes(item.label)).map((item, index) => (
              <li
                key={index}
                className={activeIndex === index ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                <Link
                  to={item.href}
                  onClick={(e) => handleClick(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  tabIndex={0}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default GooeyNav;
