import { Component } from "react";

function friendlySectionError(error) {
  const msg = error?.message ?? "";
  if (msg.includes("Cannot read properties of undefined")) {
    return "تعذّر عرض هذا التمرين لأن بياناته غير مكتملة.";
  }
  return "حدث خطأ أثناء عرض هذا التمرين.";
}

/** يعزل أخطاء كل محاكاة دون إسقاط الصفحة بالكامل */
export class SectionErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    const label = this.props.sectionName ?? "simulation";
    console.error(`[SectionErrorBoundary:${label}]`, error?.message, error, info?.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-100"
          role="alert"
        >
          <p className="font-bold text-red-200">
            تعذّر تحميل: {this.props.sectionName ?? "هذا التمرين"}
          </p>
          <p className="mt-2">{friendlySectionError(this.state.error)}</p>
          {import.meta.env.DEV && this.state.error?.message ? (
            <p className="mt-2 text-xs text-red-300/80" dir="ltr">
              {this.state.error.message}
            </p>
          ) : null}
          <button
            type="button"
            onClick={this.handleRetry}
            className="edu-btn edu-btn-outline mt-3 border-red-400/50 text-red-100"
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
