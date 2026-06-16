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
  
  // Standard waiting timeout (milliseconds)
  timeout: 5000
};
