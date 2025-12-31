import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDeviceState } from '../../hooks/useDeviceState';
import { Card } from '../ui/Card';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom BMW icon (blue)
const bmwIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#1976d2" stroke="white" stroke-width="2"/>
      <text x="12" y="16" font-size="12" fill="white" text-anchor="middle" font-weight="bold">B</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom Cupra icon (orange/red)
const cupraIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#e65100" stroke="white" stroke-width="2"/>
      <text x="12" y="16" font-size="12" fill="white" text-anchor="middle" font-weight="bold">C</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapCenterControllerProps {
  center: [number, number] | null;
  zoom: number;
}

// Component to control map center
const MapCenterController = ({ center, zoom }: MapCenterControllerProps) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

interface CarMapProps {
  bmwStateId: string;
  cupraStateId: string;
}

export const CarMap = ({ bmwStateId, cupraStateId }: CarMapProps) => {
  const { data: bmwLocation } = useDeviceState(bmwStateId);
  const { data: cupraLocation } = useDeviceState(cupraStateId);

  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState(13);

  // Parse location strings (expected format: "latitude,longitude" or similar)
  const parseBMWLocation = (): [number, number] | null => {
    if (!bmwLocation) return null;
    const locationStr = String(bmwLocation);
    // Try to parse as "lat,lng" or extract numbers
    const parts = locationStr.split(',').map(s => parseFloat(s.trim()));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts[0], parts[1]];
    }
    return null;
  };

  const parseCupraLocation = (): [number, number] | null => {
    if (!cupraLocation) return null;
    const locationStr = String(cupraLocation);
    const parts = locationStr.split(',').map(s => parseFloat(s.trim()));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts[0], parts[1]];
    }
    return null;
  };

  const bmwPos = parseBMWLocation();
  const cupraPos = parseCupraLocation();

  // Set initial map center to first available car location
  useEffect(() => {
    if (!mapCenter) {
      if (bmwPos) {
        setMapCenter(bmwPos);
      } else if (cupraPos) {
        setMapCenter(cupraPos);
      } else {
        // Default to a central location (Germany)
        setMapCenter([51.1657, 10.4515]);
      }
    }
  }, [bmwPos, cupraPos, mapCenter]);

  const focusOnBMW = () => {
    if (bmwPos) {
      setMapCenter(bmwPos);
      setMapZoom(15);
    }
  };

  const focusOnCupra = () => {
    if (cupraPos) {
      setMapCenter(cupraPos);
      setMapZoom(15);
    }
  };

  const showBothCars = () => {
    if (bmwPos && cupraPos) {
      // Calculate center between both cars
      const centerLat = (bmwPos[0] + cupraPos[0]) / 2;
      const centerLng = (bmwPos[1] + cupraPos[1]) / 2;
      setMapCenter([centerLat, centerLng]);
      setMapZoom(13);
    }
  };

  if (!mapCenter) {
    return (
      <Card>
        <h3 className="text-h2 text-text-primary font-semibold mb-4">Car Locations</h3>
        <p className="text-body text-text-secondary">Loading map...</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-h2 text-text-primary font-semibold">Car Locations</h3>

          {/* Focus buttons */}
          <div className="flex gap-2">
            <button
              onClick={focusOnBMW}
              disabled={!bmwPos}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-surface2 disabled:text-text-secondary text-white text-caption font-medium transition-colors disabled:cursor-not-allowed"
            >
              BMW
            </button>
            <button
              onClick={focusOnCupra}
              disabled={!cupraPos}
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-surface2 disabled:text-text-secondary text-white text-caption font-medium transition-colors disabled:cursor-not-allowed"
            >
              Cupra
            </button>
            <button
              onClick={showBothCars}
              disabled={!bmwPos || !cupraPos}
              className="px-4 py-2 rounded-lg bg-neutral-surface2 hover:bg-neutral-surface3 disabled:opacity-50 text-text-primary text-caption font-medium transition-colors disabled:cursor-not-allowed"
            >
              Both
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-lg overflow-hidden h-[500px] border border-stroke-default">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapCenterController center={mapCenter} zoom={mapZoom} />

            {bmwPos && (
              <Marker position={bmwPos} icon={bmwIcon}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-blue-600">BMW iX1</strong>
                    <br />
                    <small>{bmwPos[0].toFixed(6)}, {bmwPos[1].toFixed(6)}</small>
                  </div>
                </Popup>
              </Marker>
            )}

            {cupraPos && (
              <Marker position={cupraPos} icon={cupraIcon}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-orange-600">Cupra Born</strong>
                    <br />
                    <small>{cupraPos[0].toFixed(6)}, {cupraPos[1].toFixed(6)}</small>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Location info */}
        <div className="grid grid-cols-2 gap-3 text-caption">
          <div className="p-3 rounded-lg bg-neutral-surface1/80 border border-stroke-default">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="font-semibold text-text-primary">BMW iX1</span>
            </div>
            <p className="text-text-secondary">
              {bmwPos ? `${bmwPos[0].toFixed(6)}, ${bmwPos[1].toFixed(6)}` : 'Location unavailable'}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-surface1/80 border border-stroke-default">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <span className="font-semibold text-text-primary">Cupra Born</span>
            </div>
            <p className="text-text-secondary">
              {cupraPos ? `${cupraPos[0].toFixed(6)}, ${cupraPos[1].toFixed(6)}` : 'Location unavailable'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
