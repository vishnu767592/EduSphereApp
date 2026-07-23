import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

public class AppiumTest {
    private AndroidDriver driver;
    @BeforeClass
    public void setUp() throws MalformedURLException {
        UiAutomator2Options options = new UiAutomator2Options()
                .setDeviceName("Android Emulator")
                .setApp("app/build/outputs/apk/debug/app-debug.apk")
                .setAutomationName("UiAutomator2")
                .setAppPackage("com.example.edusphereapp")
                .setAppActivity(".SplashActivity");
        driver = new AndroidDriver(new URL("http://127.0.0.1:4723"), options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }
    @Test(priority = 1)
    public void testLogin() {
        driver.findElement(By.id("com.example.edusphereapp:id/emailEt")).sendKeys("admin");
        driver.findElement(By.id("com.example.edusphereapp:id/passwordEt")).sendKeys("1234");
        driver.findElement(By.id("com.example.edusphereapp:id/loginBtn")).click();
        Assert.assertTrue(driver.findElement(By.id("com.example.edusphereapp:id/toolbar")).isDisplayed());
    }
    @AfterClass
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}
