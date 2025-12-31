# ioBroker Dashboard

Ein modernes, reaktives Dashboard für ioBroker Smart Home Systeme, entwickelt mit React + TypeScript + Vite.

![ioBroker Dashboard](https://img.shields.io/badge/ioBroker-Dashboard-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

## ✨ Features

- 🏠 **Device Management**: Verwaltung von Klimaanlagen, Sensoren, Schaltern und Rollläden
- 📊 **Grafana Integration**: Eingebettete Grafana-Dashboards für Datenvisualisierung
- ⚙️ **Control Panels**: Konfigurierbare Steuerungspanels aus JSON-Konfiguration
- 🔄 **Real-time Updates**: Automatisches Polling der ioBroker-Daten (konfigurierbar)
- 💾 **Persistent Storage**: Benutzer-Konfigurationen werden lokal gespeichert
- 🎨 **Modern UI**: Responsive Design mit Tailwind CSS
- 🌐 **Multi-Page**: Navigation zwischen verschiedenen Ansichten (Heizung, Solar, EVCC, etc.)

## 🚀 Schnellstart - Deployment auf Proxmox LXC

### Ein-Befehl-Installation

```bash
curl -fsSL https://raw.githubusercontent.com/tipp88/iobroker-dashboard/main/bootstrap.sh -o /tmp/bootstrap.sh
bash /tmp/bootstrap.sh
```

Das Skript führt automatisch durch:
- Installation von Node.js, nginx, git
- Repository klonen
- Interaktive Konfiguration
- Production Build erstellen
- nginx-Setup

📖 **Vollständige Deployment-Anleitung:** [DEPLOYMENT.md](DEPLOYMENT.md)

## 🛠️ Lokale Entwicklung

### Voraussetzungen

- Node.js >= 18
- npm oder yarn
- ioBroker-Installation mit Simple API aktiviert

### Installation

```bash
# Repository klonen
git clone https://github.com/tipp88/iobroker-dashboard.git
cd iobroker-dashboard

# Dependencies installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env.local
nano .env.local
```

### Konfiguration (.env.local)

```env
VITE_IOBROKER_API_URL=http://192.168.1.100:8087
VITE_GRAFANA_URL=http://192.168.1.100:3000
VITE_POLLING_INTERVAL=5000
```

### Development Server starten

```bash
npm run dev
```

Öffne http://localhost:5173 im Browser.

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Projektstruktur

```
iobroker-dashboard/
├── data/
│   └── todo.json              # Konfiguration für Pages & Control Panels
├── src/
│   ├── api/                   # ioBroker API Client
│   ├── components/
│   │   ├── devices/           # Device-spezifische Komponenten
│   │   ├── controls/          # Control Panel Komponenten
│   │   ├── settings/          # Settings UI
│   │   └── ui/                # Wiederverwendbare UI-Komponenten
│   ├── config/                # Konfigurationsdateien
│   ├── contexts/              # React Contexts
│   ├── hooks/                 # Custom React Hooks
│   ├── store/                 # Zustand State Management
│   ├── types/                 # TypeScript Typdefinitionen
│   ├── utils/                 # Utility-Funktionen
│   └── views/                 # Haupt-Ansichten/Pages
├── deploy-lxc.sh              # Deployment-Skript
├── update.sh                  # Update-Skript
└── bootstrap.sh               # Bootstrap-Skript
```

## 🔧 Konfiguration

### Geräte hinzufügen

Geräte werden in `src/config/devices.config.ts` definiert:

```typescript
export const CLIMATE_DEVICES: ClimateDevice[] = [
  {
    id: 'climate-1',
    name: 'Wohnzimmer Klimaanlage',
    room: 'Wohnzimmer',
    stateIds: {
      currentTemp: 'hm-rpc.0.XXX.ACTUAL_TEMPERATURE',
      targetTemp: 'hm-rpc.0.XXX.SET_TEMPERATURE',
      mode: 'hm-rpc.0.XXX.MODE',
      power: 'hm-rpc.0.XXX.POWER',
    },
  },
];
```

### Control Panels konfigurieren

Control Panels werden in `data/todo.json` konfiguriert und können zur Laufzeit über die Settings-UI bearbeitet werden.

## 📦 Technologie-Stack

- **Frontend Framework**: React 18
- **Sprache**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios

## 🔄 Updates

Auf einem deployed LXC Container:

```bash
cd /var/www/iobroker-dashboard
./update.sh
```

Das Update-Skript:
- Lädt neueste Änderungen von GitHub
- Installiert neue Dependencies
- Erstellt neuen Production Build
- Lädt nginx neu

## 🤝 Beitragen

Contributions sind willkommen! Bitte:

1. Forke das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushe zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Lizenz

Dieses Projekt ist Open Source und für private Nutzung frei verfügbar.

## 🐛 Probleme melden

Probleme oder Feature-Requests können als [GitHub Issues](https://github.com/tipp88/iobroker-dashboard/issues) gemeldet werden.

## 📚 Weitere Dokumentation

- [Deployment Guide](DEPLOYMENT.md) - Vollständige Installationsanleitung für Proxmox LXC
- [Claude Code Instructions](../CLAUDE.md) - Anweisungen für Claude Code AI

## 🙏 Danksagungen

- ioBroker Community
- React & Vite Teams
- Alle Contributors

---

**Erstellt mit** ❤️ **und [Claude Code](https://claude.com/claude-code)**
