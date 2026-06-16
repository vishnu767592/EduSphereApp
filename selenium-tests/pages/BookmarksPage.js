const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class BookmarksPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.emptyState = By.id('bookmarks-empty-state');
    this.exploreBtn = By.id('go-to-learning-btn');
    this.listContainer = By.id('bookmarks-list');
  }

  async isEmpty() {
    return await this.isVisible(this.emptyState);
  }

  async clickExplore() {
    await this.click(this.exploreBtn);
  }
}

module.exports = BookmarksPage;
