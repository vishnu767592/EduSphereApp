const { By, until } = require('selenium-webdriver');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async visit(url) {
    await this.driver.get(url);
  }

  async find(locator, timeout = 5000) {
    const by = typeof locator === 'string' ? By.css(locator) : locator;
    await this.driver.wait(until.elementLocated(by), timeout);
    return this.driver.findElement(by);
  }

  async click(locator, timeout = 5000) {
    const element = await this.find(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    await element.click();
  }

  async type(locator, text, timeout = 5000) {
    const element = await this.find(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    await element.clear();
    await element.sendKeys(text);
  }

  async getText(locator, timeout = 5000) {
    const element = await this.find(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return await element.getText();
  }

  async isVisible(locator, timeout = 3000) {
    try {
      const by = typeof locator === 'string' ? By.css(locator) : locator;
      const element = await this.driver.wait(until.elementLocated(by), timeout);
      return await element.isDisplayed();
    } catch (e) {
      return false;
    }
  }

  async getLocalStorage(key) {
    return await this.driver.executeScript((k) => localStorage.getItem(k), key);
  }

  async setLocalStorage(key, value) {
    await this.driver.executeScript((k, v) => localStorage.setItem(k, v), key, value);
  }

  async clearLocalStorage() {
    await this.driver.executeScript(() => localStorage.clear());
  }

  async getConsoleLogs() {
    try {
      const logs = await this.driver.manage().logs().get('browser');
      return logs.map(log => log.message);
    } catch (e) {
      return [];
    }
  }
}

module.exports = BasePage;
