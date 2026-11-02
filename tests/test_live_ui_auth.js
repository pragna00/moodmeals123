const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

async function testRealRegistration() {
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1200,900');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    console.log('1. Loading live UI at http://localhost:8081 ...');
    await driver.get('http://localhost:8081');
    await driver.sleep(3500);

    // Switch to Sign Up tab
    const signUpTab = await driver.findElement(By.xpath("//*[text()='Sign Up']"));
    await signUpTab.click();
    await driver.sleep(1000);

    const inputs = await driver.findElements(By.css('input'));
    console.log(`Found ${inputs.length} input elements`);

    if (inputs.length >= 2) {
      const emailInput = inputs[0];
      const passwordInput = inputs[1];

      // Generate a unique test email so we can verify it in Firebase Console
      const testEmail = `pragna_live_${Date.now()}@gmail.com`;
      console.log(`Testing registration with real Firebase for: ${testEmail}`);

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

      // Click "Create Account in Database"
      const submitBtn = await driver.findElement(By.xpath("//*[contains(text(), 'Create Account in Database')]"));
      await submitBtn.click();

      console.log('Clicked Create Account in Database! Waiting 5s for Firebase backend response...');
      await driver.sleep(5000);

      const sc = await driver.takeScreenshot();
      fs.writeFileSync('tests/registration_result.png', sc, 'base64');
      console.log('Saved tests/registration_result.png');

      const bodyText = await driver.findElement(By.css('body')).getText();
      console.log('\n--- Result Text on Screen ---');
      console.log(bodyText.substring(0, 600));
      console.log('-----------------------------\n');
    }
  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    await driver.quit();
  }
}

testRealRegistration();
