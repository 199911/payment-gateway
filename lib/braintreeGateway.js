const Promise = require('bluebird');

const braintree = require('braintree');
const config = require('../config.js').gateways.braintree;

const gateway = braintree.connect(config);

const payAsync = function(data) {
  return new Promise(function(resolve, reject) {
    const merchantAccountId = config['merchantAccounts'][data['currency']];
    // Handle currency not found problem, should never have this case as we do form validation
    if (!merchantAccountId) {
      // Match the error format of braintree
      reject([{message: 'Currency not supported'}]);
    }
    gateway.transaction.sale({
      amount: data['price'],
      creditCard: {
          number: data['card-number'],
          cvv: data['card-cvv'],
          expirationDate: data['expiration'],
      },
      merchantAccountId: merchantAccountId,
      options: {
        submitForSettlement: true
      },
    }, function (err, result) {
      if (!result) {
        reject(err);
      } else {
        if (result.success || result.transaction) {
          resolve(result.transaction);
        } else {
          transactionErrors = result.errors.deepErrors();
          reject(transactionErrors);
        }
      }
    });
  });
}

const extractErrorMessage = function(err) {
  let message;
  if (err.length && err.length > 0) {
    message = err[0].message;
    console.log('braintree error');
    console.log(err);
  }
  return message;
}

module.exports = {
  payAsync: payAsync,
  extractErrorMessage: extractErrorMessage
};