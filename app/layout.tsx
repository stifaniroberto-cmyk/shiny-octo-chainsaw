import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Life Simulator · A world of possibilities', description: 'Compare the financial shape of life in four global cities.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
