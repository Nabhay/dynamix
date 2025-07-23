from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import uuid
import sqlite3
import json
import random

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

DB_PATH = 'app.db'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        password TEXT,
        signup_info TEXT
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS profiles (
        user_id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        saved_payment_methods TEXT,
        saved_addresses TEXT,
        signup_info TEXT
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        orderNumber TEXT,
        placedDate TEXT,
        deliveredDate TEXT,
        returnClosedDate TEXT,
        total REAL,
        shippingName TEXT,
        shipping TEXT,
        items TEXT,
        status TEXT
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS otps (
        email TEXT PRIMARY KEY,
        otp TEXT,
        created_at INTEGER
    )''')
    conn.commit()
    conn.close()

init_db()

# Simulate sending OTP (print to console)
def send_otp_email(email, otp):
    print(f"[OTP] Sent to {email}: {otp}")

# Signup route
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    name = data.get('name', '')
    password = data.get('password')
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT id FROM users WHERE email = ?', (email,))
    if c.fetchone():
        conn.close()
        return jsonify({'error': 'User already exists'}), 400
    user_id = str(uuid.uuid4())
    c.execute('INSERT INTO users (id, email, name, password, signup_info) VALUES (?, ?, ?, ?, ?)',
              (user_id, email, name, password, json.dumps({"name": name, "email": email})))
    c.execute('INSERT OR REPLACE INTO profiles (user_id, name, email, saved_payment_methods, saved_addresses, signup_info) VALUES (?, ?, ?, ?, ?, ?)',
              (user_id, name, email, json.dumps([]), json.dumps([]), json.dumps({"name": name, "email": email})))
    conn.commit()
    conn.close()
    return jsonify({'user_id': user_id, 'email': email, 'name': name})

# Auth route (login)
@app.route('/api/auth', methods=['POST'])
def auth():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT id, password FROM users WHERE email = ?', (email,))
    row = c.fetchone()
    if not row or (password and row['password'] != password):
        conn.close()
        return jsonify({'error': 'Invalid credentials'}), 401
    user_id = row['id']
    token = str(uuid.uuid4())
    resp = make_response(jsonify({"token": token, "user_id": user_id}))
    resp.set_cookie('token', token)
    conn.close()
    return resp

# Get orders for user
@app.route('/api/orders', methods=['GET'])
def get_orders():
    user_id = request.args.get('user_id')
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM orders WHERE user_id = ?', (user_id,))
    rows = c.fetchall()
    orders = []
    for row in rows:
        order = dict(row)
        order['shipping'] = json.loads(order['shipping'])
        order['items'] = json.loads(order['items'])
        orders.append(order)
    conn.close()
    return jsonify(orders)

# Add order (for demo/testing)
@app.route('/api/orders/add', methods=['POST'])
def add_order():
    order = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute('''INSERT OR REPLACE INTO orders (id, user_id, orderNumber, placedDate, deliveredDate, returnClosedDate, total, shippingName, shipping, items, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
              (order['id'], order['user_id'], order['orderNumber'], order['placedDate'], order['deliveredDate'],
               order['returnClosedDate'], order['total'], order['shippingName'], json.dumps(order['shipping']), json.dumps(order['items']), order['status']))
    conn.commit()
    conn.close()
    return jsonify(order)

# Get profile (on page load, store in cookies on frontend)
@app.route('/api/profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('user_id')
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM profiles WHERE user_id = ?', (user_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        return jsonify({"error": "Profile not found"}), 404
    profile = dict(row)
    profile['saved_payment_methods'] = json.loads(profile['saved_payment_methods'])
    profile['saved_addresses'] = json.loads(profile['saved_addresses'])
    profile['signup_info'] = json.loads(profile['signup_info'])
    conn.close()
    return jsonify(profile)

# Add/update profile (for demo/testing)
@app.route('/api/profile', methods=['POST'])
def update_profile():
    profile = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute('''INSERT OR REPLACE INTO profiles (user_id, name, email, saved_payment_methods, saved_addresses, signup_info)
                 VALUES (?, ?, ?, ?, ?, ?)''',
              (profile['user_id'], profile['name'], profile['email'], json.dumps(profile.get('saved_payment_methods', [])),
               json.dumps(profile.get('saved_addresses', [])), json.dumps(profile.get('signup_info', {}))))
    conn.commit()
    conn.close()
    return jsonify(profile)

# Send OTP to email (simulate)
@app.route('/api/otp/send', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email')
    otp = str(random.randint(100000, 999999))
    conn = get_db()
    c = conn.cursor()
    c.execute('INSERT OR REPLACE INTO otps (email, otp, created_at) VALUES (?, ?, ?)', (email, otp, int(uuid.uuid1().time)))
    conn.commit()
    conn.close()
    send_otp_email(email, otp)
    return jsonify({'message': f'OTP sent to {email}'})

# Resend OTP (simulate)
@app.route('/api/otp/resend', methods=['POST'])
def resend_otp():
    data = request.json
    email = data.get('email')
    otp = str(random.randint(100000, 999999))
    conn = get_db()
    c = conn.cursor()
    c.execute('INSERT OR REPLACE INTO otps (email, otp, created_at) VALUES (?, ?, ?)', (email, otp, int(uuid.uuid1().time)))
    conn.commit()
    conn.close()
    send_otp_email(email, otp)
    return jsonify({'message': f'OTP resent to {email}'})

if __name__ == '__main__':
    app.run(debug=True) 