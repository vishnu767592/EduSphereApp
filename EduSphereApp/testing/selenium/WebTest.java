package com.example.edusphere.web;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class WebTest {
    private WebDriver driver;
    @BeforeClass
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        driver = new ChromeDriver(options);
        driver.get("http://localhost:3000");
    }
    @Test
    public void testPageTitle() {
        Assert.assertTrue(driver.getTitle().contains("EduSphere"));
    }
    @AfterClass
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}
