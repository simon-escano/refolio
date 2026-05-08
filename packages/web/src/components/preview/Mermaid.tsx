import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "../../lib/theme";
import { Loader2 } from "lucide-react";

export function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolved } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: resolved === "dark" ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "var(--font-mono)",
    });

    const renderChart = async () => {
      if (!containerRef.current || !chart) return;
      try {
        setLoading(true);
        setError(null);
        // Add random ID to prevent conflicts
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        containerRef.current.innerHTML = svg;
      } catch (e) {
        setError("Failed to render diagram");
        console.error("Mermaid error:", e);
      } finally {
        setLoading(false);
      }
    };

    renderChart();
  }, [chart, resolved]);

  return (
    <div className="relative rounded-xl border border-(--color-border) bg-(--color-bg) p-4 flex items-center justify-center overflow-x-auto min-h-[120px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-(--color-bg)/50 backdrop-blur-sm z-10 rounded-xl">
          <Loader2 className="h-5 w-5 animate-spin text-(--color-accent)" />
        </div>
      )}
      {error ? (
        <div className="flex items-center text-[11px] font-medium text-(--color-error)">{error}</div>
      ) : (
        <div ref={containerRef} className="mermaid-container w-full flex justify-center" />
      )}
    </div>
  );
}
