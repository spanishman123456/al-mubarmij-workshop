# نموذج أمان skui

يعمل Python داخل Web Worker قابل للإنهاء، وتعرض الواجهة داخل iframe يحمل
`sandbox="allow-scripts"` دون `allow-same-origin`. لا يملك أي منهما وصولًا إلى
DOM المنصة أو Local Storage أو جلسات المستخدم.

الجسر يقبل رسائل بيانات محددة فقط، ويستخدم renderer `textContent` وallowlists
للخصائص والألوان والأحجام وعناوين الأصول. يمنع validator imports النظام
و`eval` و`exec` و`open` وواجهات المتصفح. الحدود الحالية: 500 عنصر، 1000 handler،
20 مؤقتًا، و5000 عملية Canvas.

إعادة التشغيل تنهي worker وتزيل iframe listeners والمؤقتات. تجاوز مهلة التنفيذ
ينهي الجلسة بدل تجميد المنصة.
