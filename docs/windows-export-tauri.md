# تصدير Windows باستخدام Tauri 2

يضمّن Tauri WebApp الناتج دون Python أو CPython. الأهداف الرسمية NSIS EXE وWiX
MSI. capability الافتراضية فارغة ولا توجد plugins للـShell أو filesystem أو
registry أو network.

يبني workflow على `windows-latest`. إذا توفرت
`WINDOWS_CERTIFICATE_BASE64` و`WINDOWS_CERTIFICATE_PASSWORD` يوقع المثبتات
Authenticode ويتحقق منها بـsigntool و`Get-AuthenticodeSignature`. النسخة غير
الموقعة تعليمية ويجب وصفها كذلك.
