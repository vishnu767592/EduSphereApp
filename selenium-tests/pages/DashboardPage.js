const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.logoutBtn = By.css('button[title="Sign Out"]');
    this.themeToggleBtn = By.css('button[title="Toggle Theme"]');
    
    // Sidebar nav links
    this.sidebarLinks = {
      dashboard: By.css('a[href="/dashboard"]'),
      learning: By.css('a[href="/learning"]'),
      aiTutor: By.css('a[href="/ai-tutor"]'),
      hologram: By.css('a[href="/hologram"]'),
      bookmarks: By.css('a[href="/bookmarks"]'),
      planner: By.css('a[href="/planner"]'),
      progress: By.css('a[href="/progress"]'),
      profile: By.css('a[href="/profile"]'),
      admin: By.css('a[href="/admin"]')
    };

    // Panels/Cards on Dashboard
    this.streakPanel = By.xpath("//span[text()='STREAK']/..");
    this.topicsPanel = By.xpath("//span[text()='TOPICS MASTERED']/..");
    this.quizPanel = By.xpath("//span[text()='QUIZ AVERAGE']/..");
    this.levelPanel = By.xpath("//span[text()='LEARNER LEVEL']/..");
    this.welcomeHeader = By.xpath("//h2[contains(text(), 'Hello')]");
  }

  async logout() {
    await this.click(this.logoutBtn);
  }

  async toggleTheme() {
    await this.click(this.themeToggleBtn);
  }

  async navigateTo(linkName) {
    const locator = this.sidebarLinks[linkName];
    if (!locator) throw new Error(`Unknown sidebar link name: ${linkName}`);
    await this.click(locator);
  }

  async getWelcomeText() {
    return await this.getText(this.welcomeHeader);
  }

  async isDashboardLoaded() {
    return (
      await this.isVisible(this.welcomeHeader) &&
      await this.isVisible(this.streakPanel) &&
      await this.isVisible(this.topicsPanel)
    );
  }
}

module.exports = DashboardPage;
