# واجهات API لسياسة ظهور الكود

المصدر: [`server/routes/codeVisibilityRoutes.js`](../server/routes/codeVisibilityRoutes.js).
جميع مسارات التعديل تتطلّب دور معلم عبر جلسة مصادَقة + CSRF (مثل بقية المنصة).

## القراءة

### `GET /api/config/code-visibility`
عام وآمن (لا يحتوي أي حل). يعيد خريطة السياسة:

```json
{
  "ok": true,
  "general": 4,
  "projects": { "app-guess-number": 8 },
  "days": { "day-02": 5 },
  "audit": [ { "at": "...", "teacherId": "...", "scope": "project", "target": "app-guess-number", "before": 4, "after": 8, "action": "update", "reason": null } ],
  "updatedBy": "teacher-...",
  "updatedAt": "...",
  "source": "database"
}
```

## التعديل (معلم فقط)

### `PUT /api/config/code-visibility`
```json
{ "scope": "general|project|day", "target": "<projectId|dayId>", "level": 1-8, "reason": "..." }
```
أخطاء: `invalid_scope` / `missing_target` / `invalid_level` (400).

### `DELETE /api/config/code-visibility`
يعيد نطاقًا إلى الافتراضي.
```json
{ "scope": "project", "target": "app-guess-number" }
```

### `POST /api/config/code-visibility/revert`
يسترجع الحالة السابقة (إلغاء آخر تغيير فعلي).

### `POST /api/config/code-visibility/undo`
يتراجع عن آخر تغيير فعلي (نفس سلوك الاسترجاع في المرحلة الأولى).

### `POST /api/config/code-visibility/preview`
معاينة كطالب — لا تؤثّر على أي تقدّم.
```json
{ "mode": "app|console", "resourceId": "...", "attemptsCompleted": 0, "stepsCompleted": false }
```

## بوابة الطالب

### `GET /api/lab/:resourceId/allowed-content?mode=app|console&attemptsCompleted=N&stepsCompleted=true|false`
تتطلّب مصادقة. الدور من الجلسة. تعيد:

```json
{
  "ok": true,
  "content": {
    "resourceId": "...", "mode": "app", "level": 4, "levelKey": "starter", "scope": "general",
    "titleAr": "...", "taskDescriptionAr": "...|null", "hints": ["..."],
    "starterCode": "...|null", "partialCode": "...|null", "stepsEnabled": false,
    "fullSolutionAvailable": false, "fullSolution": null
  }
}
```

`fullSolution` يكون غير فارغ فقط للطالب عند المستوى 8، أو 7 مع تحقّق الشرط.

## عميل الواجهة

[`src/lib/codeVisibilityClient.js`](../src/lib/codeVisibilityClient.js):
`fetchCodeVisibilityConfig`, `updateCodeVisibility`, `resetCodeVisibility`,
`revertCodeVisibility`, `undoCodeVisibility`, `previewCodeVisibility`, `fetchAllowedContent`.
