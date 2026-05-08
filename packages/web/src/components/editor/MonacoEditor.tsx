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
      fontFamily: "JetBrains Mono, ui-monospace, monospace",
    });
  }, []);

  const handleChange: OnChange = useCallback(
    (val) => {
      if (val !== undefined) onChange(val);
    },
    [onChange]
  );

  return (
    <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] overflow-hidden flex flex-col h-[650px]">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] px-4 py-2.5 bg-[var(--color-surface-container)]">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-[var(--color-primary)]" />
          <span className="font-mono text-xs font-bold tracking-[0.05em] text-[var(--color-on-surface)]">
            MasterPortfolio.json
          </span>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-error-container)] px-2.5 py-1 animate-scale-in">
              <AlertCircle className="h-3 w-3 text-[var(--color-error)]" />
              <span className="text-[10px] font-medium text-[var(--color-on-error-container)] max-w-[200px] truncate">
                {error}
              </span>
            </div>
          )}
          {readOnly && (
            <span className="rounded-md bg-[var(--color-surface-variant)] px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase text-[var(--color-outline)]">
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
              <div className="h-8 w-8 rounded-lg animate-shimmer bg-[var(--color-surface-container)]" />
            </div>
          }
        />
      </div>
    </div>
  );
});
