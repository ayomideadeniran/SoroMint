import React from 'react';
import ErrorFallback from './ErrorFallback';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({ errorInfo });
    this.logErrorToSentry(error, errorInfo);
  }

  logErrorToSentry(error, errorInfo) {
    // Check if Sentry is available (window.Sentry)
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        extra: { errorInfo },
        tags: { componentStack: errorInfo?.componentStack },
      });
    } else {
      // Fallback to console.error
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Optionally navigate to home
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;