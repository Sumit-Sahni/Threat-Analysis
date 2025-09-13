#!/bin/bash

# Base URL of your Next.js app
BASE_URL="http://localhost:3000"

echo "=== Starting attack simulation ==="

# ---------------------------------
# 1️⃣ /api/search attacks
# ---------------------------------
echo "[*] Testing /api/search endpoint"

# Normal search
curl -s "$BASE_URL/api/search?q=servers" -o /dev/null
# XSS payload
curl -s "$BASE_URL/api/search?q=<script>alert(1)</script>" -o /dev/null
# SQL injection payload
curl -s "$BASE_URL/api/search?q=' OR 1=1 --" -o /dev/null

echo "[*] /api/search attacks done"

# ---------------------------------
# 2️⃣ /api/greet attacks
# ---------------------------------
echo "[*] Testing /api/greet endpoint"

# Normal greeting
curl -s "$BASE_URL/api/greet?name=John" -o /dev/null
# XSS payload
curl -s "$BASE_URL/api/greet?name=<img src=x onerror=alert(1)>" -o /dev/null

echo "[*] /api/greet attacks done"

# ---------------------------------
# 3️⃣ /api/admin attacks
# ---------------------------------
echo "[*] Testing /api/admin endpoint"

# Authorized access
curl -s "$BASE_URL/api/admin?token=letmein123" -o /dev/null
# Unauthorized access
curl -s "$BASE_URL/api/admin?token=wrongtoken" -o /dev/null

echo "[*] /api/admin attacks done"

echo "=== Attack simulation completed ==="
