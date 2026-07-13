# مرجع مكتبة skui

الاستيراد الرسمي:

```python
import skui as ui
```

المكونات المدعومة في 1.0.0:
`App`, `Page`, `Container`, `Row`, `Column`, `Grid`, `Card`, `Text`, `Heading`,
`Button`, `Input`, `TextArea`, `Checkbox`, `Radio`, `Select`, `Slider`,
`Progress`, `Alert`, `Badge`, `Image`, `List`, `Table`, `Tabs`, `Accordion`,
`Modal`, `Canvas`, `Chart`, `Timer`, `Audio`.

الأحداث: `on_click`, `on_change`, `on_input`, `on_submit`, `on_select`,
`on_key_press`, `on_focus`, `on_blur`.

دوال الحالة المشتركة: `add`, `value`, `set_value`, `set_text`,
`set_disabled`, `set_open`, `set_items`, `set_data`, `dispose`.

`Button` و`Heading` يتطلبان `text`. لا يقبل runtime HTML أو JavaScript أو CSS
خامًا. راجع `src/lib/skui/manifest.js`؛ فهو المصدر الوحيد لقائمة API.
