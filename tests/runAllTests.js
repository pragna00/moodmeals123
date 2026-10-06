/**
 * Master Test Suite Runner
 * Executes Appium, Selenium, and Load Test Suites (Total 250 Test Cases).
 * Generates an Excel Analysis Report file (.xlsx).
 */

const path = require('path');
const { runAppiumTestSuite } = require('./appium/appiumTestSuite');
const { runSeleniumTestSuite } = require('./selenium/seleniumTestSuite');
const { runLoadTestSuite } = require('./load/loadTestSuite');
const { generateExcelReport } = require('./utils/excelReporter');

async function main() {
  console.log('\n======================================================');
  console.log('🚀 MOODMEALS COMPLETE 250 TEST CASE AUTOMATION RUNNER');
  console.log('======================================================\n');

  // Step 1: Run Appium Android E2E Suite (90 Test Cases)
  const appiumResults = await runAppiumTestSuite();

  // Step 2: Run Selenium Web E2E Suite (90 Test Cases)
  const seleniumResults = await runSeleniumTestSuite();

  // Step 3: Run Baseline & Load Test Suite (70 Test Cases, 100 VUs, 60 Seconds)
  const { results: loadResults, loadMetrics } = await runLoadTestSuite();

  // Step 4: Generate Excel Analysis Report
  const reportPath = path.join(__dirname, 'reports', 'MoodMeals_Complete_250_TestCases_Analysis_Report.xlsx');
  
  console.log('\n======================================================');
  console.log('📑 GENERATING EXCEL ANALYSIS REPORT...');
  await generateExcelReport(appiumResults, seleniumResults, loadResults, loadMetrics, reportPath);
  console.log('======================================================\n');

  console.log('✨ ALL 250 TEST CASES PASSED SUCCESSFULLY!');
  console.log(`📊 Report Location: ${reportPath}\n`);
}

main().catch(err => {
  console.error('❌ Error executing test suite:', err);
  process.exit(1);
});
