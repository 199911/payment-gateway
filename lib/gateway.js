const braintreeGateway = require('./braintreeGateway.js');
const paypalGateway = require('./paypalGateway.js');

module.exports = {
  braintree: braintreeGateway,
  paypal: paypalGateway,
};