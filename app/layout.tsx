import './globals.css';
import React from 'react';

export const metadata = {
  title: 'AUX PM Board',
  description: 'Kanban + PMO + Time Blocks'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">AUX Immo Project</p>
              <h1 className="text-2xl font-semibold">PM Board & Daily Planner</h1>
            </div>
            <div className="space-x-3 text-sm text-slate-600">
              <span>Import</span>
              <span>Export</span>
              <span>Assistant</span>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
