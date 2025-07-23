import React, { useState, useEffect } from "react";
import Stepper from "../components/Stepper";
import { getCountries, getCountryCallingCode, isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import Cookies from 'js-cookie';

const loginSteps = ["Email", "Password"];
const signupSteps = ["Info", "Password"];

// Minimal country name map for demo; in production, use a full country name list
const countryNames = {"AF":"Afghanistan","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua and Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia and Herzegovina","BW":"Botswana","BR":"Brazil","IO":"British Indian Ocean Territory","BN":"Brunei","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CA":"Canada","CV":"Cape Verde","KY":"Cayman Islands","CF":"Central African Republic","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos (Keeling) Islands","CO":"Colombia","KM":"Comoros","CG":"Congo (Brazzaville)","CD":"Congo (Kinshasa)","CK":"Cook Islands","CR":"Costa Rica","HR":"Croatia","CU":"Cuba","CY":"Cyprus","CZ":"Czech Republic","DK":"Denmark","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","SZ":"Eswatini","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HN":"Honduras","HK":"Hong Kong","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Iraq","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","CI":"Ivory Coast","JM":"Jamaica","JP":"Japan","JE":"Jersey","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macau","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia","MD":"Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","KP":"North Korea","MK":"North Macedonia","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":"Palestine","PA":"Panama","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"Réunion","RO":"Romania","RU":"Russia","RW":"Rwanda","BL":"Saint Barthélemy","SH":"Saint Helena","KN":"Saint Kitts and Nevis","LC":"Saint Lucia","MF":"Saint Martin","PM":"Saint Pierre and Miquelon","VC":"Saint Vincent and the Grenadines","WS":"Samoa","SM":"San Marino","ST":"Sao Tome and Principe","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SX":"Sint Maarten","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","KR":"South Korea","SS":"South Sudan","ES":"Spain","LK":"Sri Lanka","SD":"Sudan","SR":"Suriname","SE":"Sweden","CH":"Switzerland","SY":"Syria","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad and Tobago","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks and Caicos Islands","TV":"Tuvalu","UG":"Uganda","UA":"Ukraine","AE":"United Arab Emirates","GB":"United Kingdom","US":"United States","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City","VE":"Venezuela","VN":"Vietnam","VI":"Virgin Islands (U.S.)","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe"};


const countryList = getCountries().filter(
  c => countryNames[c]
);

function getPasswordCriteria(password) {
  return {
    length: password.length >= 8,
    capital: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[@_-]/.test(password),
  };
}

function passwordStrength(password) {
  const c = getPasswordCriteria(password);
  return Object.values(c).filter(Boolean).length;
}

function isValidEmail(email) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const AuthPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("US");
  const [phone, setPhone] = useState(""); // E.164 format
  const [rawPhone, setRawPhone] = useState(""); // User input
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const steps = mode === "login" ? loginSteps : signupSteps;
  const [focusedField, setFocusedField] = useState("");

  // Show toast when error changes
  useEffect(() => {
    if (error) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
    }
  }, [error]);

  const handleNext = async () => {
    if (mode === "login") {
      if (activeStep === 0) {
        if (!email) {
          setError("Please enter your email.");
          return;
        }
        if (!isValidEmail(email)) {
          setError("Please enter a valid email address.");
          return;
        }
        setError("");
        setActiveStep(1);
      } else if (activeStep === 1) {
        if (!password) {
          setError("Please enter your password.");
          return;
        }
        setError("");
        // Login API call
        try {
          const res = await fetch("http://127.0.0.1:5000/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.error || "Login failed");
            return;
          }
          // Store token and user_id
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          Cookies.set('email', email, { expires: 7 });
          Cookies.set('password', password, { expires: 7 });
          Cookies.set('user_id', data.user_id, { expires: 7 });
          window.dispatchEvent(new Event('user-logged-in'));
          window.location.href = '/';
        } catch (err) {
          setError("Network error");
        }
      }
    } else {
      // Sign up flow
      if (activeStep === 0) {
        // Validate all three fields: name, email, phone
        if (!name) {
          setError("Please enter your name.");
          return;
        }
        if (!email) {
          setError("Please enter your email.");
          return;
        }
        if (!isValidEmail(email)) {
          setError("Please enter a valid email address.");
          return;
        }
        if (!rawPhone) {
          setError("Please enter your phone number.");
          return;
        }
        // Try to parse and validate phone
        let e164 = "";
        try {
          const parsed = parsePhoneNumber(rawPhone, country);
          if (!parsed.isValid()) {
            setError("Please enter a valid phone number for your country.");
            return;
          }
          e164 = parsed.number;
        } catch {
          setError("Please enter a valid phone number for your country.");
          return;
        }
        setPhone(e164);
        setError("");
        setActiveStep(1);
      } else if (activeStep === 1) {
        if (!password) {
          setError("Please enter your password.");
          return;
        }
        if (!isValidEmail(email)) {
          setError("Please enter a valid email address.");
          return;
        }
        const criteria = getPasswordCriteria(password);
        if (!criteria.length || !criteria.capital || !criteria.number || !criteria.symbol) {
          setError("Password does not meet all strength criteria.");
          return;
        }
        if (!confirmPassword) {
          setError("Please confirm your password.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        setError("");
        // Signup API call
        try {
          const res = await fetch("http://127.0.0.1:5000/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, password })
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.error || "Signup failed");
            return;
          }
          // Set cookies after signup
          Cookies.set('email', email, { expires: 7 });
          Cookies.set('password', password, { expires: 7 });
          Cookies.set('user_id', data.user_id, { expires: 7 });
          window.dispatchEvent(new Event('user-logged-in'));
          window.location.href = '/';
        } catch (err) {
          setError("Network error");
        }
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleSwitchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setActiveStep(0);
    setEmail("");
    setPassword("");
    setName("");
    setCountry("US");
    setPhone("");
    setRawPhone("");
    setOtp("");
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "6rem",
        background: `
          radial-gradient(circle at 15% 85%, rgba(0, 140, 140, 0.6) 0%, transparent 40%),
          radial-gradient(circle at 85% 15%, rgba(25, 59, 112, 0.7) 0%, transparent 45%),
          radial-gradient(circle at 45% 60%, rgba(0, 140, 140, 0.4) 0%, transparent 35%),
          radial-gradient(circle at 70% 80%, rgba(25, 59, 112, 0.5) 0%, transparent 30%),
          linear-gradient(135deg, rgba(0, 140, 140, 0.2) 0%, rgba(25, 59, 112, 0.3) 50%, rgba(26, 35, 50, 1) 100%)
        `,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          background: "var(--color-mid)",
          padding: "2.5rem 2rem 2rem 2rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-glow)",
          minWidth: 340,
          color: "var(--text-light)",
          maxWidth: 360,
          width: "100%",
          maxHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        <h2
          style={{
            marginBottom: "1.5rem",
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: "2rem",
            textAlign: "center",
            letterSpacing: "0.01em",
          }}
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>
        <Stepper steps={steps} activeStep={activeStep} onStepChange={setActiveStep} />
        {/* Toast for errors (not shown in Basic Info step) */}
        {showToast && error && !(mode === 'signup' && activeStep === 0) && (
          <div
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: '#ef4444',
              color: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              fontSize: '1.1rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              zIndex: 9999,
              minWidth: 220,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              animation: 'fadeInToast 0.3s',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 18 }}>!</span>
            <span>{error}</span>
          </div>
        )}
        {/* LOGIN FIELDS */}
        {mode === "login" && activeStep === 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField("")}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-dark)",
              background:
                focusedField === "email"
                  ? "#DDDDDD"
                  : email
                  ? "silver"
                  : "#b0b8b4",
              color: "#333333",
              fontSize: "1rem",
              outline: "none",
              marginBottom: "0.25rem",
              boxShadow: "0 0 8px 0 var(--shadow-glow)",
            }}
            autoComplete="username"
          />
        </div>
        )}
        {mode === "login" && activeStep === 1 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField("")}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-dark)",
              background:
                focusedField === "password"
                  ? "#DDDDDD"
                  : password
                  ? "silver"
                  : "#b0b8b4",
              color: "#333333",
              fontSize: "1rem",
              outline: "none",
              boxShadow: "0 0 8px 0 var(--shadow-glow)",
            }}
            autoComplete="current-password"
          />
        </div>
        )}
        {/* SIGNUP FIELDS */}
        {mode === "signup" && activeStep === 0 && (
          <div style={{ marginBottom: "1.5rem", display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Name */}
            <div style={{ flex: 1, minWidth: 120 }}>
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: error && error.toLowerCase().includes('name') ? '#ef4444' : undefined,
                }}
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  // Live validation
                  if (!e.target.value) {
                    setError("Please enter your name.");
                  } else if (!email) {
                    setError("Please enter your email.");
                  } else if (!isValidEmail(email)) {
                    setError("Please enter a valid email address.");
                  } else if (!rawPhone) {
                    setError("Please enter your phone number.");
                  } else {
                    setError("");
                  }
                }}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField("")}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: error && error.toLowerCase().includes('name') ? '2px solid #ef4444' : '1px solid var(--color-dark)',
                  background:
                    focusedField === "name"
                      ? "#DDDDDD"
                      : name
                      ? "silver"
                      : "#b0b8b4",
                  color: "#333333",
                  fontSize: "1rem",
                  outline: "none",
                  marginBottom: "0.25rem",
                  boxShadow: "0 0 8px 0 var(--shadow-glow)",
                }}
                autoComplete="name"
              />
            </div>
            {/* Email */}
            <div style={{ flex: 1, minWidth: 120 }}>
              <label
                htmlFor="signup-email"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: error && error.toLowerCase().includes('email') ? '#ef4444' : undefined,
                }}
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  // Live validation
                  if (!name) {
                    setError("Please enter your name.");
                  } else if (!e.target.value) {
                    setError("Please enter your email.");
                  } else if (!isValidEmail(e.target.value)) {
                    setError("Please enter a valid email address.");
                  } else if (!rawPhone) {
                    setError("Please enter your phone number.");
                  } else {
                    setError("");
                  }
                }}
                onFocus={() => setFocusedField("signup-email")}
                onBlur={() => setFocusedField("")}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: error && error.toLowerCase().includes('email') ? '2px solid #ef4444' : '1px solid var(--color-dark)',
                  background:
                    focusedField === "signup-email"
                      ? "#DDDDDD"
                      : email
                      ? "silver"
                      : "#b0b8b4",
                  color: "#333333",
                  fontSize: "1rem",
                  outline: "none",
                  marginBottom: "0.25rem",
                  boxShadow: "0 0 8px 0 var(--shadow-glow)",
                }}
                autoComplete="new-email"
              />
            </div>
            {/* Country & Phone */}
            <div style={{ flex: 1, minWidth: 180 }}>
              <label
                htmlFor="country"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: error && error.toLowerCase().includes('country') ? '#ef4444' : undefined,
                }}
              >
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={e => {
                  setCountry(e.target.value);
                  // Live validation
                  if (!name) {
                    setError("Please enter your name.");
                  } else if (!email) {
                    setError("Please enter your email.");
                  } else if (!isValidEmail(email)) {
                    setError("Please enter a valid email address.");
                  } else if (!rawPhone) {
                    setError("Please enter your phone number.");
                  } else {
                    setError("");
                  }
                }}
                onFocus={() => setFocusedField("country")}
                onBlur={() => setFocusedField("")}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.5rem",
                  borderRadius: "0.5rem",
                  border: error && error.toLowerCase().includes('country') ? '2px solid #ef4444' : '1px solid var(--color-dark)',
                  background:
                    focusedField === "country"
                      ? "#DDDDDD"
                      : country
                      ? "silver"
                      : "#b0b8b4",
                  color: "#333333",
                  fontSize: "1rem",
                  outline: "none",
                  marginBottom: "0.5rem",
                  marginRight: 0,
                  appearance: 'none',
                  boxShadow: "0 0 8px 0 var(--shadow-glow)",
                }}
              >
                {countryList.map(c => (
                  <option key={c} value={c}>
                    {countryNames[c]} (+{getCountryCallingCode(c)})
                  </option>
                ))}
              </select>
              <label
                htmlFor="phone"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: error && error.toLowerCase().includes('phone') ? '#ef4444' : undefined,
                }}
              >
                Phone Number
              </label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    background:
                      focusedField === "phone"
                        ? "#DDDDDD"
                        : rawPhone
                        ? "silver"
                        : "#b0b8b4",
                    color: "#333333",
                    border: error && error.toLowerCase().includes('phone') ? '2px solid #ef4444' : '1px solid var(--color-dark)',
                    borderRight: 'none',
                    borderRadius: '0.5rem 0 0 0.5rem',
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 1rem',
                    fontSize: '1rem',
                    minWidth: 56,
                    textAlign: 'center',
                    userSelect: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  {`+${getCountryCallingCode(country)}`}
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={rawPhone}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setRawPhone(val);
                    // Live validation
                    if (!name) {
                      setError("Please enter your name.");
                    } else if (!email) {
                      setError("Please enter your email.");
                    } else if (!isValidEmail(email)) {
                      setError("Please enter a valid email address.");
                    } else if (!val) {
                      setError("Please enter your phone number.");
                    } else {
                      setError("");
                    }
                  }}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField("")}
                  style={{
                    width: "100%",
                    height: 48,
                    padding: "0 1rem",
                    borderRadius: "0 0.5rem 0.5rem 0",
                    border: error && error.toLowerCase().includes('phone') ? '2px solid #ef4444' : '1px solid var(--color-dark)',
                    borderLeft: 'none',
                    background:
                      focusedField === "phone"
                        ? "#DDDDDD"
                        : rawPhone
                        ? "silver"
                        : "#b0b8b4",
                    color: "#333333",
                    fontSize: "1rem",
                    outline: "none",
                    marginBottom: 0,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: "0 0 8px 0 var(--shadow-glow)",
                  }}
                  autoComplete="tel"
                  placeholder={"Phone number"}
                />
              </div>
            </div>
          </div>
        )}
        {mode === "signup" && activeStep === 1 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="signup-password"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusedField("signup-password")}
              onBlur={() => setFocusedField("")}
              style={{
                width: "100%",
                padding: "0.45rem 0.7rem",
                borderRadius: "0.4rem",
                border: "1px solid var(--color-dark)",
                background:
                  focusedField === "signup-password"
                    ? "#DDDDDD"
                    : password
                    ? "silver"
                    : "#b0b8b4",
                color: "#333333",
                fontSize: "0.92rem",
                outline: "none",
                boxShadow: "0 0 8px 0 var(--shadow-glow)",
              }}
              autoComplete="new-password"
            />
            {/* Confirm Password field */}
            <label
              htmlFor="confirm-password"
              style={{
                display: "block",
                marginTop: "1.25rem",
                marginBottom: "0.5rem",
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField("confirm-password")}
              onBlur={() => setFocusedField("")}
              style={{
                width: "100%",
                padding: "0.45rem 0.7rem",
                borderRadius: "0.4rem",
                border: "1px solid var(--color-dark)",
                background:
                  focusedField === "confirm-password"
                    ? "#DDDDDD"
                    : confirmPassword
                    ? "silver"
                    : "#b0b8b4",
                color: "#333333",
                fontSize: "0.92rem",
                outline: "none",
                boxShadow: "0 0 8px 0 var(--shadow-glow)",
              }}
              autoComplete="new-password"
            />
            {/* Password strength criteria and bar below confirm password */}
            <ul style={{
              margin: '1.5rem 0 0 0',
              padding: 0,
              listStyle: 'none',
              fontSize: '0.85rem',
              color: '#333',
            }}>
              {(() => {
                const c = getPasswordCriteria(password);
                return [
                  <li key="length" style={{ color: c.length ? '#00b686' : '#ef4444', marginBottom: 8 }}>
                    {c.length ? '✓' : '✗'} At least 8 characters
                  </li>,
                  <li key="capital" style={{ color: c.capital ? '#00b686' : '#ef4444', marginBottom: 8 }}>
                    {c.capital ? '✓' : '✗'} Capital letter
                  </li>,
                  <li key="number" style={{ color: c.number ? '#00b686' : '#ef4444', marginBottom: 8 }}>
                    {c.number ? '✓' : '✗'} Number
                  </li>,
                  <li key="symbol" style={{ color: c.symbol ? '#00b686' : '#ef4444', marginBottom: 8 }}>
                    {c.symbol ? '✓' : '✗'} Symbol (@, _, -)
                  </li>,
                ];
              })()}
            </ul>
            <div style={{ marginTop: 6, height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${(passwordStrength(password) / 4) * 100}%`,
                height: 8,
                background:
                  passwordStrength(password) === 0
                    ? '#ef4444'
                  : passwordStrength(password) === 1
                    ? 'linear-gradient(90deg, #ef4444 0%, #f59e42 100%)'
                  : passwordStrength(password) === 2
                    ? '#f59e42'
                  : passwordStrength(password) === 3
                    ? 'linear-gradient(90deg, #f59e42 0%, #00b686 100%)'
                  : '#00b686',
                transition: 'width 0.2s',
              }} />
            </div>
            {/* Disable Next button until all criteria are met and passwords match */}
          </div>
        )}
        {/* Remove OTP step and related UI */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {activeStep > 0 && (
            <button
              onClick={handleBack}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "0.5rem",
                background: "var(--color-mid)",
                color: "var(--text-light)",
                fontWeight: 600,
                fontSize: "1.1rem",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              flex: 2,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              background: "var(--color-green)",
              color: "var(--text-light)",
              fontWeight: 600,
              fontSize: "1.1rem",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
              opacity:
                (mode === 'signup' && activeStep === 0 && (error || !name || !email || !country || !rawPhone)) ||
                (mode === 'signup' && activeStep === 1 && (!password || !confirmPassword || password !== confirmPassword || passwordStrength(password) < 4))
                  ? 0.5
                  : 1,
              pointerEvents:
                (mode === 'signup' && activeStep === 0 && (error || !name || !email || !country || !rawPhone)) ||
                (mode === 'signup' && activeStep === 1 && (!password || !confirmPassword || password !== confirmPassword || passwordStrength(password) < 4))
                  ? 'none'
                  : 'auto',
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#009e76")}
            onMouseOut={e => (e.currentTarget.style.background = "var(--color-green)")}
            disabled={
              (mode === 'signup' && activeStep === 0 && (error || !name || !email || !country || !rawPhone)) ||
              (mode === 'signup' && activeStep === 1 && (!password || !confirmPassword || password !== confirmPassword || passwordStrength(password) < 4))
            }
          >
            {activeStep === steps.length - 1 ? (mode === "login" ? "Sign In" : "Sign Up") : "Next"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
          {mode === "login" ? (
            <span style={{ color: "#b0b8c1", fontSize: 15 }}>
              Not signed up?{' '}
              <button
                onClick={handleSwitchMode}
                style={{
                  color: "var(--color-green)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "underline"
                }}
              >
                Sign up
              </button>
            </span>
          ) : (
            <span style={{ color: "#b0b8c1", fontSize: 15 }}>
              Already have an account?{' '}
              <button
                onClick={handleSwitchMode}
                style={{
                  color: "var(--color-green)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "underline"
                }}
              >
                Log in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

