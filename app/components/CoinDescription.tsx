"use client";

import { useState } from "react";

const MAX_LENGTH = 500;
const HTML_TAG_REGEX = /<[^>]+>/g;

type Props = {
  description: string;
};

export default function CoinDescription({ description }: Props) {
  const [expanded, setExpanded] = useState(false);

  const plain = description.replace(HTML_TAG_REGEX, "").trim();
  if (!plain) return null;

  const isTruncatable = plain.length > MAX_LENGTH;
  const displayText =
    isTruncatable && !expanded ? plain.slice(0, MAX_LENGTH) + "…" : plain;

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <p className="text-sm font-medium text-slate-500 mb-2">About</p>
      <p className="text-sm text-slate-700 leading-relaxed">{displayText}</p>
      {isTruncatable && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
