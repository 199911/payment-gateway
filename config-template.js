const braintree = require('braintree');

// Use js instead of json because it allow comments
// And the syntax is more relax
module.exports = {
  // It is not safe to put api keys and secrets in plain text
  // and commit to git, can use KMS or blackbox to encrypt the data
  gateways: {
    braintree: {
      environment: braintree.Environment['Sandbox'],
      merchantId: '****************',
      publicKey: '****************',
      privateKey: '********************************',
      // currency to merchantAccountId
      merchantAccounts: {
        'HKD': '*********',
        'JPY': '*********',
        'CNY': '*********',
      },
    },
    paypal: {
      'mode': 'sandbox',
      'client_id': '********************************************************************************',
      'client_secret': '********************************************************************************',
    }
  },

  database: {
    connectionLimit: 10,
    host: 'mysql',
    user: 'root',
    password: 'sunday',
    database: 'payment_gateway',
  },
  cache: {
    host: 'redis',
    port: '6379',
  }
};
