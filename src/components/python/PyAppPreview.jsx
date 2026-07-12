import { SkuiPreviewFrame } from "./SkuiPreviewFrame";

export function PyAppPreview({ ui, onChange, onButton, onEvent, loading }) {
  return (
    <SkuiPreviewFrame
      ui={ui}
      loading={loading}
      onEvent={(id, eventName, value, allValues) => {
        if (eventName === "on_click") {
          onButton?.(id, allValues);
          return;
        }
        onChange?.(id, value);
        onEvent?.(id, eventName, value, allValues);
      }}
      title="معاينة التطبيق"
    />
  );
}
