import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

function ErrorFallback({ error, errorInfo, onReset }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4" role="alert">
      <div className="glass-card max-w-2xl w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/20 p-4 rounded-full">
            <AlertTriangle className="w-16 h-16 text-red-400" aria-hidden="true" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-slate-100">
          Oops! Something went wrong
        </h1>
        <p className="text-slate-300 mb-8">
          The application encountered an unexpected error. Don't worry, your data is safe.
        </p>

        <div className="bg-slate-800/50 rounded-lg p-4 mb-8 text-left overflow-auto max-h-64">
          <h2 className="text-sm font-semibold text-slate-400 mb-2">Error Details</h2>
          <code className="text-sm text-red-300 block whitespace-pre-wrap">
            {error?.toString() || 'Unknown error'}
          </code>
          {errorInfo?.componentStack && (
            <>
              <h3 className="text-sm font-semibold text-slate-400 mt-4 mb-2">Component Stack</h3>
              <pre className="text-xs text-slate-400 overflow-auto">
                {errorInfo.componentStack}
              </pre>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="btn-primary flex items-center justify-center gap-2 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Try again"
          >
            <RefreshCw size={18} aria-hidden="true" />
            Try Again
          </button>
          <button
            onClick={() => { window.location.href = '/'; }}
            className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Go to home page"
          >
            <Home size={18} aria-hidden="true" />
            Go Home
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-sm text-slate-400">
            If the problem persists, please contact support or check our{' '}
            <a href="https://github.com/EDOHWARES/SoroMint/issues" className="text-stellar-blue hover:underline">
              GitHub issues
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;