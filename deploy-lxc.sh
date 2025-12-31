#!/bin/bash
set -e

# IobrokerDashboard - LXC Deployment Script
# Dieses Skript installiert das Dashboard auf einem Debian Proxmox LXC Container

echo "=========================================="
echo "IobrokerDashboard - LXC Deployment"
echo "=========================================="
echo ""

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Funktion für farbige Ausgabe
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Überprüfen ob als root ausgeführt
if [ "$EUID" -ne 0 ]; then
    print_error "Bitte als root ausführen (sudo ./deploy-lxc.sh)"
    exit 1
fi

# Schritt 1: System aktualisieren
echo ""
echo "Schritt 1: System aktualisieren..."
apt update && apt upgrade -y
print_status "System aktualisiert"

# Schritt 2: Node.js und npm installieren
echo ""
echo "Schritt 2: Node.js und npm installieren..."
if ! command -v node &> /dev/null; then
    # NodeSource Repository für Node.js 20.x hinzufügen
    apt install -y curl
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    print_status "Node.js $(node --version) installiert"
else
    print_status "Node.js bereits installiert: $(node --version)"
fi

# Schritt 3: nginx installieren
echo ""
echo "Schritt 3: nginx installieren..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    print_status "nginx installiert"
else
    print_status "nginx bereits installiert"
fi

# Schritt 4: Git installieren
echo ""
echo "Schritt 4: Git installieren..."
if ! command -v git &> /dev/null; then
    apt install -y git
    print_status "Git installiert"
else
    print_status "Git bereits installiert"
fi

# Schritt 5: Repository vorbereiten
echo ""
echo "Schritt 5: Repository vorbereiten..."
INSTALL_DIR="/var/www/iobroker-dashboard"

# Wenn das Skript nicht aus dem Zielverzeichnis läuft, klone es
if [ "$PWD" != "$INSTALL_DIR" ]; then
    if [ -d "$INSTALL_DIR" ]; then
        print_warning "Verzeichnis $INSTALL_DIR existiert bereits"
        read -p "Möchten Sie es löschen und neu klonen? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Sicherstellen, dass wir nicht im zu löschenden Verzeichnis sind
            cd /tmp
            rm -rf "$INSTALL_DIR"
            print_status "Altes Verzeichnis gelöscht"
        else
            print_error "Deployment abgebrochen"
            exit 1
        fi
    fi

    git clone https://github.com/tipp88/iobroker-dashboard.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    print_status "Repository geklont nach $INSTALL_DIR"
else
    # Skript läuft bereits im Zielverzeichnis (via bootstrap.sh)
    print_status "Repository bereits vorhanden"
fi

# Schritt 6: Umgebungsvariablen konfigurieren
echo ""
echo "Schritt 6: Umgebungsvariablen konfigurieren..."
echo ""
print_warning "Bitte geben Sie Ihre Konfigurationswerte ein:"
echo ""

# ioBroker URL mit Validierung
while true; do
    read -p "ioBroker API URL (z.B. http://192.168.1.100:8087): " IOBROKER_URL
    if [[ "$IOBROKER_URL" =~ ^https?:// ]]; then
        break
    else
        print_error "Ungültige URL. Muss mit http:// oder https:// beginnen."
    fi
done

# Grafana URL mit Validierung
while true; do
    read -p "Grafana URL (z.B. http://192.168.1.100:3000): " GRAFANA_URL
    if [[ "$GRAFANA_URL" =~ ^https?:// ]]; then
        break
    else
        print_error "Ungültige URL. Muss mit http:// oder https:// beginnen."
    fi
done

# Polling Interval mit Validierung
while true; do
    read -p "Polling Interval in ms [5000]: " POLLING_INTERVAL
    POLLING_INTERVAL=${POLLING_INTERVAL:-5000}
    if [[ "$POLLING_INTERVAL" =~ ^[0-9]+$ ]] && [ "$POLLING_INTERVAL" -ge 100 ]; then
        break
    else
        print_error "Ungültiges Interval: '$POLLING_INTERVAL'. Bitte eine Zahl >= 100 eingeben."
    fi
done

cat > .env.local << EOF
VITE_IOBROKER_API_URL=$IOBROKER_URL
VITE_GRAFANA_URL=$GRAFANA_URL
VITE_POLLING_INTERVAL=$POLLING_INTERVAL
EOF

print_status ".env.local erstellt"

# Schritt 7: Dependencies installieren
echo ""
echo "Schritt 7: npm Dependencies installieren..."
npm install
print_status "Dependencies installiert"

# Schritt 8: Production Build erstellen
echo ""
echo "Schritt 8: Production Build erstellen..."
npm run build
print_status "Build erfolgreich erstellt"

# Schritt 9: nginx konfigurieren
echo ""
echo "Schritt 9: nginx konfigurieren..."

# Port abfragen mit Validierung
while true; do
    read -p "Port für Dashboard [80]: " DASHBOARD_PORT
    DASHBOARD_PORT=${DASHBOARD_PORT:-80}

    # Validiere dass es eine Zahl zwischen 1 und 65535 ist
    if [[ "$DASHBOARD_PORT" =~ ^[0-9]+$ ]] && [ "$DASHBOARD_PORT" -ge 1 ] && [ "$DASHBOARD_PORT" -le 65535 ]; then
        break
    else
        print_error "Ungültiger Port: '$DASHBOARD_PORT'. Bitte eine Zahl zwischen 1 und 65535 eingeben."
    fi
done

cat > /etc/nginx/sites-available/iobroker-dashboard << EOF
server {
    listen $DASHBOARD_PORT;
    server_name _;

    root $INSTALL_DIR/dist;
    index index.html;

    # Gzip Kompression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache für statische Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Optional: Proxy für ioBroker API (vermeidet CORS)
    # location /api/ {
    #     proxy_pass $IOBROKER_URL/;
    #     proxy_set_header Host \$host;
    #     proxy_set_header X-Real-IP \$remote_addr;
    #     proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    # }
}
EOF

# Nginx site aktivieren
ln -sf /etc/nginx/sites-available/iobroker-dashboard /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Nginx Konfiguration testen
if nginx -t; then
    print_status "nginx Konfiguration gültig"
else
    print_error "nginx Konfiguration fehlerhaft"
    exit 1
fi

# Schritt 10: nginx neu starten
echo ""
echo "Schritt 10: nginx neu starten..."
systemctl restart nginx
systemctl enable nginx
print_status "nginx gestartet und aktiviert"

# Schritt 11: Firewall Hinweis
echo ""
print_warning "Hinweis: Falls eine Firewall aktiv ist, Port $DASHBOARD_PORT freigeben:"
echo "  ufw allow $DASHBOARD_PORT/tcp"

# Schritt 12: Dashboard URL ermitteln und anzeigen
echo ""
echo "Schritt 12: Dashboard-Zugriff konfigurieren..."

# IP-Adresse ermitteln
IP_ADDRESS=$(hostname -I | awk '{print $1}')

# URL zusammenstellen
if [ "$DASHBOARD_PORT" = "80" ]; then
    DASHBOARD_URL="http://$IP_ADDRESS"
else
    DASHBOARD_URL="http://$IP_ADDRESS:$DASHBOARD_PORT"
fi

print_status "Dashboard ist bereit!"

# Fertig!
echo ""
echo "=========================================="
echo -e "${GREEN}✓ Deployment erfolgreich abgeschlossen!${NC}"
echo "=========================================="
echo ""
echo -e "${GREEN}${BOLD}Ihr Dashboard ist jetzt erreichbar unter:${NC}"
echo ""
echo -e "  ${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${GREEN}➜  ${DASHBOARD_URL}${NC}"
echo -e "  ${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Öffnen Sie diese URL in Ihrem Browser!"
echo ""
echo "Nützliche Befehle:"
echo "  nginx neu starten:  systemctl restart nginx"
echo "  nginx Status:       systemctl status nginx"
echo "  nginx Logs:         tail -f /var/log/nginx/error.log"
echo "  Update ausführen:   cd $INSTALL_DIR && ./update.sh"
echo ""
echo "Dashboard-URL:"
echo "  $DASHBOARD_URL"
echo ""
