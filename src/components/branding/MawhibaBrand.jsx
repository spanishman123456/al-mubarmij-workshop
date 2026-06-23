import { Link } from "react-router-dom";

export function MawhibaBrand({ variant = "horizontal", className = "" }) {
  const isVertical = variant === "vertical";
  const isBanner = variant === "banner";

  if (isBanner) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src="/images/mawhiba/mawhiba-banner.png"
          alt="مؤسسة الملك عبدالعزيز ورجاله للموهبة والإبداع"
          className="max-h-20 w-auto object-contain sm:max-h-24"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-4 ${isVertical ? "flex-col text-center" : "flex-row"} ${className}`}
    >
      <img
        src="/images/mawhiba/mawhiba-logo.png"
        alt="موهبة Mawhiba"
        className={`object-contain ${isVertical ? "h-24 w-auto" : "h-14 w-auto sm:h-16"}`}
      />
      {!isVertical ? (
        <div className="hidden sm:block">
          <p className="text-xs font-medium text-violet-200">مؤسسة الملك عبدالعزيز ورجاله</p>
          <p className="text-xs text-violet-300/80">للموهبة والإبداع</p>
        </div>
      ) : null}
    </div>
  );
}

export function SiteTitle({ subtitle, light = false, className = "" }) {
  return (
    <div className={`text-center ${className}`}>
      <h1 className={`text-2xl font-extrabold sm:text-3xl ${light ? "text-white" : "text-slate-900"}`}>
        برمجة الحاسب
      </h1>
      {subtitle ? (
        <p className={`mt-2 text-sm sm:text-base ${light ? "text-violet-100" : "text-slate-600"}`}>{subtitle}</p>
      ) : null}
    </div>
  );
}

export function MawhibaHeaderStrip({ className = "" }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <Link to="/" className="flex items-center gap-3">
        <img src="/images/mawhiba/mawhiba-logo.png" alt="موهبة" className="h-10 w-auto object-contain" />
        <div>
          <p className="font-ar text-base font-bold text-white">برمجة الحاسب</p>
          <p className="text-xs text-violet-200">منصة موهبة — صفوف 6-8</p>
        </div>
      </Link>
    </div>
  );
}
