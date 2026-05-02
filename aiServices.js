const axios = require("axios");

// --- YOUR PREVIOUS FUNCTIONS (UNCHANGED) ---

const askGPT = async (prompt) => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_KEY}` } }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("GPT Error:", error.response?.data || error.message);
    throw new Error("OpenAI failed to respond.");
  }
};

const askGemini = async (prompt) => {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    throw new Error("Gemini failed to respond.");
  }
};

const askClaude = async (prompt) => {
  try {
    const res = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "x-api-key": process.env.CLAUDE_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      }
    );
    return res.data.content[0].text;
  } catch (error) {
    console.error("Claude Error:", error.response?.data || error.message);
    throw new Error("Claude failed to respond.");
  }
};

// --- NEW GROQ FUNCTIONS (2026 STANDARDS) ---

/**
 * Groq - Llama 3.3 (70B)
 * Top-tier reasoning and logic.
 */
const askLlamaPro = async (prompt) => {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_KEY}` } }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq Llama Pro Error:", error.response?.data || error.message);
    throw new Error("Groq Pro failed.");
  }
};

/**
 * Groq - Llama 4 Scout
 * The 2026 speed demon (~750 tokens/sec).
 */
const askLlamaScout = async (prompt) => {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_KEY}` } }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq Llama Scout Error:", error.response?.data || error.message);
    throw new Error("Groq Scout failed.");
  }
};

// --- NEW TOGETHER AI FUNCTIONS (2026 STANDARDS) ---

/**
 * Together AI - DeepSeek V3
 * Elite reasoning/logic for complex architecture.
 */
const askDeepSeek = async (prompt) => {
  try {
    const res = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-V3",
        messages: [{ role: "user", content: prompt }],
      },
      { headers: { Authorization: `Bearer ${process.env.TOGETHER_AI_KEY}` } }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("DeepSeek Error:", error.message);
    throw new Error("DeepSeek via Together failed.");
  }
};

/**
 * Together AI - Qwen 3 Coder (480B)
 * The top 1% choice for React and Firebase help.
 */
const askQwenCoder = async (prompt) => {
  try {
    const res = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "qwen/Qwen3-Coder-480B",
        messages: [{ role: "user", content: prompt }],
      },
      { headers: { Authorization: `Bearer ${process.env.TOGETHER_AI_KEY}` } }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("Qwen Coder Error:", error.message);
    throw new Error("Qwen Coder failed.");
  }
};

/**
 * Together AI - Llama 4 Scout
 * 10M context window for massive project analysis.
 */
const askLlama4 = async (prompt) => {
  try {
    const res = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "meta-llama/Llama-4-Scout-17B",
        messages: [{ role: "user", content: prompt }],
      },
      { headers: { Authorization: `Bearer ${process.env.TOGETHER_AI_KEY}` } }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("Llama 4 Error:", error.message);
    throw new Error("Llama 4 failed.");
  }
};

module.exports = { 
  askGPT, askGemini, askClaude, askLlamaPro, askLlamaScout, 
  askDeepSeek, askQwenCoder, askLlama4 
};