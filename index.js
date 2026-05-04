const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(3000, () => {
  console.log("Web server is running");
});

require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const { 
  askGPT, askGemini, askClaude, askLlamaPro, askLlamaScout, 
  askDeepSeek, askQwenCoder, askLlama4 
} = require("./aiServices");

// --- IMPORT MEMORY MODULE ---
const { getContext, saveMessage, clearContext } = require("./memory");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Fixed the deprecation warning by using clientReady (Note: internally djs standard is 'ready')
client.once("clientReady", (c) => {
  console.log(`✅ Logged in as ${c.user.tag}! Monitoring commands...`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const msg = message.content.trim();
  const args = msg.split(/\s+/);
  const command = args.shift().toLowerCase();
  const prompt = args.join(" ");

  // --- NEW: CLEAR MEMORY COMMAND ---
  if (command === "!clear") {
    try {
      await clearContext(message.channel.id);
      return message.reply("🧹 Memory cleared for this channel! Starting fresh.");
    } catch (err) {
      console.error("Clear Context Error:", err);
      return message.reply("❌ Failed to clear memory.");
    }
  }

  // Utility to handle responses with Embeds, Typing status, and Memory
  const handleAIRequest = async (aiName, color, fetchFn) => {
    if (!prompt) return message.reply(`Please provide a prompt for ${aiName}!`);

    // UX: Show the bot is thinking
    await message.channel.sendTyping();

    try {
      const channelId = message.channel.id;

      // 1. Get previous messages for this specific channel
      const history = await getContext(channelId);

      // 2. Build the new context array (Old history + New prompt)
      const fullHistory = [...history, { role: "user", content: prompt }];

      // 3. Pass the FULL array to the AI instead of just the text prompt
      const response = await fetchFn(fullHistory);

      // 4. Save the interaction to Firebase RTDB
      await saveMessage(channelId, "user", prompt);
      await saveMessage(channelId, "assistant", response);
      
      const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: aiName })
        .setDescription(response.length > 4096 ? response.substring(0, 4092) + "..." : response)
        .setFooter({ text: `Memory: ${fullHistory.length} messages active` }) // Added context indicator
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(`${aiName} Error:`, err.message);
      await message.reply(`❌ ${aiName} failed to respond. Check terminal.`);
    }
  };

  // Command Logic
  if (command === "!gpt") {
    await handleAIRequest("ChatGPT (GPT-4o-mini)", 0x10A37F, askGPT);
  } 
  
  else if (command === "!gemini") {
    await handleAIRequest("Google Gemini 3", 0x4285F4, askGemini);
  } 
  
  else if (command === "!claude") {
    await handleAIRequest("Anthropic Claude 3", 0xD97757, askClaude);
  }

  // --- Added Llama Models ---
  else if (command === "!lam-pro") {
    await handleAIRequest("Llama 3.3 (70B) - Pro", 0x00FF00, askLlamaPro);
  }

  else if (command === "!lam-fast") {
    await handleAIRequest("Llama 4 Scout - Instant", 0xFFAA00, askLlamaScout);
  }

  // --- TOGETHER AI COMMANDS ---
  else if (command === "!seek") {
    await handleAIRequest("DeepSeek V3 (Reasoning)", 0x6142E0, askDeepSeek);
  }

  else if (command === "!qwen") {
    await handleAIRequest("Qwen 3 Coder (Dev Expert)", 0x5D5DFF, askQwenCoder);
  }

  else if (command === "!lam4") {
    await handleAIRequest("Llama 4 Scout (10M Context)", 0x0668E1, askLlama4);
  }

});

client.login(process.env.DISCORD_TOKEN);