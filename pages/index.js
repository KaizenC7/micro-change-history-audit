"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [versions, setVersions] = useState([]);

  // Load versions
  const loadVersions = async () => {
    const res = await fetch("/api/versions");
    const data = await res.json();
    setVersions(data);
  };

  useEffect(() => {
    loadVersions();
  }, []);

  const saveVersion = async () => {
    await fetch("/api/save-version", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText })
    });

    loadVersions();
  };

  const restoreVersion = async (id) => {
    const res = await fetch("/api/restore-version", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    const restored = await res.json();
    setText(restored.fullText);
    loadVersions();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h2>Content Editor</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", height: "150px" }}
      />

      <button onClick={saveVersion} style={{ marginTop: "10px" }}>
        Save Version
      </button>

      <h3 style={{ marginTop: "30px" }}>Version History</h3>

      {versions.map((v) => (
        <div
          key={v.id}
          style={{
            padding: "10px",
            background: "#f7f7f7",
            marginBottom: "10px",
            borderRadius: "6px"
          }}
        >
          <pre>
{`id: "${v.id}",
timestamp: "${v.timestamp}",
addedWords: ${JSON.stringify(v.addedWords)},
removedWords: ${JSON.stringify(v.removedWords)},
oldLength: ${v.oldLength},
newLength: ${v.newLength}`}
          </pre>

          <button onClick={() => restoreVersion(v.id)}>
            Restore this version
          </button>
        </div>
      ))}
    </div>
  );
}
