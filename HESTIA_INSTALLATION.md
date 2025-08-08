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

## 🔥 STEG 1: Logga in och förbered Hestia

### 1.1 SSH-inloggning (OBLIGATORISK)
```bash
# Byt ut "DIN-SERVER-IP" mot din riktiga server-IP
ssh root@DIN-SERVER-IP

# Exempel: ssh root@192.168.1.100
```

**⚠️ VIKTIGT:** Du MÅSTE använda SSH för denna installation. Hestia File Manager är inte tillräckligt.

### 1.2 Skapa webbplats i Hestia (GÖR DETTA FÖRST)

**Via Hestia webbgränssnitt (https://DIN-SERVER-IP:8083):**

1. **Logga in** på Hestia-panelen
2. Klicka **"Web"** i vänster meny
3. Klicka **"ADD WEB DOMAIN"** (stor blå knapp)
4. **Domännamn:** Skriv `flammantech.se` (eller din domän)
5. **Aliases:** Lämna tom
6. **Backend template:** Välj **"PHP-8_1"** 
7. **Proxy template:** Välj **"default"**
8. **✅ Kryssa i "Enable SSL support"**
9. **✅ Kryssa i "Enable Let's Encrypt support"**
10. Klicka **"Add"**

**🔍 Verifiera:** Gå till https://flammantech.se - du ska se en Hestia standard-sida.

---

## 🛠️ STEG 2: Installera nödvändig programvara

### 2.1 Uppdatera systemet (OBLIGATORISKT)
```bash
# Kör dessa kommandon i SSH:
sudo apt update && sudo apt upgrade -y
```

### 2.2 Installera Node.js 18 LTS (RÄTT VERSION)
```bash
# Installera Node.js repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Installera Node.js
sudo apt-get install -y nodejs

# ✅ VERIFIERA - dessa ska visa version 18.x:
node --version
npm --version
```

**🚨 Om Node.js-version är fel:** Starta om SSH-sessionen och försök igen.

### 2.3 Installera Python och verktyg
```bash
# Installera Python-verktyg
sudo apt install -y python3-pip python3-venv python3-dev

# Installera PM2 och Yarn globalt
sudo npm install -g pm2 yarn

# ✅ VERIFIERA:
python3 --version  # Ska visa 3.8+
pip3 --version
pm2 --version
yarn --version
```

### 2.4 Installera MongoDB (KRITISKT STEG)

**⚠️ OBSERVERA:** Detta kan ta 5-10 minuter

```bash
# Lägg till MongoDB repository key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Lägg till MongoDB repository (Ubuntu 20.04/focal)
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Uppdatera package list
sudo apt-get update

# Installera MongoDB
sudo apt-get install -y mongodb-org

# Starta och aktivera MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# ✅ VERIFIERA MongoDB:
sudo systemctl status mongod
# Du ska se "active (running)" i grön text
```

**🚨 Om MongoDB inte startar:**
```bash
sudo journalctl -u mongod  # Kolla vad som gick fel
```

---

## 📦 STEG 3: Ladda upp och förbered projektfiler

### 3.1 Skapa projektstruktur
```bash
# Navigera till din domäns mapp (ändra flammantech.se till din domän)
cd /home/admin/web/flammantech.se/

# Skapa projektmapp
sudo mkdir -p flamman-tech
cd flamman-tech

# ✅ VERIFIERA var du är:
pwd
# Ska visa: /home/admin/web/flammantech.se/flamman-tech
```

### 3.2 Ladda upp projektfiler

**ALTERNATIV A: Använd scp från din lokala dator**
```bash
# På din LOKALA dator, inte servern:
scp -r /path/to/flamman-tech/* root@DIN-SERVER-IP:/home/admin/web/flammantech.se/flamman-tech/
```

**ALTERNATIV B: Använd Hestia File Manager**
1. Gå till **File Manager** i Hestia
2. Navigera till `/home/admin/web/flammantech.se/flamman-tech/`
3. Ladda upp alla projektfiler

**ALTERNATIV C: Klona från Git (om du har projektet på GitHub)**
```bash
# Om du har projektet på GitHub:
git clone https://github.com/ditt-användarnamn/flamman-tech.git .
```

### 3.3 Sätt rätta filrättigheter (OBLIGATORISKT)
```bash
# Sätt rätt ägare och rättigheter
sudo chown -R admin:admin /home/admin/web/flammantech.se/flamman-tech/
sudo chmod -R 755 /home/admin/web/flammantech.se/flamman-tech/

# ✅ VERIFIERA filstruktur:
ls -la /home/admin/web/flammantech.se/flamman-tech/
# Du ska se: frontend/ och backend/ mappar
```

---

## ⚙️ STEG 4: Konfigurera Backend (KRITISKT STEG)

### 4.1 Installera Python-dependencies
```bash
# Gå till backend-mappen
cd /home/admin/web/flammantech.se/flamman-tech/backend

# ✅ VERIFIERA att requirements.txt finns:
ls -la requirements.txt

# Skapa Python virtual environment
python3 -m venv venv

# Aktivera virtual environment
source venv/bin/activate

# ✅ VERIFIERA att virtual env är aktivt:
which python
# Ska visa: /home/admin/web/flammantech.se/flamman-tech/backend/venv/bin/python

# Installera dependencies (kan ta 3-5 minuter)
pip install -r requirements.txt
```

**🚨 Om pip install misslyckas:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4.2 Konfigurera environment-variabler (SUPER VIKTIGT)

```bash
# Kopiera exempel-filen
cp .env.example .env

# Redigera .env-filen
nano .env
```

**Fyll i EXAKT detta i .env-filen:**
```env
# Database Configuration (ÄNDRA INTE DESSA)
MONGO_URL=mongodb://localhost:27017
DB_NAME=flamman_tech

# Email Configuration (ÄNDRA TILL DINA UPPGIFTER)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ditt.gmail@gmail.com
SMTP_PASSWORD=ditt_app_lösenord_från_gmail
EMAIL_FROM=noreply@flammantech.se
EMAIL_TO=melvin@flammantech.se
```

**🔥 GMAIL APP PASSWORD - SUPER VIKTIGT:**

1. Gå till https://myaccount.google.com/security
2. Aktivera **2-Step Verification** (tvåstegsverifiering)
3. Gå till https://myaccount.google.com/apppasswords
4. Skapa ett **App Password** för "Mail"
5. **Använd detta 16-siffrigt lösenord i SMTP_PASSWORD** (inte ditt vanliga lösenord)

**Spara filen:** Ctrl+X, sedan Y, sedan Enter

### 4.3 Testa backend (VIKTIGT TEST)
```bash
# Kontrollera att du fortfarande är i backend-mappen och virtual env är aktivt
pwd  # Ska visa: /home/admin/web/flammantech.se/flamman-tech/backend
which python  # Ska visa venv-sökvägen

# Testa backend-start
python server.py
```

**✅ Om det fungerar:** Du ser "Application startup complete" och "Uvicorn running on..."
**🚨 Om det inte fungerar:** Kolla felmeddelandet och fixa innan du fortsätter

**Stoppa backend:** Ctrl+C

### 4.4 Skapa PM2-konfiguration
```bash
# Skapa PM2 ecosystem-fil
nano ecosystem.config.js
```

**Kopiera EXAKT detta (ändra sökvägen om din domän är annorlunda):**
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

**Spara:** Ctrl+X, Y, Enter

---

## 🎨 STEG 5: Konfigurera Frontend

### 5.1 Installera frontend-dependencies
```bash
# Gå till frontend-mappen
cd /home/admin/web/flammantech.se/flamman-tech/frontend

# ✅ VERIFIERA att package.json finns:
ls -la package.json

# Installera dependencies med Yarn (kan ta 3-5 minuter)
yarn install
```

**🚨 Om yarn install misslyckas:**
```bash
rm -rf node_modules package-lock.json
yarn install
```

### 5.2 Konfigurera frontend environment
```bash
# Skapa .env fil för frontend
nano .env
```

**Skriv EXAKT detta (byt flammantech.se mot din domän):**
```env
REACT_APP_BACKEND_URL=https://flammantech.se
```

**Spara:** Ctrl+X, Y, Enter

### 5.3 Bygg frontend för produktion
```bash
# Bygg React-applikationen (kan ta 2-3 minuter)
yarn build

# ✅ VERIFIERA att build skapades:
ls -la build/
# Du ska se många filer inklusive index.html

# Kopiera build-filerna till webbplats-mappen
sudo cp -r build/* /home/admin/web/flammantech.se/public_html/

# ✅ VERIFIERA kopiering:
ls -la /home/admin/web/flammantech.se/public_html/
# Du ska se index.html och andra filer
```

---

## 🌐 STEG 6: Konfigurera Nginx (REVERSE PROXY)

### 6.1 Redigera Nginx-konfiguration
```bash
# Redigera Nginx-konfiguration (ändra flammantech.se till din domän)
sudo nano /home/admin/conf/web/nginx.flammantech.se.conf
```

**Hitta raden som börjar med `server {` och lägg till FÖRE den:**

```nginx
# API Proxy för backend - LÄGG TILL DETTA LÄNGST UPP I FILEN
server {
    listen 80;
    server_name flammantech.se www.flammantech.se;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name flammantech.se www.flammantech.se;
    
    # SSL konfiguration (Hestia hanterar detta)
    
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
    
    # Statiska filer
    location / {
        root /home/admin/web/flammantech.se/public_html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

**🚨 KRITISKT:** Se till att ändra `flammantech.se` till din domän överallt!

**Spara:** Ctrl+X, Y, Enter

### 6.2 Testa och starta om Nginx
```bash
# Testa Nginx-konfiguration
sudo nginx -t
# ✅ Du ska se: "syntax is ok" och "test is successful"

# Om test ok, starta om Nginx
sudo systemctl restart nginx

# ✅ Kontrollera Nginx-status:
sudo systemctl status nginx
# Ska visa "active (running)"
```

---

## 🚀 STEG 7: Starta Services och Testa

### 7.1 Starta backend med PM2
```bash
# Gå tillbaka till backend-mappen
cd /home/admin/web/flammantech.se/flamman-tech/backend

# Starta backend med PM2
pm2 start ecosystem.config.js

# ✅ Kontrollera PM2-status:
pm2 status
# Du ska se "flamman-tech-backend" med status "online"

# Spara PM2-konfiguration för automatisk start
pm2 save

# Sätt PM2 att starta vid systemstart
pm2 startup
# ✅ Följ instruktionerna som visas
```

### 7.2 KRITISK TESTNING
```bash
# Test 1: Testa MongoDB
mongo --eval "db.runCommand('ping')"
# ✅ Ska visa: { "ok" : 1 }

# Test 2: Testa backend lokalt
curl http://localhost:8001/api/
# ✅ Ska visa: {"message":"Hello World"}

# Test 3: Testa backend via domän
curl https://flammantech.se/api/
# ✅ Ska visa: {"message":"Hello World"}

# Test 4: Kontrollera hemsida
curl -I https://flammantech.se
# ✅ Ska visa: HTTP/2 200
```

**🎉 Om alla tester fungerar: Din webbplats är LIVE!**

### 7.3 Slutlig verifiering
1. **Öppna webbläsare** och gå till `https://flammantech.se`
2. **Testa navigation** - klicka på "Tjänster", "Info", "Kontakt"
3. **Testa kontaktformuläret** - fyll i och skicka
4. **Kontrollera email** - du ska få ett mail till melvin@flammantech.se

---

## 🔒 STEG 8: Säkerhet och optimering

### 8.1 Brandväggsinställningar
```bash
# Kontrollera brandvägg
sudo ufw status

# Om port 8001 är öppen utåt, stäng den (säkerhetsrisk)
sudo ufw deny 8001

# Öppna endast nödvändiga portar
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 8083  # Hestia panel
```

### 8.2 Automatisk backup-setup
```bash
# Skapa backup-mapp
sudo mkdir -p /home/admin/backups

# Skapa backup-script
sudo nano /home/admin/backup-flamman.sh
```

**Backup-script innehåll:**
```bash
#!/bin/bash
# Backup script för Flamman Tech

DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/home/admin/backups"

# Backup MongoDB
mongodump --db flamman_tech --out $BACKUP_DIR/mongo_$DATE

# Backup website files
tar -czf $BACKUP_DIR/website_$DATE.tar.gz /home/admin/web/flammantech.se/flamman-tech/

# Ta bort backuper äldre än 7 dagar
find $BACKUP_DIR -name "mongo_*" -mtime +7 -delete
find $BACKUP_DIR -name "website_*" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Gör scriptet körbart
sudo chmod +x /home/admin/backup-flamman.sh

# Lägg till i crontab för daglig backup
sudo crontab -e
# Lägg till denna rad: 0 2 * * * /home/admin/backup-flamman.sh
```

---

## 🚨 FELSÖKNING - Om något går fel

### ❌ Problem: "Backend startar inte"
```bash
# Steg 1: Kolla PM2-status
pm2 status

# Steg 2: Kolla detaljerade loggar
pm2 logs flamman-tech-backend --lines 50

# Steg 3: Testa manuell start
cd /home/admin/web/flammantech.se/flamman-tech/backend
source venv/bin/activate
python server.py

# Steg 4: Kolla Python-dependencies
python -c "import motor; print('MongoDB OK')"
python -c "import fastapi; print('FastAPI OK')"
```

**Vanliga lösningar:**
- **Virtual env inte aktivt:** Kör `source venv/bin/activate`
- **Dependencies saknas:** Kör `pip install -r requirements.txt`
- **Felaktig sökväg i PM2:** Kontrollera `ecosystem.config.js`

### ❌ Problem: "Frontend visar inte rätt sida"
```bash
# Steg 1: Kontrollera filer
ls -la /home/admin/web/flammantech.se/public_html/index.html

# Steg 2: Testa Nginx-konfiguration
sudo nginx -t

# Steg 3: Kolla Nginx-loggar
sudo tail -f /var/log/nginx/error.log

# Steg 4: Bygg om frontend
cd /home/admin/web/flammantech.se/flamman-tech/frontend
yarn build
sudo cp -r build/* /home/admin/web/flammantech.se/public_html/
```

### ❌ Problem: "Email fungerar inte"
```bash
# Steg 1: Testa SMTP-uppgifter
cd /home/admin/web/flammantech.se/flamman-tech/backend
source venv/bin/activate
python -c "
import smtplib
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('ditt.email@gmail.com', 'ditt_app_password')
print('SMTP OK')
server.quit()
"
```

**Vanliga lösningar:**
- **Fel lösenord:** Använd Gmail App Password, inte vanligt lösenord
- **2FA inte aktivt:** Aktivera tvåstegsverifiering på Gmail
- **Felaktigt EMAIL_TO:** Kontrollera att melvin@flammantech.se stämmer

### ❌ Problem: "API-anrop fungerar inte (404-fel)"
```bash
# Steg 1: Testa backend direkt
curl http://localhost:8001/api/

# Steg 2: Testa via domän
curl https://flammantech.se/api/

# Steg 3: Kontrollera Nginx proxy-konfiguration
sudo nano /home/admin/conf/web/nginx.flammantech.se.conf

# Steg 4: Starta om Nginx
sudo systemctl restart nginx
```

### ❌ Problem: "SSL-certifikat fungerar inte"
1. Gå till **Web** i Hestia-panelen
2. Klicka på din domän
3. Klicka **"Edit"**
4. Aktivera **"SSL Support"**
5. Aktivera **"Let's Encrypt Support"**
6. Vänta 2-3 minuter
7. Testa: `curl -I https://flammantech.se`

### ❌ Problem: "MongoDB anslutning misslyckas"
```bash
# Steg 1: Kontrollera MongoDB-status
sudo systemctl status mongod

# Steg 2: Starta MongoDB om det inte körs
sudo systemctl start mongod

# Steg 3: Testa anslutning
mongo --eval "db.runCommand('ping')"

# Steg 4: Kolla MongoDB-loggar
sudo tail -f /var/log/mongodb/mongod.log
```

### 🔄 Starta om ALLT (sista utvägen)
```bash
# Starta om alla services
sudo systemctl restart mongod
sudo systemctl restart nginx
pm2 restart flamman-tech-backend

# Kontrollera status
sudo systemctl status mongod
sudo systemctl status nginx
pm2 status
```

---

## 🔧 UNDERHÅLL OCH UPPDATERINGAR

### 📊 Övervaka webbplatsen
```bash
# Kolla loggar regelbundet
pm2 logs flamman-tech-backend
sudo tail -f /var/log/nginx/access.log

# Kolla PM2-status
pm2 status

# Kolla systemresurser
top
df -h
```

### 🔄 Uppdatera webbplatsen

**För frontend-ändringar:**
```bash
cd /home/admin/web/flammantech.se/flamman-tech/frontend
yarn build
sudo cp -r build/* /home/admin/web/flammantech.se/public_html/
```

**För backend-ändringar:**
```bash
cd /home/admin/web/flammantech.se/flamman-tech/backend
source venv/bin/activate
pm2 restart flamman-tech-backend
```

### 📋 Månadsvis underhåll
```bash
# Uppdatera system
sudo apt update && sudo apt upgrade -y

# Kolla diskutrymme
df -h

# Kolla backup-storlek
du -sh /home/admin/backups/

# Optimera MongoDB (om det blir långsamt)
mongo flamman_tech --eval "db.runCommand({compact: 'contact_submissions'})"
```

---

## 📞 SUPPORT OCH HJÄLP

### 🆘 Om du fortfarande har problem:

**Kontakta Melvin:**
- **📧 Email:** melvin@flammantech.se  
- **📱 Telefon:** 0703456746

**Innan du ringer/mailar - ha detta redo:**
1. Vilken del av guiden du fastnade på
2. Exakt felmeddelande du får
3. Output från dessa kommandon:
   ```bash
   pm2 status
   sudo systemctl status nginx
   sudo systemctl status mongod
   curl -I https://flammantech.se/api/
   ```

### 📚 Användbara kommandon att komma ihåg
```bash
# Starta om backend
pm2 restart flamman-tech-backend

# Kolla backend-loggar
pm2 logs flamman-tech-backend

# Kolla Nginx-status
sudo systemctl status nginx

# Kolla MongoDB-status
sudo systemctl status mongod

# Testa API
curl https://flammantech.se/api/

# Kolla diskutrymme
df -h

# Kolla systemresurser
top
```

---

## 🎯 SAMMANFATTNING - Vad du precis gjort:

✅ **Installerat en komplett webbplats** med React frontend och Python backend  
✅ **Konfigurerat databas** (MongoDB) för att spara kontaktformulär  
✅ **Aktiverat e-postfunktion** så du får mail när kunder kontaktar dig  
✅ **Säkrat webbplatsen** med SSL och brandvägg  
✅ **Satt upp automatisk backup** för dina data  
✅ **Konfigurerat övervakning** så webbplatsen startar automatiskt  

**Din webbplats är nu LIVE på:** https://flammantech.se 🚀

**Grattis, Melvin! Du har nu en professionell webbplats för ditt företag! 🎉**

---

*Skapad av Emergent AI - Flamman Tech Website Installation Guide v1.0*