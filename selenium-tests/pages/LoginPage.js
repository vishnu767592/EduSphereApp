const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.emailInput = By.id('login-email-input');
    this.passwordInput = By.id('login-password-input');
    this.submitBtn = By.id('login-submit-btn');
    this.errorMsg = By.id('login-error-message');
    this.signupLink = By.id('signup-link');
  }

  async login(email, password) {
    if (email !== null) {
      await this.type(this.emailInput, email);
    } else {
      const el = await this.find(this.emailInput);
      await el.clear();
    }

    if (password !== null) {
      await this.type(this.passwordInput, password);
    } else {
      const el = await this.find(this.passwordInput);
      await el.clear();
    }

    await this.click(this.submitBtn);
  }

  async getErrorMessage() {
    return await this.getText(this.errorMsg);
  }

  async hasError() {
    return await this.isVisible(this.errorMsg);
  }

  async navigateToSignup() {
    await this.click(this.signupLink);
  }
}

module.exports = LoginPage;
