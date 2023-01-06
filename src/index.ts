import {Bot, InputFile} from "grammy";
import config from "./config";
import consola from "consola";
import {execSync} from "child_process";

// Wrap all console out to consola
consola.wrapAll();

// Create new bot instance
export const bot = new Bot(config.BOT_TOKEN);

bot.command("start", (ctx) => {
  return ctx.reply(`
    Hi ${ctx.from?.first_name}!
    
    This is Text-to-Speech bot made by @congritta.
    
    Just send any text message and bot sends you voice message from your text.
    
    This is pet project. Source code is available at: https://github.com/congritta/tts-bot
  `.replace(/^ +/gm, ""));
});

bot.on("message:text", (ctx) => {

  const audio = execSync(`espeak-ng -v ru "${ctx.message.text.replaceAll("\"", "\\\"")}" --stdout`);

  return ctx.replyWithVoice(new InputFile(audio));
});

// Handle bot errors
bot.catch((error) => {
  const $error = error.error;

  consola.error($error);

  error.ctx.reply(`
    ❌ <b>An error occured during processing your message</b>:

    <code>${error.message}</code>

    Send this message to bot maintainers to solve this problem
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML"
  });
});

// Init a bot
Promise.resolve()
  .then(() => bot.start({
    drop_pending_updates: true,
    onStart() {
      consola.ready("Bot launched");
    }
  }));
