const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

const testResults = [
  {
    id: 'TC-AUTH-01',
    name: 'Login with Valid Credentials',
    preconditions: 'Frontend and backend systems running; student account seeded.',
    steps: '1. Navigate to landing page\n2. Click Sign In to go to Login page\n3. Enter valid student email and password\n4. Click Sign In button',
    expected: 'Redirected to /dashboard; user session token present in localStorage.',
    actual: 'Dashboard loaded; token "edusphere_token" found in localStorage.',
    status: 'PASS',
    severity: 'N/A'
  },
  {
    id: 'TC-AUTH-02',
    name: 'Login with Invalid Credentials',
    preconditions: 'User is on Login page.',
    steps: '1. Enter incorrect email/password combination\n2. Click Sign In button',
    expected: 'Displays error alert: "Invalid email or password" or equivalent.',
    actual: 'Error popup shown displaying: "Invalid email or password"',
    status: 'PASS',
    severity: 'Medium'
  },
  {
    id: 'TC-AUTH-03',
    name: 'Empty Username / Email Validation',
    preconditions: 'User is on Login page.',
    steps: '1. Leave email input empty\n2. Enter password\n3. Click Sign In',
    expected: 'Validation error displayed: "Please fill in all fields".',
    actual: 'Required validation triggered: "Please fill in all fields"',
    status: 'PASS',
    severity: 'Low'
  },
  {
    id: 'TC-AUTH-04',
    name: 'Empty Password Validation',
    preconditions: 'User is on Login page.',
    steps: '1. Enter email address\n2. Leave password input empty\n3. Click Sign In',
    expected: 'Validation error displayed: "Please fill in all fields".',
    actual: 'Required validation triggered: "Please fill in all fields"',
    status: 'PASS',
    severity: 'Low'
  },
  {
    id: 'TC-AUTH-05',
    name: 'Session Persistence after Page Refresh',
    preconditions: 'User is logged in and on Dashboard.',
    steps: '1. Verify active token in storage\n2. Trigger browser page refresh\n3. Wait for reload and verify session remains active',
    expected: 'User remains logged in and Dashboard loads automatically without redirecting to login page.',
    actual: 'Session remained active. Dashboard welcome displayed post-refresh.',
    status: 'PASS',
    severity: 'High'
  },
  {
    id: 'TC-AUTH-06',
    name: 'Logout Functionality',
    preconditions: 'User is logged in.',
    steps: '1. Click Sign Out/Logout button in the header/navbar',
    expected: 'Redirected to login page; token deleted from localStorage.',
    actual: 'Successfully logged out, token cleared, redirected to login page.',
    status: 'PASS',
    severity: 'High'
  },
  {
    id: 'TC-AUTH-07',
    name: 'Unauthorized Access after Logout',
    preconditions: 'User has logged out.',
    steps: '1. Attempt to access /dashboard directly via browser URL bar',
    expected: 'Redirected back to /login (protected route guard).',
    actual: 'Redirected to /login. Protected route intercept functioning.',
    status: 'PASS',
    severity: 'High'
  },
  {
    id: 'TC-NAV-01',
    name: 'Verify Dashboard Navigation links',
    preconditions: 'User is logged in.',
    steps: '1. Tap Sidebar navigation links for Profile, Bookmarks, and Planner\n2. Verify page container changes and path matches',
    expected: 'Page changes cleanly; browser URL updates to match paths /profile, /bookmarks, /planner.',
    actual: 'All sidebar navigation URLs transition matching defined endpoints.',
    status: 'PASS',
    severity: 'Medium'
  },
  {
    id: 'TC-NAV-02',
    name: 'Verify Browser Back/Forward Navigation',
    preconditions: 'User is logged in.',
    steps: '1. Navigate from Dashboard to Profile page\n2. Trigger browser back action\n3. Trigger browser forward action',
    expected: 'Successfully navigates back to Dashboard and forward to Profile without breaking login session state.',
    actual: 'Back/Forward browser stack transitions seamlessly preserving authentication.',
    status: 'PASS',
    severity: 'Medium'
  },
  {
    id: 'TC-VAL-01',
    name: 'Form Boundary Value Testing - Goal Planner Hours',
    preconditions: 'User is on Study Planner page.',
    steps: '1. Enter numeric hours below boundary (0) and click Create\n2. Enter numeric hours above boundary (41) and click Create\n3. Enter valid boundary values (1 and 40) and verify registration',
    expected: 'Fails for 0 and 41 displaying range errors; successfully registers for 1 and 40.',
    actual: 'Goal inputs bounded to range [1, 40] validated and rejected outside values.',
    status: 'PASS',
    severity: 'Medium'
  },
  {
    id: 'TC-VAL-02',
    name: 'Duplicate Submission Prevention',
    preconditions: 'User is on Change Password page.',
    steps: '1. Fill in fields\n2. Click Change Password button\n3. Verify button immediately gains "disabled" attribute to prevent race condition clicks',
    expected: 'Submit button disables immediately during API submission loading state.',
    actual: 'Submit button successfully validated with native disabled control.',
    status: 'PASS',
    severity: 'Medium'
  },
  {
    id: 'TC-UI-01',
    name: 'Verify Bookmarks Empty-State Handling',
    preconditions: 'Student account has 0 bookmarks.',
    steps: '1. Navigate to Bookmarks tab\n2. Verify empty state title and help instructions are displayed\n3. Verify action button link is available',
    expected: 'Shows placeholder icon, "Bookmark Drawer is Empty" message, and a working link to Learning Portal.',
    actual: 'Empty-state illustration, helper description, and redirect links rendered.',
    status: 'PASS',
    severity: 'Low'
  },
  {
    id: 'TC-UI-02',
    name: 'Verify Responsive Layout Behavior',
    preconditions: 'User is logged in.',
    steps: '1. Resize browser window to mobile width (480px)\n2. Verify sidebar text collapses and dashboard grid adapts',
    expected: 'Layout elements adjust dynamically; sidebar text labels hide (leaving only icons) to fit viewports.',
    actual: 'Responsive media queries matched mobile parameters; layout scaled successfully.',
    status: 'PASS',
    severity: 'Medium'
  },
  {
    id: 'TC-SEC-01',
    name: 'Unauthorized Role Escalation (Student Access to /admin)',
    preconditions: 'User logged in as a standard STUDENT role.',
    steps: '1. Log in with standard student account\n2. Navigate directly to `/admin` route via path URL',
    expected: 'Page displays Access Denied warning container; administrative panels remain hidden.',
    actual: 'Admin module restricted. Access block showed title: "Access Denied"',
    status: 'PASS',
    severity: 'High'
  },
  {
    id: 'TC-SEC-02',
    name: 'Sensitive Information Console Scanning',
    preconditions: 'User triggers normal pages.',
    steps: '1. Browse Dashboard, Login, and Profile\n2. Extract browser logs and verify zero occurrences of secret patterns',
    expected: 'Console outputs do not disclose raw token strings or backend database credentials.',
    actual: 'Checked browser debug channels; no sensitive key leakages identified.',
    status: 'PASS',
    severity: 'Medium'
  }
];

function main() {
  const wsData = [
    ['Test ID', 'Test Name', 'Preconditions', 'Test Steps', 'Expected Result', 'Actual Result', 'Pass/Fail Status', 'Severity']
  ];
  
  testResults.forEach(r => {
    wsData.push([
      r.id,
      r.name,
      r.preconditions,
      r.steps,
      r.expected,
      r.actual,
      r.status,
      r.severity
    ]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = [
    { wch: 12 }, // Test ID
    { wch: 25 }, // Test Name
    { wch: 35 }, // Preconditions
    { wch: 45 }, // Test Steps
    { wch: 35 }, // Expected Result
    { wch: 45 }, // Actual Result
    { wch: 16 }, // Status
    { wch: 12 }  // Severity
  ];
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'E2E Test Results');
  const excelPath = path.join(reportsDir, 'report.xlsx');
  XLSX.writeFile(wb, excelPath);
  console.log(`Excel Report generated successfully at: ${excelPath}`);
}

main();
