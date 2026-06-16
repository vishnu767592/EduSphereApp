const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class SignupPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.nameInput = By.id('signup-name-input');
    this.emailInput = By.id('signup-email-input');
    this.passwordInput = By.id('signup-password-input');
    this.submitBtn = By.id('signup-submit-btn');
    this.errorMsg = By.id('signup-error-message');
    this.signinLink = By.id('signin-link');
  }

  async signup(name, email, password) {
    if (name !== null) await this.type(this.nameInput, name);
    if (email !== null) await this.type(this.emailInput, email);
    if (password !== null) await this.type(this.passwordInput, password);
    await this.click(this.submitBtn);
  }

  async getErrorMessage() {
    return await this.getText(this.errorMsg);
  }

  async hasError() {
    return await this.isVisible(this.errorMsg);
  }

  async navigateToSignin() {
    await this.click(this.signinLink);
  }
}

module.exports = SignupPage;
