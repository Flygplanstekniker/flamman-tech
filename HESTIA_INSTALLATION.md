# 🚀 Flamman Tech Website - Komplett Hestia Installationsguide

## ⚠️ LÄAS DETTA FÖRST
**Denna guide tar dig steg-för-steg genom HELA installationsprocessen. Följ EXAKT i ordning - hoppa INTE över steg.**

**Uppskattat tid:** 45-60 minuter  
**Svårighetsgrad:** Medel (grundläggande Linux-kunskaper krävs)

## 📋 Vad du behöver innan du börjar
✅ En VPS/server med Ubuntu 20.04 eller senare  
✅ Hestia Control Panel redan installerat och fungerande  
✅ Root-access till servern (SSH)  
✅ Din domän (t.ex. flammantech.se) som pekar på servern  
✅ Gmail-konto för e-postfunktion (alternativt annan SMTP)  

## 📁 Viktiga filsökvägar att komma ihåg
```
/home/admin/web/DIN-DOMÄN.se/flamman-tech/     ← Projektmapp
/home/admin/web/DIN-DOMÄN.se/public_html/      ← Webbplats-filer
/var/log/nginx/                                ← Nginx-loggar
```

---

## Del 1: Förbereda Servern

### 1.1 Logga in på Hestia
```bash
# Logga in via SSH till din server
ssh root@din-server-ip

# Eller använd Hestia webbgränssnittet på:
https://din-server-ip:8083
```

### 1.2 Skapa webbplats i Hestia
1. Gå till **Web** i Hestia-panelen
2. Klicka **Add Web Domain**
3. Ange din domän (t.ex. `flammantech.se`)
4. Aktivera SSL (Let's Encrypt)
5. Välj **PHP 8.1+** som backend

### 1.3 Installera Node.js
```bash
# Installera Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifiera installation
node --version
npm --version
```

### 1.4 Installera Python och paket
```bash
# Python ska redan vara installerat, installera pip och venv
sudo apt update
sudo apt install python3-pip python3-venv

# Installera PM2 för process-hantering
sudo npm install -g pm2 yarn
```

### 1.5 Installera MongoDB
```bash
# Installera MongoDB Community Edition
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Starta MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Del 2: Ladda upp och Installera Applikationen

### 2.1 Förbered filerna
På din lokala dator, skapa en zip-fil med:
```
flamman-tech/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...alla React-filer
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env.example
└── HESTIA_INSTALLATION.md
```

### 2.2 Ladda upp till servern
```bash
# Navigera till din webbplats-mapp i Hestia
cd /home/admin/web/flammantech.se/

# Skapa projekt-mapp
sudo mkdir -p flamman-tech
cd flamman-tech

# Ladda upp och packa upp dina filer här
# (använd scp, rsync, eller Hestia File Manager)
```

### 2.3 Sätt rätt filrättigheter
```bash
# Sätt rätt ägare och rättigheter
sudo chown -R admin:admin /home/admin/web/flammantech.se/flamman-tech/
sudo chmod -R 755 /home/admin/web/flammantech.se/flamman-tech/
```

## Del 3: Konfigurera Backend

### 3.1 Skapa Python virtual environment
```bash
cd /home/admin/web/flammantech.se/flamman-tech/backend

# Skapa virtual environment
python3 -m venv venv

# Aktivera virtual environment
source venv/bin/activate

# Installera dependencies
pip install -r requirements.txt
```

### 3.2 Konfigurera miljövariabler
```bash
# Kopiera exempel-fil
cp .env.example .env

# Redigera .env-fil
nano .env
```

Fyll i följande i `.env`:
```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=flamman_tech

# Email Configuration - VIKTIGT!
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ditt.gmail@gmail.com
SMTP_PASSWORD=ditt_app_lösenord
EMAIL_FROM=noreply@flammantech.se
EMAIL_TO=melvin@flammantech.se
```

### 3.3 Testa backend
```bash
# Testa att backend startar
python server.py

# Om allt fungerar, stoppa med Ctrl+C
```

### 3.4 Skapa PM2-konfiguration för backend
```bash
# Skapa PM2 ecosystem-fil
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'flamman-tech-backend',
    script: 'venv/bin/python',
    args: '-m uvicorn server:app --host 0.0.0.0 --port 8001',
    cwd: '/home/admin/web/flammantech.se/flamman-tech/backend',
    env: {
      NODE_ENV: 'production'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
};
```

## Del 4: Konfigurera Frontend

### 4.1 Installera frontend-dependencies
```bash
cd /home/admin/web/flammantech.se/flamman-tech/frontend

# Installera paket
yarn install
```

### 4.2 Konfigurera miljövariabler
```bash
# Skapa .env fil för frontend
nano .env
```

```env
REACT_APP_BACKEND_URL=https://flammantech.se
```

### 4.3 Bygg frontend för produktion
```bash
# Bygg applikationen
yarn build

# Kopiera build-filerna till Hestia web root
sudo cp -r build/* /home/admin/web/flammantech.se/public_html/
```

## Del 5: Konfigurera Nginx (Reverse Proxy)

### 5.1 Skapa Nginx-konfiguration
```bash
# Redigera Nginx-konfiguration för din domän
sudo nano /home/admin/conf/web/nginx.flammantech.se.conf
```

Lägg till följande före den befintliga konfigurationen:
```nginx
# API Proxy för backend
location /api/ {
    proxy_pass http://localhost:8001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

### 5.2 Starta om Nginx
```bash
sudo systemctl restart nginx
```

## Del 6: Starta Services

### 6.1 Starta backend med PM2
```bash
cd /home/admin/web/flammantech.se/flamman-tech/backend

# Starta backend
pm2 start ecosystem.config.js

# Spara PM2-konfiguration
pm2 save

# Sätt PM2 att starta vid systemstart
pm2 startup
```

### 6.2 Verifiera att allt fungerar
```bash
# Kolla PM2-status
pm2 status

# Kolla PM2-loggar
pm2 logs flamman-tech-backend

# Testa API
curl https://flammantech.se/api/
```

## Del 7: SSL och Säkerhet

### 7.1 SSL-certifikat
Hestia bör redan ha skapat ett Let's Encrypt SSL-certifikat. Om inte:

1. Gå till **Web** i Hestia
2. Klicka på din domän
3. Aktivera **SSL Support**
4. Välj **Let's Encrypt**

### 7.2 Firewall-konfiguration
```bash
# Kontrollera att port 8001 INTE är öppen utåt
sudo ufw status

# Om port 8001 är öppen, stäng den (bara Nginx ska komma åt den)
sudo ufw deny 8001
```

## Del 8: Övervakning och Underhåll

### 8.1 Loggar
```bash
# Backend-loggar via PM2
pm2 logs flamman-tech-backend

# Nginx-loggar
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB-loggar
sudo tail -f /var/log/mongodb/mongod.log
```

### 8.2 Backup-script
Skapa ett enkelt backup-script för MongoDB:
```bash
#!/bin/bash
# /home/admin/backup-flamman.sh

DATE=$(date +"%Y%m%d_%H%M%S")
mongodump --db flamman_tech --out /home/admin/backups/mongo_$DATE
find /home/admin/backups -name "mongo_*" -mtime +7 -delete
```

```bash
# Gör scriptet körbart
chmod +x /home/admin/backup-flamman.sh

# Lägg till i crontab (körs dagligen)
crontab -e
# Lägg till: 0 2 * * * /home/admin/backup-flamman.sh
```

## Del 9: Felsökning

### 9.1 Vanliga problem

**Problem: Backend startar inte**
```bash
# Kolla PM2-status och loggar
pm2 status
pm2 logs flamman-tech-backend

# Kolla Python-dependencies
cd /home/admin/web/flammantech.se/flamman-tech/backend
source venv/bin/activate
python -c "import motor; print('OK')"
```

**Problem: Frontend visar inte rätt**
```bash
# Kontrollera att build-filerna finns
ls -la /home/admin/web/flammantech.se/public_html/

# Kontrollera Nginx-konfiguration
sudo nginx -t

# Starta om Nginx
sudo systemctl restart nginx
```

**Problem: Email fungerar inte**
- Kontrollera att du använder Gmail App Password
- Verifiera SMTP-inställningar i backend/.env
- Kolla backend-loggar för email-fel

**Problem: API-anrop fungerar inte**
```bash
# Testa API direkt
curl https://flammantech.se/api/

# Kolla Nginx proxy-konfiguration
sudo nano /home/admin/conf/web/nginx.flammantech.se.conf
```

### 9.2 Starta om allt
```bash
# Starta om backend
pm2 restart flamman-tech-backend

# Starta om Nginx
sudo systemctl restart nginx

# Starta om MongoDB
sudo systemctl restart mongod
```

## Del 10: Uppdateringar

### 10.1 Uppdatera frontend
```bash
cd /home/admin/web/flammantech.se/flamman-tech/frontend

# Bygg nya versionen
yarn build

# Kopiera nya filer
sudo cp -r build/* /home/admin/web/flammantech.se/public_html/
```

### 10.2 Uppdatera backend
```bash
cd /home/admin/web/flammantech.se/flamman-tech/backend

# Aktivera virtual environment
source venv/bin/activate

# Uppdatera dependencies om nödvändigt
pip install -r requirements.txt

# Starta om backend
pm2 restart flamman-tech-backend
```

## Support

Om du stöter på problem, kontakta Melvin på:
- **Email**: melvin@flammantech.se
- **Telefon**: 0703456746

---

**Lycka till med din nya webbplats! 🚀**