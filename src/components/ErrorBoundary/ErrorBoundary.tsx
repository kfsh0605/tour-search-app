import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import styles from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component to catch React errors in component tree
 * Prevents the entire app from crashing due to errors in child components
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console in development
        console.error('Error caught by boundary:', error, errorInfo);
        
        // In production, you might want to log to an error reporting service
        // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className={styles.errorBoundary}>
                    <div className={styles.errorBoundary__content}>
                        <div className={styles.errorBoundary__icon}>⚠️</div>
                        <h1 className={styles.errorBoundary__title}>
                            Oops! Something went wrong
                        </h1>
                        <p className={styles.errorBoundary__message}>
                            We're sorry for the inconvenience. The application encountered an unexpected error.
                        </p>
                        
                        {import.meta.env.DEV && this.state.error && (
                            <details className={styles.errorBoundary__details}>
                                <summary>Error details (development only)</summary>
                                <pre className={styles.errorBoundary__stack}>
                                    {this.state.error.toString()}
                                    {'\n\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={this.handleReset}
                            className={styles.errorBoundary__button}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
