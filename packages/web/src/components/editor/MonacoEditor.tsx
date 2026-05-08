import { useRef, useCallback, memo } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import { useTheme } from "../../lib/theme";
import { Code2, AlertCircle } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  readOnly?: boolean;
}

export const MonacoEditor = memo(function MonacoEditor({
  value,
  onChange,
  error,
  readOnly = false,
}: Props) {
  const { resolved } = useTheme();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    // Disable minimap for clean look
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 12,
      lineHeight: 20,
      padding: { top: 16, bottom: 16 },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      lineNumbers: "on",
      renderLineHighlight: "none",
      scrollbar: {
        vertical: "auto",
        horizontal: "auto",
        verticalScrollbarSize: 6,
        horizontalScrollbarSize: 6,
      },
      bracketPairColorization: { enabled: true },
      guides: { indentation: true, bracketPairs: true },
      tabSize: 2,
    });
  }, []);

  const handleChange: OnChange = useCallback(
    (val) => {
      if (val !== undefined) onChange(val);
    },
    [onChange]
  );

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) overflow-hidden flex flex-col h-[650px]">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-(--color-border) px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-(--color-accent)" />
          <span className="text-xs font-medium text-(--color-text)">
            MasterPortfolio.json
          </span>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center gap-1.5 rounded-lg bg-(--color-error-subtle) px-2.5 py-1 animate-scale-in">
              <AlertCircle className="h-3 w-3 text-(--color-error)" />
              <span className="text-[10px] font-medium text-(--color-error) max-w-[200px] truncate">
                {error}
              </span>
            </div>
          )}
          {readOnly && (
            <span className="rounded-md bg-(--color-bg-tertiary) px-2 py-0.5 text-[10px] font-medium text-(--color-text-muted)">
              READ ONLY
            </span>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-[400px]">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          onChange={handleChange}
          onMount={handleMount}
          theme={resolved === "dark" ? "vs-dark" : "vs"}
          options={{
            readOnly,
            domReadOnly: readOnly,
          }}
          loading={
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 rounded-lg animate-shimmer bg-(--color-bg-secondary)" />
            </div>
          }
        />
      </div>
    </div>
  );
});
