# Deployment Guide - IobrokerDashboard

Dieses Dokument beschreibt die Installation des IobrokerDashboards auf einem Debian Proxmox LXC Container.

## Voraussetzungen

- Debian Proxmox LXC Container (Debian 11/12)
- Root-Zugriff auf den Container
- Netzwerkzugriff zu ioBroker und Grafana
- Mindestens 1GB RAM, 2GB Speicher

## Schnellinstallation (Empfohlen)

### Methode 1: Ein-Befehl-Installation (Empfohlen)

Die einfachste Methode - funktioniert auch auf komplett frischen LXC Containern:

```bash
# Als root auf dem LXC Container
curl -fsSL https://raw.githubusercontent.com/tipp88/iobroker-dashboard/main/bootstrap.sh | bash
```

**Das war's!** Das Skript installiert automatisch alle Voraussetzungen und startet das Deployment.

### Methode 2: Download und Ausführung

Falls die Ein-Befehl-Installation Probleme macht (z.B. bei interaktiven Eingaben):

```bash
# Als root auf dem LXC Container
curl -fsSL https://raw.githubusercontent.com/tipp88/iobroker-dashboard/main/bootstrap.sh -o /tmp/bootstrap.sh
bash /tmp/bootstrap.sh
```

### Methode 3: Manuelle Schritte

Falls Sie die Schritte einzeln ausführen möchten:

```bash
# Als root auf dem LXC Container
apt update
apt install -y git curl
mkdir -p /var/www
cd /var/www
git clone https://github.com/tipp88/iobroker-dashboard.git
cd iobroker-dashboard
chmod +x deploy-lxc.sh
./deploy-lxc.sh
```

Das Deployment-Skript führt Sie durch folgende Schritte:
1. System-Updates installieren
2. Node.js 20.x installieren
3. nginx installieren
4. Umgebungsvariablen konfigurieren (interaktiv)
5. Dependencies installieren
6. Production Build erstellen
7. nginx konfigurieren
8. nginx starten

### Zugriff testen

Nach erfolgreicher Installation ist das Dashboard erreichbar unter:
```
http://LXC-IP-ADRESSE
```

## Manuelle Installation

Falls Sie die Installation manuell durchführen möchten:

### Schritt 1: System vorbereiten

```bash
apt update && apt upgrade -y
```

### Schritt 2: Node.js installieren

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### Schritt 3: nginx installieren

```bash
apt install -y nginx
```

### Schritt 4: Repository klonen

```bash
cd /var/www
git clone https://github.com/tipp88/iobroker-dashboard.git
cd iobroker-dashboard
```

### Schritt 5: Umgebungsvariablen konfigurieren

```bash
nano .env.local
```

Inhalt:
```env
VITE_IOBROKER_API_URL=http://IHRE_IOBROKER_IP:8087
VITE_GRAFANA_URL=http://IHRE_GRAFANA_URL
VITE_POLLING_INTERVAL=5000
```

### Schritt 6: Dependencies installieren

```bash
npm install
```

### Schritt 7: Production Build erstellen

```bash
npm run build
```

### Schritt 8: nginx konfigurieren

```bash
nano /etc/nginx/sites-available/iobroker-dashboard
```

Inhalt:
```nginx
server {
    listen 80;
    server_name _;

    root /var/www/iobroker-dashboard/dist;
    index index.html;

    # Gzip Kompression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache für statische Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Site aktivieren:
```bash
ln -s /etc/nginx/sites-available/iobroker-dashboard /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx
```

## Updates

### Automatisches Update

```bash
cd /var/www/iobroker-dashboard
chmod +x update.sh
./update.sh
```

Das Update-Skript führt automatisch folgende Schritte aus:
1. Sichert Ihre .env.local
2. Lädt Updates von GitHub
3. Installiert neue Dependencies
4. Erstellt neuen Build
5. Lädt nginx neu

### Manuelles Update

```bash
cd /var/www/iobroker-dashboard
cp .env.local .env.local.backup
git pull origin main
npm install
npm run build
mv .env.local.backup .env.local
systemctl reload nginx
```

## Konfiguration

### Umgebungsvariablen (.env.local)

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `VITE_IOBROKER_API_URL` | ioBroker Simple API URL | `http://192.168.1.100:8087` |
| `VITE_GRAFANA_URL` | Grafana Base URL | `http://192.168.1.100:3000` |
| `VITE_POLLING_INTERVAL` | Polling-Intervall in ms | `5000` |

### nginx Port ändern

```bash
nano /etc/nginx/sites-available/iobroker-dashboard
# Ändern Sie: listen 80; → listen NEUER_PORT;
nginx -t
systemctl reload nginx
```

### HTTPS aktivieren

Verwenden Sie Let's Encrypt mit certbot:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d ihre-domain.de
```

## Troubleshooting

### Git-Fehler: "Password authentication is not supported"

**Problem:** Das Repository ist noch privat auf GitHub.

**Lösung:**
1. Öffnen Sie: https://github.com/tipp88/iobroker-dashboard
2. Gehe zu **Settings** → **Danger Zone**
3. Klicke auf **Change visibility** → **Make public**
4. Bestätige mit dem Repository-Namen
5. Führe das Bootstrap-Skript erneut aus

### Dashboard zeigt keine Daten

1. Überprüfen Sie die `.env.local` Datei
2. Testen Sie ioBroker API: `curl http://IOBROKER_IP:8087/get/0_userdata.0`
3. Prüfen Sie Browser-Konsole auf Fehler (F12)

### nginx startet nicht

```bash
# Konfiguration testen
nginx -t

# Logs prüfen
tail -f /var/log/nginx/error.log
```

### Port bereits belegt

```bash
# Prüfen welcher Prozess Port 80 verwendet
lsof -i :80

# Anderen Port in nginx verwenden (siehe oben)
```

### Build schlägt fehl

```bash
# Node-Version prüfen (sollte >= 18 sein)
node --version

# Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Nützliche Befehle

```bash
# nginx Status
systemctl status nginx

# nginx neu starten
systemctl restart nginx

# nginx Logs live ansehen
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Dashboard aktualisieren
cd /var/www/iobroker-dashboard && ./update.sh

# Build neu erstellen
cd /var/www/iobroker-dashboard
npm run build
systemctl reload nginx
```

## Performance-Optimierung

### nginx Cache erweitern

Fügen Sie in `/etc/nginx/sites-available/iobroker-dashboard` hinzu:

```nginx
# Vor dem server-Block
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=100m inactive=60m;

# Im server-Block bei location /api/
proxy_cache my_cache;
proxy_cache_valid 200 1m;
```

### Größere Log-Dateien

```bash
# In /etc/nginx/nginx.conf
access_log /var/log/nginx/access.log combined buffer=32k;
```

## Backup

### Wichtige Dateien sichern

```bash
# .env.local sichern
cp /var/www/iobroker-dashboard/.env.local ~/dashboard-backup.env

# Gesamtes Verzeichnis sichern
tar -czf ~/dashboard-backup-$(date +%Y%m%d).tar.gz /var/www/iobroker-dashboard
```

### Wiederherstellen

```bash
tar -xzf ~/dashboard-backup-YYYYMMDD.tar.gz -C /
systemctl reload nginx
```

## Support

- GitHub Issues: https://github.com/tipp88/iobroker-dashboard/issues
- Repository: https://github.com/tipp88/iobroker-dashboard
