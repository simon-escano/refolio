import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Component Error</h3>
            <p className="text-xs text-red-500/80 font-mono line-clamp-3 max-w-[400px] break-all">
              {this.state.error?.message || "Unknown error"}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/80 transition-colors mt-2"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
