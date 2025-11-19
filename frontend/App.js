import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("C++");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDebug = async () => {
    if (!code.trim()) {
      setResult("Please paste some code first.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await axios.post("https://aidebugger-3.onrender.com/api/debug", {
        code,
        language,
      });

      setResult(response.data.result);
    } catch (error) {
      console.error(error);
      setResult(
        "❌ Error connecting to backend. Please ensure backend is running."
      );
    }

    setLoading(false);
  };

  // Function to render AI output in formatted blocks
  const renderFormattedOutput = () => {
    if (!result) {
      return (
        <pre
          style={{
            backgroundColor: "#f4f4f4",
            padding: "20px",
            marginTop: "30px",
            whiteSpace: "pre-wrap",
            borderRadius: "6px",
            border: "1px solid #ddd",
            color: "black", // ← This forces visible text
          }}
        >
          {result || "Output will appear here..."}
        </pre>
      );
    }

    // Split using code block separator ```
    const sections = result.split("```");

    return sections.map((section, index) => {
      if (index % 2 === 1) {
        // Code block
        return (
          <SyntaxHighlighter
            key={index}
            language="javascript"
            style={vscDarkPlus} // ★ new theme (clean, readable, NOT green)
            customStyle={{
              fontSize: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {section}
          </SyntaxHighlighter>
        );
      } else {
        // Normal text block
        return (
          <p
            key={index}
            style={{
              background: "#03053aff",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "10px",
              lineHeight: "1.6",
              fontSize: "16px",
              whiteSpace: "pre-wrap", // ★ FIX → keeps line breaks
            }}
          >
            {section}
          </p>
        );
      }
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "15px" }}>
        AI Code Debugger
      </h1>

      <label style={{ fontSize: "18px", fontWeight: "600" }}>
        Select Language:
      </label>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{
          padding: "10px",
          marginLeft: "10px",
          borderRadius: "5px",
          fontSize: "16px",
        }}
      >
        <option>C++</option>
        <option>C</option>
        <option>JavaScript</option>
        <option>Python</option>
        <option>Java</option>
      </select>

      <textarea
        rows="12"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "10px",
          fontSize: "16px",
          fontFamily: "monospace",
          borderRadius: "5px",
          border: "1px solid grey",
        }}
      />

      <button
        onClick={handleDebug}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "black",
          color: "white",
          fontSize: "18px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Debugging..." : "Debug Code"}
      </button>

      <div style={{ marginTop: "30px" }}>{renderFormattedOutput()}</div>
    </div>
  );
}

export default App;

