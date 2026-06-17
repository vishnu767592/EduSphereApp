const { By, until } = require('selenium-webdriver');
const config = require('../config');

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.waitTimeout = config.timeouts.default;
  }

  async visit(url, waitTime = config.timeouts.pageLoad) {
    console.log(`Navigating to: ${url}`);
    await this.driver.get(url);
    await this.driver.sleep(1000); // Allow page to settle
  }

  async find(locator, timeout = config.timeouts.elementWait) {
    const by = typeof locator === 'string' ? By.css(locator) : locator;
    await this.driver.wait(until.elementLocated(by), timeout);
    return this.driver.findElement(by);
  }

  async click(locator, timeout = config.timeouts.elementVisible) {
    const element = await this.find(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    await this.driver.sleep(300); // Small delay before click
    await element.click();
  }

  async type(locator, text, timeout = config.timeouts.elementVisible) {
    const element = await this.find(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    await element.clear();
    await this.driver.sleep(200); // Small delay after clear
    await element.sendKeys(text);
  }

  async getText(locator, timeout = config.timeouts.elementVisible) {
    const element = await this.find(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return await element.getText();
  }

  async isVisible(locator, timeout = config.timeouts.default) {
    try {
      const by = typeof locator === 'string' ? By.css(locator) : locator;
      const element = await this.driver.wait(until.elementLocated(by), timeout);
      return await element.isDisplayed();
    } catch (e) {
      console.log(`Element not visible: ${locator}`);
      return false;
    }
  }

  async waitForElement(locator, timeout = config.timeouts.elementWait) {
    const by = typeof locator === 'string' ? By.css(locator) : locator;
    await this.driver.wait(until.elementLocated(by), timeout);
  }

  async waitForElementVisible(locator, timeout = config.timeouts.elementVisible) {
    const by = typeof locator === 'string' ? By.css(locator) : locator;
    const element = await this.driver.wait(until.elementLocated(by), timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
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
      console.log('Could not retrieve console logs');
      return [];
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = BasePage;
