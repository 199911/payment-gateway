const Promise = require('bluebird');

const braintree = require('braintree');
const config = require('../config.js').gateways.braintree;

const gateway = braintree.connect(config);

const payAsync = function(data) {
  return new Promise(function(resolve, reject) {
    // TODO: handle currency not found problem
    // TODO: handle JPY not allow decimal number problem
    const merchantAccountId = config['merchantAccounts'][data['currency']];
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

module.exports = {
  payAsync: payAsync
};