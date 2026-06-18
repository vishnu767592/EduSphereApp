const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class PlannerPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.subjectSelect = By.id('planner-subject-select');
    this.hoursInput = By.id('planner-hours-input');
    this.submitBtn = By.id('planner-submit-btn');
    this.errorBanner = By.id('planner-error');
    this.successBanner = By.id('planner-success');
    this.plansList = By.id('planner-list');
  }

  async addGoal(subject, hours) {
    await this.type(this.hoursInput, hours);
    // select option
    const selectEl = await this.find(this.subjectSelect);
    await selectEl.sendKeys(subject);
    await this.click(this.submitBtn);
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

module.exports = PlannerPage;
