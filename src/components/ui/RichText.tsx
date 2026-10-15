/**
 * Very small markdown-ish renderer for guide/news bodies.
 * Supports: "## heading", "- bullet", "1. numbered", **bold**, blank-line paragraphs.
 * Deliberately dependency-free and safe (renders text nodes only, no HTML).
 */
import { Fragment, type ReactNode } from "react";

function inline(text: string, key: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Fragment key={key}>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-text">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </Fragment>
  );
}

export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const lines = text.split(/\r?\n/);
  const out: ReactNode[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      out.push(
        <p key={`p${out.length}`} className="text-[15px] leading-relaxed text-muted">
          {inline(para.join(" "), `pi${out.length}`)}
        </p>,
      );
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      const Tag = list.type;
      out.push(
        <Tag key={`l${out.length}`} className={`${list.type === "ul" ? "list-disc" : "list-decimal"} space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted marker:text-neon-purple`}>
          {list.items.map((it, i) => (
            <li key={i}>{inline(it, `li${i}`)}</li>
          ))}
        </Tag>,
      );
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    const ul = line.match(/^[-*]\s+(.*)$/);
    const ol = line.match(/^\d+[.)]\s+(.*)$/);
    if (h) {
      flushPara();
      flushList();
      out.push(
        <h3 key={`h${out.length}`} className="pt-2 text-base font-bold text-text">
          {inline(h[2], `hi${out.length}`)}
        </h3>,
      );
    } else if (ul) {
      flushPara();
      if (!list || list.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(ul[1]);
    } else if (ol) {
      flushPara();
      if (!list || list.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(ol[1]);
    } else if (!line.trim()) {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();
  return <div className={`space-y-3 ${className}`}>{out}</div>;
}
