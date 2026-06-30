import { SectionErrorBoundary } from "../SectionErrorBoundary.jsx";

export function LabPanel({ title, hint, children, className = "" }) {
  return (
    <div className={`lab-panel ${className}`}>
      {title ? <h3 className="lab-title">{title}</h3> : null}
      {hint ? <p className="lab-hint mt-1">{hint}</p> : null}
      <div className="mt-4">
        <SectionErrorBoundary sectionName={title}>{children}</SectionErrorBoundary>
      </div>
    </div>
  );
}
