import type { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: 'url(/bg.png)' }}
    >
      <TopBar />

      <main className="container mx-auto max-w-[1920px] px-4 py-4 pb-24">
        {children}
      </main>

      <BottomNav />
    </div>
  );
};
