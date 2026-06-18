module.exports = {
  // Target URL of the locally running frontend web app
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
  
  // Test User Accounts (aligned with seeded DB values and validation rules)
  users: {
    validStudent: {
      email: 'student@edusphere.com',
      password: 'StudentPassword123'
    },
    validAdmin: {
      email: 'admin@edusphere.com',
      password: 'AdminPassword123'
    },
    invalid: {
      email: 'fake_student@edusphere.com',
      password: 'wrong_password'
    },
    malformedEmail: {
      email: 'student_edusphere.com',
      password: 'StudentPassword123'
    }
  },
  
  // Selenium WebDriver timeouts (milliseconds)
  timeouts: {
    elementWait: 10000,      // Max time to wait for element to be located
    elementVisible: 8000,    // Max time to wait for element to be visible
    pageLoad: 15000,         // Max time to wait for page to load
    implicit: 5000,          // Implicit wait for element operations
    default: 5000            // Default timeout for operations
  }
};
