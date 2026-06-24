import { Link } from "react-router-dom";

/**
 * غلاف صفحات المحتوى — خلفية فاتحة ونص داكن للقراءة الواضحة.
 */
export function PageShell({ title, subtitle, badge, children, hero, className = "" }) {
  return (
    <div className={`page-shell min-h-screen pb-20 pt-20 font-ar ${className}`} dir="rtl">
      <div className="page-shell-hero">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {badge ? (
            <span className="edu-badge mb-3 inline-block">{badge}</span>
          ) : null}
          <h1 className="edu-page-title">{title}</h1>
          {subtitle ? <p className="edu-page-subtitle mt-3 max-w-3xl">{subtitle}</p> : null}
          {hero ? <div className="mt-6">{hero}</div> : null}
        </div>
      </div>
      <div className="mx-auto max-w-6xl animate-slide-up px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}

export function EduCard({ title, subtitle, children, className = "", accent }) {
  return (
    <article className={`edu-card press-scale ${className}`}>
      {accent ? (
        <div className={`edu-card-accent edu-card-accent--${accent}`} aria-hidden />
      ) : null}
      {title ? <h2 className="edu-card-title">{title}</h2> : null}
      {subtitle ? <p className="edu-card-subtitle">{subtitle}</p> : null}
      {children}
    </article>
  );
}

export function EduButton({ children, variant = "primary", className = "", ...props }) {
  const base = "edu-btn press-scale";
  const v =
    variant === "secondary"
      ? "edu-btn-secondary"
      : variant === "ghost"
        ? "edu-btn-ghost"
        : variant === "outline"
          ? "edu-btn-outline"
          : "edu-btn-primary";
  return (
    <button type="button" className={`${base} ${v} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function EduLinkButton({ to, children, variant = "primary", className = "" }) {
  const base = "edu-btn inline-flex items-center justify-center";
  const v = variant === "outline" ? "edu-btn-outline" : "edu-btn-primary";
  return (
    <Link to={to} className={`${base} ${v} ${className}`}>
      {children}
    </Link>
  );
}
