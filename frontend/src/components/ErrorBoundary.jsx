import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('SkyLink frontend error:', error, info); }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] p-6"><div className="max-w-md rounded-2xl border bg-white p-10 text-center shadow-lg"><AlertTriangle size={40} className="mx-auto text-amber-500"/><h1 className="mt-5 text-2xl font-bold">Something went wrong</h1><p className="mt-3 text-sm leading-6 text-slate-500">The page encountered an unexpected error. Please refresh and try again.</p><button className="btn-blue mt-7" onClick={() => window.location.reload()}><RotateCcw size={18}/> Refresh Page</button></div></div>;
  }
}
