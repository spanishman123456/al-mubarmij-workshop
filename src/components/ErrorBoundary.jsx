import { Component } from "react";

/** Catches render errors so a failed component does not leave a blank white screen. */
export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center font-ar">
          <h1 className="text-xl font-bold text-slate-900">حدث خطأ أثناء عرض الصفحة</h1>
          <p className="mt-2 max-w-md text-slate-600">
            جرّب تحديث الصفحة (F5). إذا تكرّر الأمر، افتح الرئيسية من الزر أدناه.
          </p>
          {/* Full page navigation resets this boundary */}
          <a
            href="/"
            className="mt-6 rounded-full bg-violet-600 px-6 py-3 font-bold text-white hover:bg-violet-500"
          >
            العودة للرئيسية
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
