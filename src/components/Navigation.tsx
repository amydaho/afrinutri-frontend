"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Home, Camera, History } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: Camera, label: 'Scanner', path: '/scan' },
    { icon: History, label: 'Historique', path: '/history' },
  ];

  if (pathname?.startsWith('/results/')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          const isScanner = item.path === '/scan';

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`${isScanner ? 'scale-125' : ''}`}>
                <Icon size={isScanner ? 28 : 24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
