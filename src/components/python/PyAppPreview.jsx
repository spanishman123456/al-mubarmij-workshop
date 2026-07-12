import { SkuiPreviewFrame } from "./SkuiPreviewFrame";

export function PyAppPreview({ ui, values, onChange, onButton, onEvent, loading }) {
  return (
    <SkuiPreviewFrame
      ui={ui}
      loading={loading}
      onEvent={(id, eventName, value) => {
        if (eventName === "on_click") {
          onButton?.(id);
          return;
        }
        onChange?.(id, value);
        onEvent?.(id, eventName, value);
      }}
      title="معاينة التطبيق"
    />
  );
}
