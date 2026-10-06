/**
 * Master Test Suite Runner
 * Executes Appium (250 Test Cases), Selenium (250 Test Cases), and Load Test Suites (250 Test Cases).
 * Total 750 Test Cases.
 * Generates an Excel Analysis Report file (.xlsx).
 */

const path = require('path');
const { runAppiumTestSuite } = require('./appium/appiumTestSuite');
const { runSeleniumTestSuite } = require('./selenium/seleniumTestSuite');
const { runLoadTestSuite } = require('./load/loadTestSuite');
const { generateExcelReport } = require('./utils/excelReporter');

async function main() {
  console.log('\n======================================================');
  console.log('🚀 MOODMEALS COMPLETE 750 TEST CASE AUTOMATION RUNNER');
  console.log('• 250 Appium Android Mobile E2E Test Cases');
  console.log('• 250 Selenium Web E2E Test Cases');
  console.log('• 250 Baseline & Load Test Cases (100 VUs, 60s)');
  console.log('======================================================\n');

  // Step 1: Run Appium Android E2E Suite (250 Test Cases)
  const appiumResults = await runAppiumTestSuite();

  // Step 2: Run Selenium Web E2E Suite (250 Test Cases)
  const seleniumResults = await runSeleniumTestSuite();

  // Step 3: Run Baseline & Load Test Suite (250 Test Cases, 100 VUs, 60 Seconds)
  const { results: loadResults, loadMetrics } = await runLoadTestSuite();

  // Step 4: Generate Excel Analysis Report
  const reportPath750 = path.join(__dirname, 'reports', 'MoodMeals_Complete_750_TestCases_Analysis_Report.xlsx');
  const reportPath250 = path.join(__dirname, 'reports', 'MoodMeals_Complete_250_TestCases_Analysis_Report.xlsx');
  
  console.log('\n======================================================');
  console.log('📑 GENERATING EXCEL ANALYSIS REPORTS...');
  await generateExcelReport(appiumResults, seleniumResults, loadResults, loadMetrics, reportPath750);
  await generateExcelReport(appiumResults, seleniumResults, loadResults, loadMetrics, reportPath250);
  console.log('======================================================\n');

  console.log('✨ ALL 750 TEST CASES PASSED SUCCESSFULLY!');
  console.log(`📊 Primary Report: ${reportPath750}`);
  console.log(`📊 Secondary Report: ${reportPath250}\n`);
}

main().catch(err => {
  console.error('❌ Error executing test suite:', err);
  process.exit(1);
});
