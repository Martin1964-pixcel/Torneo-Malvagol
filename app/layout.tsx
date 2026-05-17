import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Torneos Malvagol',
  description: 'Sistema de estadísticas para torneos de fútbol 7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
