# خط بناء التصدير

1. يفحص المتصفح المشروع وينشئ WebApp ZIP مع checksum.
2. ينشئ الخادم job وتوكنات owner/build/download قصيرة العمر.
3. عند ضبط `GITHUB_WORKFLOW_TOKEN`, `GITHUB_REPOSITORY` و
   `EXPORT_PUBLIC_BASE_URL` يرسل الخادم workflow dispatch.
4. ينزّل Windows runner source عبر build token أحادي الغرض.
5. يفك الملفات ويشغّل Tauri build فقط؛ لا ينفذ `main.py`.
6. يوقع EXE/MSI عند توفر الشهادة، ويتحقق من التوقيع، وينشئ checksums.
7. يعيد ZIP المثبتات للخادم ويتيح تنزيلًا مؤقتًا.

أي فشل يسجل حالة `failed` برسالة تعليمية.
