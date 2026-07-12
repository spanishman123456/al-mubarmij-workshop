# جدول دعم skui

جميع المكونات المعلنة في `src/lib/skui/manifest.js` مسجلة في Custom Module،
وتُختبر مع Skulpt المثبت محليًا.

- التخطيط: App, Page, Container, Row, Column, Grid, Card
- النص والنماذج: Text, Heading, Button, Input, TextArea, Checkbox, Radio,
  Select, Slider
- العرض: Progress, Alert, Badge, Image, List, Table
- التفاعل: Tabs, Accordion, Modal
- الوسائط: Canvas, Chart, Timer, Audio

WebApp وPWA وWindows تستخدم runtime نفسه. الوصول إلى نظام الملفات أو Shell أو
أوامر النظام غير مدعوم في أي هدف. التخزين دون اتصال متاح في PWA وداخل تطبيق
Windows، ولا يمنح وصولًا إلى بيانات المنصة.
