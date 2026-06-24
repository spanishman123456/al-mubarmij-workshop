import { Component } from "react";

function friendlyErrorMessage(error) {
  const msg = error?.message ?? "";
  if (msg.includes("Cannot read properties of undefined")) {
    return "تعذّر عرض جزء من الصفحة لأن بيانات المحتوى غير مكتملة. جرّب إعادة المحاولة أو تحديث الصفحة.";
  }
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
    return "تعذّر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة.";
  }
  return "حدث خطأ غير متوقع أثناء عرض الصفحة. يمكنك إعادة المحاولة أو العودة للرئيسية.";
}

/** Catches render errors so a failed component does not leave a blank white screen. */
export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error?.message, error, info?.componentStack);
    this.setState({ error });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const detail = this.state.error?.message;
      const hint = friendlyErrorMessage(this.state.error);

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center font-ar">
          <h1 className="text-xl font-bold text-slate-900">حدث خطأ أثناء عرض الصفحة</h1>
          <p className="mt-2 max-w-md text-slate-600">{hint}</p>
          {import.meta.env.DEV && detail ? (
            <p className="mt-3 max-w-lg rounded-lg bg-rose-50 px-4 py-2 text-start text-xs text-rose-800" dir="ltr">
              {detail}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="rounded-full border border-violet-300 bg-white px-6 py-3 font-bold text-violet-700 hover:bg-violet-50"
            >
              إعادة المحاولة
            </button>
            <a
              href="/"
              className="rounded-full bg-violet-600 px-6 py-3 font-bold text-white hover:bg-violet-500"
            >
              العودة للرئيسية
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
