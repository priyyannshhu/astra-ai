'use client';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {children}
    </div>
  );
}
