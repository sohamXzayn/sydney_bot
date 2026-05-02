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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Fixed the deprecation warning by using clientReady
client.once("clientReady", (c) => {
  console.log(`✅ Logged in as ${c.user.tag}! Monitoring commands...`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const msg = message.content.trim();
  const args = msg.split(/\s+/);
  const command = args.shift().toLowerCase();
  const prompt = args.join(" ");

  // Utility to handle responses with Embeds and Typing status
  const handleAIRequest = async (aiName, color, fetchFn) => {
    if (!prompt) return message.reply(`Please provide a prompt for ${aiName}!`);

    // UX: Show the bot is thinking
    await message.channel.sendTyping();

    try {
      const response = await fetchFn(prompt);
      
      const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: aiName })
        .setDescription(response.length > 4096 ? response.substring(0, 4092) + "..." : response)
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
    // Pass askLlamaPro here
    await handleAIRequest("Llama 3.3 (70B) - Pro", 0x00FF00, askLlamaPro);
  }

  else if (command === "!lam-fast") {
    // Pass askLlamaScout here
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