const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class ProfilePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.nameText = By.id('profile-name');
    this.emailText = By.id('profile-detail-email');
    
    // Password Form
    this.currentPasswordInput = By.id('current-password-input');
    this.newPasswordInput = By.id('new-password-input');
    this.confirmPasswordInput = By.id('confirm-password-input');
    this.submitBtn = By.id('update-password-btn');
    
    // Status Banners
    this.errorBanner = By.id('password-error');
    this.successBanner = By.id('password-success');
  }

  async updatePassword(currentPassword, newPassword, confirmPassword) {
    if (currentPassword !== null) await this.type(this.currentPasswordInput, currentPassword);
    if (newPassword !== null) await this.type(this.newPasswordInput, newPassword);
    if (confirmPassword !== null) await this.type(this.confirmPasswordInput, confirmPassword);
    await this.click(this.submitBtn);
  }

  async getProfileName() {
    return await this.getText(this.nameText);
  }

  async getErrorMessage() {
    return await this.getText(this.errorBanner);
  }

  async getSuccessMessage() {
    return await this.getText(this.successBanner);
  }

  async hasError() {
    return await this.isVisible(this.errorBanner);
  }

  async hasSuccess() {
    return await this.isVisible(this.successBanner);
  }
}

module.exports = ProfilePage;
