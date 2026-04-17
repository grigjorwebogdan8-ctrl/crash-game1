import 'dotenv/config';
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const WEBAPP_URL = "https://crash-game1-beryl.vercel.app";

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Нажми кнопку Играть", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Играть 🚀",
            web_app: { url: WEBAPP_URL }
          }
        ]
      ]
    }
  });
});
