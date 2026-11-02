const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

async function testRealLogin() {
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1200,900');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    console.log('1. Loading live UI at http://localhost:8081 ...');
    await driver.get('http://localhost:8081');
    await driver.sleep(3000);

    // Clear session so we get login screen
    await driver.executeScript(`
      window.localStorage.clear();
      window.sessionStorage.clear();
    `);
    await driver.get('http://localhost:8081');
    await driver.sleep(2500);

    // Ensure we are on Log In tab
    const logInTab = await driver.findElement(By.xpath("//*[text()='Log In']"));
    await logInTab.click();
    await driver.sleep(500);

    const inputs = await driver.findElements(By.css('input'));
    console.log(`Found ${inputs.length} input elements`);

    if (inputs.length >= 2) {
      const emailInput = inputs[0];
      const passwordInput = inputs[1];

      const testEmail = 'pragna_live_1793617729084@gmail.com';
      console.log(`Testing Login with real Firebase credentials for: ${testEmail}`);

      await driver.executeScript(`
        const emailEl = arguments[0];
        const passEl = arguments[1];
        
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(emailEl, '${testEmail}');
        emailEl.dispatchEvent(new Event('input', { bubbles: true }));

        nativeInputValueSetter.call(passEl, 'MoodMealsPass123!');
        passEl.dispatchEvent(new Event('input', { bubbles: true }));
      `, emailInput, passwordInput);

      await driver.sleep(1000);

      // Click "Log In to Database"
      const submitBtn = await driver.findElement(By.xpath("//*[contains(text(), 'Log In to Database')]"));
      await submitBtn.click();

      console.log('Clicked Log In to Database! Waiting 5s for Firebase backend response...');
      await driver.sleep(5000);

      const sc = await driver.takeScreenshot();
      fs.writeFileSync('tests/login_success_result.png', sc, 'base64');
      console.log('Saved tests/login_success_result.png');

      const bodyText = await driver.findElement(By.css('body')).getText();
      console.log('\n--- Login Result Text on Screen ---');
      console.log(bodyText.substring(0, 400));
      console.log('------------------------------------\n');
    }
  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    await driver.quit();
  }
}

testRealLogin();
