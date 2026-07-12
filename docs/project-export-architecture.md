# معمارية تصدير المشاريع

`main.py → Skulpt Worker → skui bridge → sandbox renderer` هو المسار نفسه في
المعاينة وWebApp وPWA وTauri.

ينشئ المتصفح Source ZIP وWebApp ZIP وPWA محليًا، مع runtime مثبت وملفات نسبية
و`project.json` و`build-info.json` وSHA-256. Windows ينشئ export job؛ ينزّل
Windows runner الحزمة كبيانات دون تنفيذ Python، ثم يضمّنها في Tauri 2 ويعيد
artifact مؤقتًا إلى الخادم.

لا يحوّل أي مسار كود Skulpt إلى CPython.
