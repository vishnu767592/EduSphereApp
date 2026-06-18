const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class AITutorPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.chatInput = By.id('chat-input');
    this.sendBtn = By.id('chat-send-btn');
    this.messagesContainer = By.id('chat-messages-container');
    this.errorMessage = By.id('chat-error-message');
    this.loadingIndicator = By.id('ai-loading-indicator');
  }

  async askTutor(message) {
    await this.type(this.chatInput, message);
    await this.click(this.sendBtn);
  }

  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  async hasErrorMessage() {
    return await this.isVisible(this.errorMessage);
  }

  async isLoading() {
    return await this.isVisible(this.loadingIndicator);
  }

  async getLatestReplyText() {
    const bubbles = await this.driver.findElements(By.css('.chat-message-bubble'));
    if (bubbles.length === 0) return '';
    const lastBubble = bubbles[bubbles.length - 1];
    return await lastBubble.findElement(By.css('div:nth-child(2)')).getText();
  }
}

module.exports = AITutorPage;
