const Promise = require('bluebird');

const paypal = require('paypal-rest-sdk');
const config = require('../config.js').gateways.paypal;
paypal.configure(config);

const payAsync = function(data) {
  // TODO: handle data['price'] hust have 2 d.c problem
  const date = data['expiration'].split('/');
  const expireMonth = date[0];
  const expireYear = "20" + date [1];
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "credit_card",
        "funding_instruments": [{
            "credit_card": {
                "type": data['card-type'],
                "number": data['card-number'],
                "expire_month": expireMonth,
                "expire_year": expireYear,
                "cvv2": data['card-cvv'],
            }
        }]
    },
    "transactions": [{
      "amount": {
        "total": data['price'],
        "currency": data['currency'],
      },
    }]
  };
  return new Promise(function(resolve, reject) {
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        reject(error);
      } else {
        resolve(payment)
      }
    });
  });
}

module.exports = {
  payAsync: payAsync
};