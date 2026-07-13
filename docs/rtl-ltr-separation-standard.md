# معيار فصل RTL/LTR للمحتوى التقني

## القاعدة

- يبقى غلاف الصفحة والنص العربي `dir="rtl"`.
- تُعزل القيم التقنية باتجاه صريح `dir="ltr"` مع `direction: ltr` و`text-align: left` و`unicode-bidi: isolate`.
- لا يُستخدم `dir="auto"` للإجابات أو القيم الحساسة؛ لأن أول حرف ليس معيارًا موثوقًا لتعبير مختلط.
- الجداول التقنية مرتبة بصريًا من اليسار إلى اليمين، بينما يبقى الوصف العربي خارج الجدول.

## واجهات العرض المركزية

- `TechnicalValue`: قيمة inline أو block، بخط monospace وأرقام tabular.
- `BinaryValue`: قيمة ثنائية مع عزل ومسافات حروف ثابتة.
- `LogicExpressionBlock`: تعبير منطقي block.
- `TechnicalTable`: جدول LTR وخلايا LTR.
- `BilingualPrompt`: يفصل `promptAr` عن `expression` و`values` و`cell` و`code`.
- `renderMixedDirectionText`: للنثر العربي الذي يتضمن رموزًا تقنية قصيرة.

## البيانات

يفضّل تخزين السؤال بهذا الشكل:

```js
{
  promptAr: "بسّط الدالة المنطقية.",
  expression: "A AND B",
  values: [{ name: "A", value: "1" }],
  cell: "11"
}
```

لا تُدمج العربية والتعبير أو الإحداثيات في سلسلة واحدة عندما يمكن فصلها. تبقى أسماء متغيرات العرض المنطقي `A, B, C, D, E`، وترتيب Gray هو `00, 01, 11, 10`.

## التصدير والمعاينة

تُطبّع قيم `lang` إلى `ar|en` و`direction` إلى `rtl|ltr`. يجب أن تتطابق القيم في:

- صفحة WebApp وiframe المعاينة.
- `preview.html` و`offline.html`.
- `manifest.webmanifest`.
- `project.json`.

القيمة الافتراضية الحالية عربية RTL. لا يغيّر هذا المعيار سياسة نشر PWA أو صلاحيات المستخدمين.
