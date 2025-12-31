import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ColorSchemeName = 'cyan' | 'lime' | 'purple' | 'pink' | 'orange';

export interface ColorScheme {
  name: ColorSchemeName;
  primary: string;
  secondary: string;
  muted: string;
  glow: string;
}

export const COLOR_SCHEMES: Record<ColorSchemeName, ColorScheme> = {
  cyan: {
    name: 'cyan',
    primary: '#7FDDFF',
    secondary: '#60C0F0',
    muted: '#60B0E0',
    glow: 'rgba(127,221,255,0.35)',
  },
  lime: {
    name: 'lime',
    primary: '#DDFF7F',
    secondary: '#C0F060',
    muted: '#B0E060',
    glow: 'rgba(221,255,127,0.35)',
  },
  purple: {
    name: 'purple',
    primary: '#D77FFF',
    secondary: '#C060F0',
    muted: '#B060E0',
    glow: 'rgba(215,127,255,0.35)',
  },
  pink: {
    name: 'pink',
    primary: '#FF7FDD',
    secondary: '#F060C0',
    muted: '#E060B0',
    glow: 'rgba(255,127,221,0.35)',
  },
  orange: {
    name: 'orange',
    primary: '#FFB27F',
    secondary: '#F09060',
    muted: '#E08060',
    glow: 'rgba(255,178,127,0.35)',
  },
};

interface ColorSchemeContextType {
  scheme: ColorScheme;
  currentScheme: ColorSchemeName;
  setScheme: (name: ColorSchemeName) => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

export const ColorSchemeProvider = ({ children }: { children: ReactNode }) => {
  const [schemeName, setSchemeName] = useState<ColorSchemeName>(() => {
    const saved = localStorage.getItem('color-scheme');
    return (saved as ColorSchemeName) || 'cyan';
  });

  const scheme = COLOR_SCHEMES[schemeName];

  const setScheme = (name: ColorSchemeName) => {
    setSchemeName(name);
    localStorage.setItem('color-scheme', name);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', scheme.primary);
    root.style.setProperty('--secondary', scheme.secondary);
    root.style.setProperty('--muted', scheme.muted);
    root.style.setProperty('--glow-color', scheme.glow);
  }, [scheme]);

  return (
    <ColorSchemeContext.Provider value={{ scheme, currentScheme: schemeName, setScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error('useColorScheme must be used within ColorSchemeProvider');
  }
  return context;
};
