#!/bin/bash
set -e

# IobrokerDashboard - Update Script
# Aktualisiert das Dashboard von GitHub

echo "=========================================="
echo "IobrokerDashboard - Update"
echo "=========================================="
echo ""

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

# Überprüfen ob wir im richtigen Verzeichnis sind
if [ ! -f "package.json" ]; then
    print_error "Bitte im Dashboard-Verzeichnis ausführen"
    exit 1
fi

# Schritt 1: Lokale Änderungen sichern
echo "Schritt 1: Überprüfe lokale Änderungen..."
if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup
    print_status ".env.local gesichert"
fi

# Schritt 2: Git Status prüfen
echo ""
echo "Schritt 2: Git Status prüfen..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Lokale Änderungen gefunden:"
    git status --short
    echo ""
    read -p "Änderungen verwerfen und fortfahren? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Update abgebrochen"
        exit 1
    fi
    git reset --hard
    print_status "Lokale Änderungen verworfen"
fi

# Schritt 3: Aktuelle Version anzeigen
echo ""
echo "Schritt 3: Aktuelle Version..."
CURRENT_COMMIT=$(git rev-parse --short HEAD)
echo "  Aktuell: $CURRENT_COMMIT - $(git log -1 --pretty=%B | head -n 1)"

# Schritt 4: Updates abrufen
echo ""
echo "Schritt 4: Updates von GitHub abrufen..."
git fetch origin
LATEST_COMMIT=$(git rev-parse --short origin/main)

if [ "$CURRENT_COMMIT" = "$LATEST_COMMIT" ]; then
    print_status "Bereits auf dem neuesten Stand!"
    exit 0
fi

echo "  Neueste Version: $LATEST_COMMIT - $(git log origin/main -1 --pretty=%B | head -n 1)"
echo ""

# Schritt 5: Updates anwenden
echo "Schritt 5: Updates anwenden..."
git pull origin main
print_status "Code aktualisiert"

# Schritt 6: Dependencies aktualisieren
echo ""
echo "Schritt 6: Dependencies aktualisieren..."
npm install
print_status "Dependencies aktualisiert"

# Schritt 7: .env.local wiederherstellen
echo ""
echo "Schritt 7: Konfiguration wiederherstellen..."
if [ -f ".env.local.backup" ]; then
    mv .env.local.backup .env.local
    print_status ".env.local wiederhergestellt"
fi

# Schritt 8: Neuen Build erstellen
echo ""
echo "Schritt 8: Production Build erstellen..."
npm run build
print_status "Build erfolgreich erstellt"

# Schritt 9: nginx neu laden
echo ""
echo "Schritt 9: nginx neu laden..."
if command -v systemctl &> /dev/null; then
    if systemctl is-active --quiet nginx; then
        systemctl reload nginx
        print_status "nginx neu geladen"
    else
        print_warning "nginx läuft nicht"
    fi
fi

# Änderungsprotokoll anzeigen
echo ""
echo "=========================================="
echo -e "${GREEN}Update erfolgreich abgeschlossen!${NC}"
echo "=========================================="
echo ""
echo "Änderungen:"
git log --oneline --no-merges $CURRENT_COMMIT..$LATEST_COMMIT
echo ""
print_status "Dashboard wurde aktualisiert von $CURRENT_COMMIT auf $LATEST_COMMIT"
echo ""
