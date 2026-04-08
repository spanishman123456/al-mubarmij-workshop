/**
 * تحويل أخطاء Skulpt إلى ملخص وعربي ونصيحة للطالب
 */

function extractErrorText(err) {
  if (err == null) return "خطأ غير معروف";
  if (typeof err === "string") return err;
  if (typeof err.message === "string" && err.message.length > 0) return err.message;
  if (Array.isArray(err.args) && err.args.length > 0) {
    return err.args
      .map((a) => {
        if (typeof a === "string") return a;
        if (a && typeof a.v === "string") return a.v;
        if (a && typeof a.$jsstr === "function") return a.$jsstr();
        return String(a);
      })
      .join(": ");
  }
  const s = typeof err.toString === "function" ? err.toString() : "";
  if (s && s !== "[object Object]") return s;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function guessLineNumber(text) {
  const patterns = [
    /line\s+(\d+)/i,
    /on\s+line\s+(\d+)/i,
    /السطر[:\s]+(\d+)/,
    /,\s*line\s+(\d+)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

function classifyAndHint(text) {
  const t = text.toLowerCase();

  if (/expected an indented block/i.test(t)) {
    return {
      headlineAr: "يتوقع سطراً بمسافة بعد if أو for أو غيرها",
      hintAr:
        "بعد if/for/while/def يجب أن يأتي سطر جديد بمسافة إضافية (مثلاً 4 مسافات) يحتوي الأوامر، وليس في نفس السطر دون مسافة.",
    };
  }
  if (/syntaxerror|invalid syntax|bad token|unexpected eof/i.test(t)) {
    return {
      headlineAr: "خطأ في بناء الجملة (Syntax)",
      hintAr:
        "تأكد من: النقطتين (:) بعد if و for و while و def، ومن إغلاق الأقواس () والأقواس المربعة []، ومن أن النصوص بين \" أو '. راجع المسافات في بداية السطر داخل الكتل.",
    };
  }
  if (/indentationerror|unexpected indent|unindent/i.test(t)) {
    return {
      headlineAr: "خطأ في المسافات البادئة (Indentation)",
      hintAr:
        "في بايثون يجب أن تكون المسافات متسقة: إما مسافات أو تبويب، وليس الاثنين معاً. كل مستوى داخل if/for يزداد بمسافة واحدة (مثلاً 4) بنفس الطريقة في كل السطور.",
    };
  }
  if (/taberror/i.test(t)) {
    return {
      headlineAr: "خلط بين Tab ومسافات",
      hintAr: "استخدم إما المسافات فقط أو التبويب فقط في نفس الملف، والأفضل المسافات (مثلاً 4) في كل الأسطر.",
    };
  }
  if (/nameerror|not\s+defined|global name/i.test(t)) {
    return {
      headlineAr: "اسم غير معرّف",
      hintAr:
        "متغير أو دالة غير معروفة. تحقق من الإملاء، وتأكد أنك عرّفت المتغير قبل الاستخدام، أو أنك استوردت/كتبت اسم الدالة بشكل صحيح.",
    };
  }
  if (/typeerror|unsupported operand|takes \d+ positional|can't multiply/i.test(t)) {
    return {
      headlineAr: "نوع البيانات لا يناسب العملية",
      hintAr:
        "قد تخلط بين نص (str) ورقم (int/float)، أو تمرّر عدداً خاطئاً لدالة. راجع أنواع القيم (استخدم int() أو str() عند الحاجة).",
    };
  }
  if (/valueerror|invalid literal/i.test(t)) {
    return {
      headlineAr: "قيمة غير صالحة",
      hintAr:
        "القيمة لا تناسب ما تتوقعه الدالة (مثلاً int(\"سلام\")). تأكد من أن النص يمثل رقماً صحيحاً إذا استخدمت int().",
    };
  }
  if (/zerodivisionerror|division.*zero/i.test(t)) {
    return {
      headlineAr: "قسمة على صفر",
      hintAr: "لا يمكن القسمة على صفر. أضف شرطاً (if) للتأكد أن المقسوم عليه ليس صفراً قبل القسمة.",
    };
  }
  if (/indexerror|list index out of range|index out of range/i.test(t)) {
    return {
      headlineAr: "فهرس خارج نطاق القائمة",
      hintAr:
        "الفهرس أكبر أو أصغر من عناصر القائمة. تذكر أن الفهرس يبدأ من 0، وآخر عنصر هو len(القائمة) - 1.",
    };
  }
  if (/keyerror/i.test(t)) {
    return {
      headlineAr: "مفتاح غير موجود في القاموس",
      hintAr: "المفتاح غير موجود. استخدم .get(المفتاح, قيمة_بديلة) أو تحقق بـ if المفتاح in القاموس.",
    };
  }
  if (/attributeerror|has no attribute/i.test(t)) {
    return {
      headlineAr: "الكائن لا يملك هذه الخاصية أو الدالة",
      hintAr:
        "ربما نوع المتغير ليس ما تتوقعه (مثلاً استدعاء .append على نص بدلاً من قائمة). راجع نوع القيمة.",
    };
  }
  if (/importerror|modulenotfound|no module named/i.test(t)) {
    return {
      headlineAr: "استيراد غير متوفر في هذا المختبر",
      hintAr:
        "محرّك Skulpt في المتصفح لا يدعم كل مكتبات بايثون (مثل numpy أو pandas). استخدم ما تعلّمته في الورشة: القوائم، الحلقات، if، والدوال البسيطة.",
    };
  }
  if (/timeouterror|execution limit|run time limit/i.test(t)) {
    return {
      headlineAr: "انتهى وقت التشغيل",
      hintAr: "البرنامج طويل جداً أو حلقة لا نهائية. راجع while/for وتأكد أن الشرط يتوقف يوماً ما.",
    };
  }

  return {
    headlineAr: "حدث خطأ أثناء تشغيل الكود",
    hintAr:
      "اقرأ رسالة الخطأ أعلاه (غالباً بالإنجليزية)، وابحث عن رقم السطر إن وُجد. قارن كودك بأمثلة المعلّم.",
  };
}

/**
 * @param {unknown} err — ما يرجعه Skulpt في catch
 * @returns {{ headlineAr: string, detail: string, line: number | null, hintAr: string }}
 */
export function formatSkulptError(err) {
  const detail = extractErrorText(err).trim();
  const line = guessLineNumber(detail);
  const { headlineAr, hintAr } = classifyAndHint(detail);

  return {
    headlineAr,
    detail,
    line,
    hintAr,
  };
}
