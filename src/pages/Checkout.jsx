import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Stepper from '../components/Stepper';
import { useNavigate } from 'react-router-dom';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { set, get } from 'idb-keyval';

// Card issuer detection
function getCardIssuer(number) {
  const n = number.replace(/\D/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^6(?:011|5)/.test(n)) return 'discover';
  if (/^35/.test(n)) return 'jcb';
  if (/^3(?:0[0-5]|[68])/.test(n)) return 'dinersclub';
  if (/^62/.test(n)) return 'unionpay';
  return undefined;
}

const getCartFromCookie = () => {
  const cart = Cookies.get('cart');
  return cart ? JSON.parse(cart) : [];
};

const formatCardNumber = (value) => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '').slice(0, 16);
  // Add a space after every 4 digits
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const unformatCardNumber = (value) => value.replace(/\D/g, '').slice(0, 16);

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', zip: '', country: '' });
  const [cartState, setCartState] = useState(getCartFromCookie());
  const [focus, setFocus] = useState('');
  const navigate = useNavigate();
  const [cardErrors, setCardErrors] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [shippingErrors, setShippingErrors] = useState({ name: '', address: '', city: '', zip: '', country: '' });

  const steps = ['Cart', 'Card Details', 'Shipping', 'Confirm'];

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === 'card') setCardDetails(prev => ({ ...prev, [name]: value }));
    if (section === 'shipping') setShipping(prev => ({ ...prev, [name]: value }));
  };

  // Card number input handler with formatting
  const handleCardNumberChange = (e) => {
    let value = e.target.value;
    // Remove all non-digit characters
    let digits = value.replace(/\D/g, '');
    if (digits.length > 16) digits = digits.slice(0, 16);
    setCardDetails(prev => ({ ...prev, number: digits }));
  };

  // Card validation helpers
  const validateCardNumber = (num) => num.replace(/\D/g, '').length === 16;
  const validateExpiry = (val) => /^\d{2}\/\d{2}$/.test(val) && (() => {
    const [mm, yy] = val.split('/').map(Number);
    return mm >= 1 && mm <= 12 && yy >= 0 && yy <= 99;
  })();
  const validateCVC = (val) => /^\d{3}$/.test(val);
  const validateName = (val) => val.trim().length > 0;

  // Expiry input handler with auto-slash
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    setCardDetails(prev => ({ ...prev, expiry: value }));
  };

  // Live validation on change
  React.useEffect(() => {
    setCardErrors({
      number: cardDetails.number && !validateCardNumber(cardDetails.number) ? 'Card number must be 16 digits' : '',
      expiry: cardDetails.expiry && !validateExpiry(cardDetails.expiry) ? 'Expiry must be MM/YY' : '',
      cvc: cardDetails.cvc && !validateCVC(cardDetails.cvc) ? 'CVC must be 3 digits' : '',
      name: cardDetails.name !== undefined && !validateName(cardDetails.name || '') ? 'Name required' : '',
    });
  }, [cardDetails]);

  const allCardValid = validateCardNumber(cardDetails.number) && validateExpiry(cardDetails.expiry) && validateCVC(cardDetails.cvc) && validateName(cardDetails.name || '');

  // Shipping validation helpers
  const validateShipping = {
    name: val => val.trim().length > 0,
    address: val => val.trim().length > 0,
    city: val => val.trim().length > 0,
    zip: val => val.trim().length > 0,
    country: val => !!val,
  };
  React.useEffect(() => {
    setShippingErrors({
      name: shipping.name !== undefined && !validateShipping.name(shipping.name || '') ? 'Name required' : '',
      address: shipping.address !== undefined && !validateShipping.address(shipping.address || '') ? 'Address required' : '',
      city: shipping.city !== undefined && !validateShipping.city(shipping.city || '') ? 'City required' : '',
      zip: shipping.zip !== undefined && !validateShipping.zip(shipping.zip || '') ? 'ZIP required' : '',
      country: shipping.country !== undefined && !validateShipping.country(shipping.country || '') ? 'Country required' : '',
    });
  }, [shipping]);
  const allShippingValid = validateShipping.name(shipping.name || '') && validateShipping.address(shipping.address || '') && validateShipping.city(shipping.city || '') && validateShipping.zip(shipping.zip || '') && validateShipping.country(shipping.country || '');

  const handleQuantityChange = (item, quantity) => {
    let newCart;
    if (quantity <= 0) {
      newCart = cartState.filter(i => i.id !== item.id);
    } else {
      newCart = cartState.map(i => i.id === item.id ? { ...i, quantity } : i);
    }
    Cookies.set('cart', JSON.stringify(newCart), { expires: 7 });
    setCartState(newCart);
  };

  const handleNext = () => setActiveStep(s => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setActiveStep(s => Math.max(s - 1, 0));

  const cart = cartState;

  const ORDERS_KEY = 'orders';

  const handlePlaceOrder = async () => {
    // Generate order object
    const now = new Date();
    const order = {
      id: Date.now(),
      orderNumber: Math.floor(Math.random() * 1e12).toString().padStart(12, '0'),
      placedDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      deliveredDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'long' }),
      returnClosedDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      total: cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
      shippingName: shipping.name,
      shipping,
      items: cart.map(item => ({ ...item, price: item.price })), // ensure price is stored
      status: 'Order Confirmed',
    };
    // Save to IndexedDB (TODO: sync with backend later)
    const prevOrders = (await get(ORDERS_KEY)) || [];
    await set(ORDERS_KEY, [order, ...prevOrders]);
    // Clear cart
    Cookies.set('cart', JSON.stringify([]), { expires: 7 });
    // Navigate to orders page
    navigate('/orders');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'var(--color-mid, #1e293b)', padding: '2.5rem 2rem', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', minWidth: 340, color: '#fff', maxWidth: 420, width: '100%' }}>
        <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '2rem', textAlign: 'center' }}>Checkout</h2>
        <Stepper steps={steps} activeStep={activeStep} onStepChange={setActiveStep} />
        {activeStep === 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>Your Cart</h3>
            {cart.length === 0 ? <div>Your cart is empty.</div> : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {cart.map(item => (
                  <li key={item.id} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{item.name}</span>
                    <span>
                      <input
                        type="number"
                        min={0}
                        value={item.quantity || 1}
                        onChange={e => handleQuantityChange(item, Number(e.target.value))}
      style={{
                          width: 52,
                          marginRight: 8,
                          borderRadius: '0.5rem',
                          border: 'none',
                          background: item.quantity ? 'silver' : '#b0b8b4',
                          color: '#333333',
                          fontSize: '1rem',
                          padding: '0.4rem',
                          textAlign: 'center',
                          outline: 'none',
                          boxShadow: '0 0 8px 0 #2563eb22',
                        }}
                      />
                      x {item.price || 1} = ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ marginTop: 16, fontWeight: 600, fontSize: 18 }}>
              Total: ${cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2)}
            </div>
        </div>
        )}
        {activeStep === 1 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
          display: 'flex',
          flexDirection: 'row',
              gap: 24,
            alignItems: 'flex-start',
            justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <div style={{ minWidth: 290, flex: '0 0 290px', display: 'flex', justifyContent: 'center' }}>
                <Cards
                  cvc={cardDetails.cvc}
                  expiry={cardDetails.expiry}
                  focused={focus}
                  name={cardDetails.name}
                  number={formatCardNumber(cardDetails.number)}
                />
              </div>
              <div style={{ minWidth: 260, flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  name="number"
                  placeholder="Card Number"
                  value={formatCardNumber(cardDetails.number)}
                  onChange={handleCardNumberChange}
                  onFocus={e => setFocus('number')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: cardErrors.number ? '2px solid #ef4444' : '1px solid #334155',
                    background: focus === 'number' ? '#DDDDDD' : cardDetails.number ? 'silver' : '#b0b8b4',
                    color: '#333333',
                    fontSize: '1rem',
                    outline: 'none',
                    marginBottom: 0,
                    boxShadow: '0 0 8px 0 #2563eb22',
                    letterSpacing: '2px',
                  }}
                  inputMode="numeric"
                  maxLength={19}
                  autoComplete="cc-number"
                  onKeyDown={e => {
                    if (e.key === ' ' || e.key === 'Spacebar') e.preventDefault();
                    const value = e.currentTarget.value;
                    const pos = e.currentTarget.selectionStart;
                    if (e.key === 'Backspace' && pos && (pos === 5 || pos === 10 || pos === 15) && value[pos - 1] === ' ') {
                      e.preventDefault();
                      const newValue = value.slice(0, pos - 1) + value.slice(pos);
                      e.currentTarget.value = newValue;
                      handleCardNumberChange({ target: { value: newValue } });
                      setTimeout(() => {
                        e.currentTarget.setSelectionRange(pos - 1, pos - 1);
                      }, 0);
                    }
                  }}
                />
                {cardErrors.number && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2 }}>{cardErrors.number}</div>}
                <input
                  name="name"
                  placeholder="Name on Card"
                  value={cardDetails.name || ''}
                  onChange={e => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                  onFocus={e => setFocus('name')}
            style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: cardErrors.name ? '2px solid #ef4444' : '1px solid #334155',
                    background: focus === 'name' ? '#DDDDDD' : cardDetails.name ? 'silver' : '#b0b8b4',
                    color: '#333333',
                    fontSize: '1rem',
                    outline: 'none',
                    marginBottom: 0,
                    boxShadow: '0 0 8px 0 #2563eb22',
                  }}
                  autoComplete="cc-name"
                />
                {cardErrors.name && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2 }}>{cardErrors.name}</div>}
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <input
                      name="expiry"
                      placeholder="Valid Thru"
                      value={cardDetails.expiry}
                      onChange={handleExpiryChange}
                      onFocus={e => setFocus('expiry')}
            style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: cardErrors.expiry ? '2px solid #ef4444' : '1px solid #334155',
                        background: focus === 'expiry' ? '#DDDDDD' : cardDetails.expiry ? 'silver' : '#b0b8b4',
                        color: '#333333',
              fontSize: '1rem',
                        outline: 'none',
                        marginBottom: 0,
                        boxShadow: '0 0 8px 0 #2563eb22',
                      }}
                      autoComplete="cc-exp"
                      maxLength={5}
                    />
                    {cardErrors.expiry && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2 }}>{cardErrors.expiry}</div>}
        </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <input
                      name="cvc"
                      placeholder="CVC"
                      value={cardDetails.cvc}
                      onChange={e => setCardDetails(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                      onFocus={e => setFocus('cvc')}
            style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: cardErrors.cvc ? '2px solid #ef4444' : '1px solid #334155',
                        background: focus === 'cvc' ? '#DDDDDD' : cardDetails.cvc ? 'silver' : '#b0b8b4',
                        color: '#333333',
                        fontSize: '1rem',
                        outline: 'none',
                        marginBottom: 0,
                        boxShadow: '0 0 8px 0 #2563eb22',
                      }}
                      autoComplete="cc-csc"
                      maxLength={3}
                    />
                    {cardErrors.cvc && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2 }}>{cardErrors.cvc}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeStep === 2 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, margin: '0 0 12px 0' }}>Shipping Details</h3>
            <input name="name" placeholder="Full Name" value={shipping.name} onChange={e => setShipping(prev => ({ ...prev, name: e.target.value }))} onFocus={e => setFocus('name')} style={{ width: '100%', marginBottom: 0, padding: '0.75rem', borderRadius: '0.5rem', border: shippingErrors.name ? '2px solid #ef4444' : '1px solid #334155', background: focus === 'name' ? '#DDDDDD' : shipping.name ? 'silver' : '#b0b8b4', color: '#333333', fontSize: '1rem', outline: 'none', boxShadow: '0 0 8px 0 #2563eb22' }} autoComplete="name" />
            {shippingErrors.name && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2 }}>{shippingErrors.name}</div>}
            <select name="country" value={shipping.country || ''} onChange={e => setShipping(prev => ({ ...prev, country: e.target.value }))} onFocus={e => setFocus('country')} style={{ width: '100%', marginBottom: 0, padding: '0.75rem 0.5rem', borderRadius: '0.5rem', border: shippingErrors.country ? '2px solid #ef4444' : '1px solid #334155', background: focus === 'country' ? '#DDDDDD' : shipping.country ? 'silver' : '#b0b8b4', color: '#333333', fontSize: '1rem', outline: 'none', marginTop: 8, boxShadow: '0 0 8px 0 #2563eb22', appearance: 'none' }}>
                <option value="" disabled>Select Country</option>
                <option value="AF">Afghanistan</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">American Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AQ">Antarctica</option><option value="AG">Antigua and Barbuda</option><option value="AR">Argentina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AU">Australia</option><option value="AT">Austria</option><option value="AZ">Azerbaijan</option><option value="BS">Bahamas</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BY">Belarus</option><option value="BE">Belgium</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia and Herzegovina</option><option value="BW">Botswana</option><option value="BR">Brazil</option><option value="IO">British Indian Ocean Territory</option><option value="BN">Brunei</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KH">Cambodia</option><option value="CM">Cameroon</option><option value="CA">Canada</option><option value="CV">Cape Verde</option><option value="KY">Cayman Islands</option><option value="CF">Central African Republic</option><option value="TD">Chad</option><option value="CL">Chile</option><option value="CN">China</option><option value="CO">Colombia</option><option value="KM">Comoros</option><option value="CD">Congo (Democratic Republic)</option><option value="CG">Congo (Republic)</option><option value="CR">Costa Rica</option><option value="HR">Croatia</option><option value="CU">Cuba</option><option value="CY">Cyprus</option><option value="CZ">Czech Republic</option><option value="DK">Denmark</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominican Republic</option><option value="EC">Ecuador</option><option value="EG">Egypt</option><option value="SV">El Salvador</option><option value="GQ">Equatorial Guinea</option><option value="ER">Eritrea</option><option value="EE">Estonia</option><option value="SZ">Eswatini</option><option value="ET">Ethiopia</option><option value="FJ">Fiji</option><option value="FI">Finland</option><option value="FR">France</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="DE">Germany</option><option value="GH">Ghana</option><option value="GR">Greece</option><option value="GL">Greenland</option><option value="GD">Grenada</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="HN">Honduras</option><option value="HU">Hungary</option><option value="IS">Iceland</option><option value="IN">India</option><option value="ID">Indonesia</option><option value="IR">Iran</option><option value="IQ">Iraq</option><option value="IE">Ireland</option><option value="IL">Israel</option><option value="IT">Italy</option><option value="CI">Ivory Coast</option><option value="JM">Jamaica</option><option value="JP">Japan</option><option value="JO">Jordan</option><option value="KZ">Kazakhstan</option><option value="KE">Kenya</option><option value="KI">Kiribati</option><option value="KW">Kuwait</option><option value="KG">Kyrgyzstan</option><option value="LA">Laos</option><option value="LV">Latvia</option><option value="LB">Lebanon</option><option value="LS">Lesotho</option><option value="LR">Liberia</option><option value="LY">Libya</option><option value="LI">Liechtenstein</option><option value="LT">Lithuania</option><option value="LU">Luxembourg</option><option value="MG">Madagascar</option><option value="MW">Malawi</option><option value="MY">Malaysia</option><option value="MV">Maldives</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="MH">Marshall Islands</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="MX">Mexico</option><option value="FM">Micronesia</option><option value="MD">Moldova</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="ME">Montenegro</option><option value="MA">Morocco</option><option value="MZ">Mozambique</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NL">Netherlands</option><option value="NZ">New Zealand</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="KP">North Korea</option><option value="MK">North Macedonia</option><option value="NO">Norway</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PA">Panama</option><option value="PG">Papua New Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="PH">Philippines</option><option value="PL">Poland</option><option value="PT">Portugal</option><option value="QA">Qatar</option><option value="RO">Romania</option><option value="RU">Russia</option><option value="RW">Rwanda</option><option value="KN">Saint Kitts and Nevis</option><option value="LC">Saint Lucia</option><option value="VC">Saint Vincent and the Grenadines</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">Sao Tome and Principe</option><option value="SA">Saudi Arabia</option><option value="SN">Senegal</option><option value="RS">Serbia</option><option value="SC">Seychelles</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SB">Solomon Islands</option><option value="SO">Somalia</option><option value="ZA">South Africa</option><option value="KR">South Korea</option><option value="SS">South Sudan</option><option value="ES">Spain</option><option value="LK">Sri Lanka</option><option value="SD">Sudan</option><option value="SR">Suriname</option><option value="SE">Sweden</option><option value="CH">Switzerland</option><option value="SY">Syria</option><option value="TW">Taiwan</option><option value="TJ">Tajikistan</option><option value="TZ">Tanzania</option><option value="TH">Thailand</option><option value="TL">Timor-Leste</option><option value="TG">Togo</option><option value="TO">Tonga</option><option value="TT">Trinidad and Tobago</option><option value="TN">Tunisia</option><option value="TR">Turkey</option><option value="TM">Turkmenistan</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraine</option><option value="AE">United Arab Emirates</option><option value="GB">United Kingdom</option><option value="US">United States</option><option value="UY">Uruguay</option><option value="UZ">Uzbekistan</option><option value="VU">Vanuatu</option><option value="VE">Venezuela</option><option value="VN">Vietnam</option><option value="YE">Yemen</option><option value="ZM">Zambia</option><option value="ZW">Zimbabwe</option>
            </select>

            {shippingErrors.country && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2 }}>{shippingErrors.country}</div>}
            <input name="address" placeholder="Address" value={shipping.address} onChange={e => setShipping(prev => ({ ...prev, address: e.target.value }))} onFocus={e => setFocus('address')} style={{ width: '100%', marginBottom: 0, padding: '0.75rem', borderRadius: '0.5rem', border: shippingErrors.address ? '2px solid #ef4444' : '1px solid #334155', background: focus === 'address' ? '#DDDDDD' : shipping.address ? 'silver' : '#b0b8b4', color: '#333333', fontSize: '1rem', outline: 'none', boxShadow: '0 0 8px 0 #2563eb22', marginTop: 8 }} autoComplete="address-line1" />
            {shippingErrors.address && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2 }}>{shippingErrors.address}</div>}
            <input name="city" placeholder="City" value={shipping.city} onChange={e => setShipping(prev => ({ ...prev, city: e.target.value }))} onFocus={e => setFocus('city')} style={{ width: '100%', marginBottom: 0, padding: '0.75rem', borderRadius: '0.5rem', border: shippingErrors.city ? '2px solid #ef4444' : '1px solid #334155', background: focus === 'city' ? '#DDDDDD' : shipping.city ? 'silver' : '#b0b8b4', color: '#333333', fontSize: '1rem', outline: 'none', boxShadow: '0 0 8px 0 #2563eb22', marginTop: 8 }} autoComplete="address-level2" />
            {shippingErrors.city && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2 }}>{shippingErrors.city}</div>}
            <input name="zip" placeholder="ZIP Code" value={shipping.zip} onChange={e => setShipping(prev => ({ ...prev, zip: e.target.value }))} onFocus={e => setFocus('zip')} style={{ width: '100%', marginBottom: 0, padding: '0.75rem', borderRadius: '0.5rem', border: shippingErrors.zip ? '2px solid #ef4444' : '1px solid #334155', background: focus === 'zip' ? '#DDDDDD' : shipping.zip ? 'silver' : '#b0b8b4', color: '#333333', fontSize: '1rem', outline: 'none', boxShadow: '0 0 8px 0 #2563eb22', marginTop: 8 }} autoComplete="postal-code" />
            {shippingErrors.zip && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2 }}>{shippingErrors.zip}</div>}
          </div>
        )}
        {activeStep === 3 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>Confirm Order</h3>
            <div style={{ marginBottom: 12 }}>Please review your order and details before confirming.</div>
            <div style={{ marginBottom: 8 }}><strong>Cart:</strong> {cart.map(item => `${item.name} x${item.quantity || 1}`).join(', ')}</div>
            <div style={{ marginBottom: 8 }}><strong>Shipping:</strong> {shipping.name}, {shipping.address}, {shipping.city}, {shipping.zip}, {shipping.country}</div>
            <div style={{ marginBottom: 8 }}><strong>Card:</strong> **** **** **** {cardDetails.number.slice(-4)}</div>
            <div style={{ marginTop: 16, fontWeight: 600, fontSize: 18 }}>
              Total: ${cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2)}
            </div>
            <button style={{ marginTop: 18, width: '100%', padding: 12, borderRadius: 8, background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer' }} onClick={handlePlaceOrder}>Place Order</button>
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 16 }}>
          {activeStep > 0 && <button onClick={handleBack} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', background: '#334155', color: '#fff', fontWeight: 600, fontSize: '1.1rem', border: 'none', cursor: 'pointer' }}>Back</button>}
          {activeStep < steps.length - 1 && <button onClick={handleNext} style={{ flex: 2, padding: '0.75rem', borderRadius: '0.5rem', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: '1.1rem', border: 'none', cursor: 'pointer', opacity: (activeStep === 1 && !allCardValid) || (activeStep === 2 && !allShippingValid) ? 0.5 : 1, pointerEvents: (activeStep === 1 && !allCardValid) || (activeStep === 2 && !allShippingValid) ? 'none' : 'auto' }}>Next</button>}
        </div>
        <button
          onClick={() => navigate('/marketplace')}
          style={{
            width: '100%',
            marginTop: 12,
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.75rem',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #2563eb22',
          }}
        >
          ← Go Back to Marketplace
        </button>
      </div>
    </div>
  );
};

export default Checkout;
