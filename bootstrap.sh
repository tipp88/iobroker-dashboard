#!/bin/bash
set -e

# IobrokerDashboard - Bootstrap Script
# Dieses Skript lädt das Deployment-Skript herunter und führt es aus

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

echo "=========================================="
echo "IobrokerDashboard - Bootstrap"
echo "=========================================="
echo ""

# Überprüfen ob als root ausgeführt
if [ "$EUID" -ne 0 ]; then
    print_error "Bitte als root ausführen"
    echo "Versuchen Sie: sudo bash bootstrap.sh"
    exit 1
fi

# Schritt 1: Git installieren (falls nicht vorhanden)
echo "Schritt 1: Voraussetzungen installieren..."
apt update

if ! command -v git &> /dev/null; then
    echo "Git wird installiert..."
    apt install -y git
    print_status "Git installiert"
else
    print_status "Git bereits vorhanden"
fi

if ! command -v curl &> /dev/null; then
    echo "curl wird installiert..."
    apt install -y curl
    print_status "curl installiert"
else
    print_status "curl bereits vorhanden"
fi

# Schritt 2: /var/www Verzeichnis erstellen
echo ""
echo "Schritt 2: Verzeichnis vorbereiten..."
mkdir -p /var/www
print_status "/var/www erstellt"

# Schritt 3: Repository klonen
echo ""
echo "Schritt 3: Repository klonen..."
cd /var/www

if [ -d "iobroker-dashboard" ]; then
    print_warning "Verzeichnis iobroker-dashboard existiert bereits"
    read -p "Möchten Sie es löschen und neu klonen? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf iobroker-dashboard
        print_status "Altes Verzeichnis gelöscht"
    else
        print_error "Installation abgebrochen"
        exit 1
    fi
fi

# Versuche zuerst HTTPS (für öffentliche Repos)
if git clone https://github.com/tipp88/iobroker-dashboard.git 2>/dev/null; then
    print_status "Repository geklont (HTTPS)"
else
    print_warning "HTTPS-Klonen fehlgeschlagen. Repository ist vermutlich privat."
    echo ""
    echo "Bitte machen Sie das Repository public auf GitHub:"
    echo "  1. Öffnen Sie: https://github.com/tipp88/iobroker-dashboard"
    echo "  2. Settings → Danger Zone → Change visibility → Make public"
    echo ""
    print_error "Installation abgebrochen"
    exit 1
fi

cd iobroker-dashboard

# Schritt 4: Deployment-Skript ausführbar machen
echo ""
echo "Schritt 4: Deployment-Skript vorbereiten..."
chmod +x deploy-lxc.sh
print_status "Deployment-Skript bereit"

# Schritt 5: Deployment-Skript ausführen
echo ""
echo "=========================================="
echo "Starte Deployment-Skript..."
echo "=========================================="
echo ""

exec ./deploy-lxc.sh
