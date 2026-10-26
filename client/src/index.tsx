import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RoutesComponent from './app.tsx';
import './index.css';
import { Toaster } from './components/ui/sonner';

const CLIENT_BASE_PATH = (typeof process !== 'undefined' && process.env && process.env.CLIENT_BASE_PATH) || '/';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6 text-stone-800">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 border border-stone-200">
            <h2 className="text-xl font-bold text-red-600 mb-2">页面渲染出错</h2>
            <p className="text-sm text-stone-600 mb-4">{this.state.error?.message || '未知错误'}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition"
            >
              重新加载
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainApp = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={CLIENT_BASE_PATH}>
        <RoutesComponent />
        <Toaster />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<MainApp />);
}

