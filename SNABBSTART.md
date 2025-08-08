# 🚀 FLAMMAN TECH - SNABBSTART GUIDE

## ⚡ För dig som vill komma igång SNABBT

**Tid:** 15 minuter  
**Krav:** Hestia Control Panel + SSH-access

---

## 🔥 SNABBKOMMANDO - Kör allt på en gång

**1. SSH in på servern:**
```bash
ssh root@DIN-SERVER-IP
```

**2. Kör detta super-script:**
```bash
# Kopiera HELA detta block och klistra in i SSH:

# Uppdatera system
sudo apt update && sudo apt upgrade -y

# Installera Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installera verktyg
sudo apt install -y python3-pip python3-venv python3-dev
sudo npm install -g pm2 yarn

# Installera MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

echo "✅ GRUNDINSTALLATION KLAR!"
```

---

## 📋 MANUELLA STEG (gör dessa efter ovanstående)

### 1. Skapa webbplats i Hestia (2 min)
- Gå till https://DIN-SERVER-IP:8083
- Web → Add Web Domain
- Domän: `flammantech.se`
- ✅ Enable SSL support
- ✅ Enable Let's Encrypt support

### 2. Ladda upp filer (3 min)
```bash
# Skapa projektmapp
cd /home/admin/web/flammantech.se/
sudo mkdir -p flamman-tech
cd flamman-tech

# Ladda upp dina projektfiler hit (använd scp eller File Manager)
# Sätt rättigheter
sudo chown -R admin:admin /home/admin/web/flammantech.se/flamman-tech/
sudo chmod -R 755 /home/admin/web/flammantech.se/flamman-tech/
```

### 3. Backend setup (5 min)
```bash
cd /home/admin/web/flammantech.se/flamman-tech/backend

# Python virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Konfigurera .env
cp .env.example .env
nano .env  # Fyll i SMTP-uppgifter

# PM2 config
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'flamman-tech-backend',
    script: 'venv/bin/python',
    args: '-m uvicorn server:app --host 0.0.0.0 --port 8001',
    cwd: '/home/admin/web/flammantech.se/flamman-tech/backend',
    instances: 1,
    autorestart: true,
  }]
};
EOF
```

### 4. Frontend setup (3 min)
```bash
cd /home/admin/web/flammantech.se/flamman-tech/frontend

# Installera och bygg
yarn install
echo "REACT_APP_BACKEND_URL=https://flammantech.se" > .env
yarn build

# Kopiera till webbplats
sudo cp -r build/* /home/admin/web/flammantech.se/public_html/
```

### 5. Nginx config (2 min)
```bash
# Lägg till API proxy
sudo nano /home/admin/conf/web/nginx.flammantech.se.conf

# Lägg till FÖRE server block:
location /api/ {
    proxy_pass http://localhost:8001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Spara och testa
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Starta services (1 min)
```bash
cd /home/admin/web/flammantech.se/flamman-tech/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Följ instruktioner
```

---

## ✅ SNABB-TEST
```bash
curl https://flammantech.se/api/  # Ska visa: {"message":"Hello World"}
```

**🎉 KLART! Gå till https://flammantech.se**

---

## 🚨 Om något inte fungerar:
1. **Backend:** `pm2 logs flamman-tech-backend`
2. **Nginx:** `sudo nginx -t`
3. **MongoDB:** `sudo systemctl status mongod`

**Fastnat? Ring Melvin: 0703456746**