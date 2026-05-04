const axios = require("axios");

// --- OPENAI ---
const askGPT = async (history) => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: history, // Passing the full array
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_KEY}` } }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("GPT Error:", error.response?.data || error.message);
    throw new Error("OpenAI failed to respond.");
  }
};

// --- GEMINI (Requires special mapping) ---
const askGemini = async (history) => {
  try {
    // Map our standard history format to Gemini's specific format
    const geminiHistory = history.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_KEY}`,
      { contents: geminiHistory }, 
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    throw new Error("Gemini failed to respond.");
  }
};

// --- CLAUDE ---
const askClaude = async (history) => {
  try {
    const res = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: history, // Claude natively supports user/assistant roles
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

// --- GROQ MODELS ---
const askLlamaPro = async (history) => {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: history,
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_KEY}` } }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq Llama Pro Error:", error.response?.data || error.message);
    throw new Error("Groq Pro failed.");
  }
};

const askLlamaScout = async (history) => {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: history,
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_KEY}` } }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq Llama Scout Error:", error.response?.data || error.message);
    throw new Error("Groq Scout failed.");
  }
};

// --- TOGETHER AI MODELS ---
const askDeepSeek = async (history) => {
  try {
    const res = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-V3",
        messages: history,
      },
      { headers: { Authorization: `Bearer ${process.env.TOGETHER_AI_KEY}` } }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("DeepSeek Error:", error.message);
    throw new Error("DeepSeek via Together failed.");
  }
};

const askQwenCoder = async (history) => {
  try {
    const res = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "qwen/Qwen3-Coder-480B",
        messages: history,
      },
      { headers: { Authorization: `Bearer ${process.env.TOGETHER_AI_KEY}` } }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("Qwen Coder Error:", error.message);
    throw new Error("Qwen Coder failed.");
  }
};

const askLlama4 = async (history) => {
  try {
    const res = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "meta-llama/Llama-4-Scout-17B",
        messages: history,
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