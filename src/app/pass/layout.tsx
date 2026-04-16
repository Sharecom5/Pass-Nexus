import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PassNexus — Smart Event Pass System',
  description: 'Create, distribute, and verify digital event passes with QR codes. Built for modern event organizers.',
};

export default function PassLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {children}
    </div>
  );
}
