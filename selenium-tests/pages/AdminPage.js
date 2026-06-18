const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class AdminPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.unauthorizedTitle = By.id('admin-unauthorized-title');
    this.unauthorizedContainer = By.id('admin-unauthorized-container');
    
    // Admin dashboard elements
    this.adminContainer = By.id('admin-panel-container');
    this.statUsers = By.id('admin-stat-users');
    this.statQuizzes = By.id('admin-stat-quizzes');
    this.usersTable = By.id('admin-users-table');
  }

  async isAccessDenied() {
    return await this.isVisible(this.unauthorizedContainer);
  }

  async getAccessDeniedMessage() {
    return await this.getText(this.unauthorizedTitle);
  }

  async isAdminDashboardLoaded() {
    return (
      await this.isVisible(this.adminContainer) &&
      await this.isVisible(this.statUsers) &&
      await this.isVisible(this.usersTable)
    );
  }

  async getUsersCount() {
    const rows = await this.driver.findElements(By.css('.admin-user-row'));
    return rows.length;
  }
}

module.exports = AdminPage;
