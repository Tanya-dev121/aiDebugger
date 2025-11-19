import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/api/debug", async (req, res) => {
  const { code, language } = req.body;

  const prompt = `
You are an AI Code Debugger. Return response in the following structured format:

### 🛑 Error
(List syntax and logic errors)

### 🟢 Corrected Code
\`\`\`cpp
(corrected code)
\`\`\`

### 📘 Explanation
(explain fixes clearly)

### ⚡ Optimization
(give improvement)
User code:
${code}
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct", // FREE + STABLE
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();
    console.log("RAW:", JSON.stringify(data, null, 2));

    const output = data.choices?.[0]?.message?.content;

    if (!output) {
      return res.json({ result: "No usable content from OpenRouter." });
    }

    res.json({ result: output });
  } catch (err) {
    console.error("OpenRouter Error:", err);
    res.status(500).json({ error: "Backend error", details: err.message });
  }
});

app.listen(5000, () => console.log("Backend running on port 5000"));

