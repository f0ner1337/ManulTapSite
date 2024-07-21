from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackContext
import logging

API_TOKEN = '7278479434:AAFbrZENnTWvRzDK1zb-Wm3MqDU8mkv72kk'
WEB_APP_URL = 'https://f0ner1337.github.io/ManulClickerTap/'  # Замените на ваш URL

# Настройка логирования
logging.basicConfig(level=logging.INFO)

async def start(update: Update, context: CallbackContext):
    keyboard = [
        [InlineKeyboardButton("🖱️Перейти в кликер манула🐱", web_app=WebAppInfo(url=WEB_APP_URL))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Привет🐾🐈! Нажми снизу на кнопку, чтобы перейти в кликер манула💻", reply_markup=reply_markup)

def main():
    # Создание приложения и добавление обработчиков
    application = Application.builder().token(API_TOKEN).build()

    # Обработчик команды /start
    application.add_handler(CommandHandler('start', start))

    # Запуск бота
    application.run_polling()

if __name__ == '__main__':
    main()

#https://f0ner1337.github.io/manul4ikclicker/
#7412751781:AAGIUoQVVrh2o94YC6Hjl-6QlhRQD9nG5wI