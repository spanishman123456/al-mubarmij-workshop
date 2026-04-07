# ورشة المبرمج — al-mubarmij-workshop

موقع ورشة تعليمية (Vite + React): منهج مقترح، لعبة ثنائية، اختبار سريع، ومختبر Python في المتصفح (Skulpt من CDN).

## التطوير محلياً

```bash
npm install
npm run dev
```

## البناء

```bash
npm run build
```

المخرجات في المجلد `dist/`.

## رفع المشروع إلى GitHub

`gh` غير مثبت على الجهاز؛ أنشئ مستودعاً فارغاً على GitHub (بدون README إن وُجد محلياً)، ثم من مجلد المشروع:

```bash
cd C:\Users\hosam\Projects\al-mubarmij-workshop
git remote add origin https://github.com/YOUR_USERNAME/al-mubarmij-workshop.git
git push -u origin main
```

استبدل `YOUR_USERNAME` واسم المستودع إن اخترت اسماً آخر.

## النشر على Render (موقع ثابت)

1. في [Render Dashboard](https://dashboard.render.com): **New** → **Static Site**.
2. اربط مستودع GitHub واختر الفرع `main`.
3. الإعدادات:
   - **Build Command:** `npm install && npm run build`
   - **Publish directory:** `dist`
4. لصفحات React Router (SPA)، أضف **Redirect/Rewrite**: من `/*` إلى `/index.html` (أو استخدم الملف `render.yaml` أدناه مع **Blueprint**).

بديل: **New** → **Blueprint** واربط المستودع؛ Render يقرأ `render.yaml` من الجذر.

### ملاحظات

- Skulpt يُحمّل من CDN؛ يحتاج اتصالاً بالإنترنت لعمل مختبر Python.
- عند إنشاء مستودع GitHub جديد، لا تضف README من الواجهة إذا كان المشروع محلياً يحتوي على تاريخ كامل؛ أو استخدم `git pull --rebase origin main` بعد الإضافة اليدوية للـ remote.
