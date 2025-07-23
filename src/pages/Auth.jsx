import React, { useState } from "react";
import Stepper from "../components/Stepper";
import { getCountries, getCountryCallingCode, isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

const loginSteps = ["Email", "Password"];
const signupSteps = ["Basic Info", "Password", "OTP"];

// Minimal country name map for demo; in production, use a full country name list
const countryNames = {"AF":"Afghanistan","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua and Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia and Herzegovina","BW":"Botswana","BR":"Brazil","IO":"British Indian Ocean Territory","BN":"Brunei","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CA":"Canada","CV":"Cape Verde","KY":"Cayman Islands","CF":"Central African Republic","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos (Keeling) Islands","CO":"Colombia","KM":"Comoros","CG":"Congo (Brazzaville)","CD":"Congo (Kinshasa)","CK":"Cook Islands","CR":"Costa Rica","HR":"Croatia","CU":"Cuba","CY":"Cyprus","CZ":"Czech Republic","DK":"Denmark","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","SZ":"Eswatini","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HN":"Honduras","HK":"Hong Kong","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Iraq","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","CI":"Ivory Coast","JM":"Jamaica","JP":"Japan","JE":"Jersey","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macau","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia","MD":"Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","KP":"North Korea","MK":"North Macedonia","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":"Palestine","PA":"Panama","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"Réunion","RO":"Romania","RU":"Russia","RW":"Rwanda","BL":"Saint Barthélemy","SH":"Saint Helena","KN":"Saint Kitts and Nevis","LC":"Saint Lucia","MF":"Saint Martin","PM":"Saint Pierre and Miquelon","VC":"Saint Vincent and the Grenadines","WS":"Samoa","SM":"San Marino","ST":"Sao Tome and Principe","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SX":"Sint Maarten","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","KR":"South Korea","SS":"South Sudan","ES":"Spain","LK":"Sri Lanka","SD":"Sudan","SR":"Suriname","SE":"Sweden","CH":"Switzerland","SY":"Syria","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad and Tobago","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks and Caicos Islands","TV":"Tuvalu","UG":"Uganda","UA":"Ukraine","AE":"United Arab Emirates","GB":"United Kingdom","US":"United States","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City","VE":"Venezuela","VN":"Vietnam","VI":"Virgin Islands (U.S.)","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe"};


const countryList = getCountries().filter(
  c => countryNames[c]
);

const AuthPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("US");
  const [phone, setPhone] = useState(""); // E.164 format
  const [rawPhone, setRawPhone] = useState(""); // User input
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const steps = mode === "login" ? loginSteps : signupSteps;

  const handleNext = () => {
    if (mode === "login") {
      if (activeStep === 0) {
        if (!email) {
          setError("Please enter your email.");
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
    // Handle login logic here
    alert("Logged in!");
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
        setError("");
        setActiveStep(2);
        setTimeout(() => alert("OTP sent to your email! (simulated)"), 300);
      } else if (activeStep === 2) {
        if (!otp) {
          setError("Please enter the OTP sent to your email.");
          return;
        }
        setError("");
        alert("Signed up!");
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
          boxShadow: "var(--shadow-green)",
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
        {error && (
          <div
            style={{
              background: "#ef4444",
              color: "var(--text-light)",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              fontSize: "1rem",
              textAlign: "center",
            }}
          >
            {error}
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
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-dark)",
              background: "var(--color-dark)",
              color: "var(--text-light)",
              fontSize: "1rem",
              outline: "none",
              marginBottom: "0.25rem",
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
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-dark)",
              background: "var(--color-dark)",
              color: "var(--text-light)",
              fontSize: "1rem",
              outline: "none",
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
                }}
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--color-dark)",
                  background: "var(--color-dark)",
                  color: "var(--text-light)",
                  fontSize: "1rem",
                  outline: "none",
                  marginBottom: "0.25rem",
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
                }}
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--color-dark)",
                  background: "var(--color-dark)",
                  color: "var(--text-light)",
                  fontSize: "1rem",
                  outline: "none",
                  marginBottom: "0.25rem",
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
                }}
              >
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={e => setCountry(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--color-dark)",
                  background: "var(--color-dark)",
                  color: "var(--text-light)",
                  fontSize: "1rem",
                  outline: "none",
                  marginBottom: "0.5rem",
                  marginRight: 0,
                  appearance: 'none',
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
                }}
              >
                Phone Number
              </label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  background: 'var(--color-dark)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--color-dark)',
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
                }}>{`+${getCountryCallingCode(country)}`}</span>
                <input
                  id="phone"
                  type="tel"
                  value={rawPhone}
                  onChange={e => setRawPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{
                    width: "100%",
                    height: 48,
                    padding: "0 1rem",
                    borderRadius: "0 0.5rem 0.5rem 0",
                    border: "1px solid var(--color-dark)",
                    borderLeft: 'none',
                    background: "var(--color-dark)",
                    color: "var(--text-light)",
                    fontSize: "1rem",
                    outline: "none",
                    marginBottom: 0,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
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
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--color-dark)",
                background: "var(--color-dark)",
                color: "var(--text-light)",
                fontSize: "1rem",
                outline: "none",
              }}
              autoComplete="new-password"
            />
          </div>
        )}
        {mode === "signup" && activeStep === 2 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="otp"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              OTP (sent to your email)
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--color-dark)",
                background: "var(--color-dark)",
                color: "var(--text-light)",
                fontSize: "1rem",
                outline: "none",
              }}
              autoComplete="one-time-code"
            />
          </div>
        )}
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
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#009e76")}
            onMouseOut={e => (e.currentTarget.style.background = "var(--color-green)")}
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

