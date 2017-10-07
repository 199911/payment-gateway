const express = require('express');
const router = express.Router();
// Reuse the front-end validation logic
const validator = require('../public/javascripts/validator.js');
const getCreditCardType = require('../lib/getCreditCardType.js');
const gateway = require('../lib/gateway.js');
const db = require('../lib/db.js');
const uuidv4 = require('uuid/v4');

/* GET home page. */
router
  .get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

router
  .post('/create-payment', function(req, res, next) {
    const data = req.body;
    // Validation
    let isValid = true;
    for (var key in validator) {
      if (key == 'getCurrentDate') {
        continue;
      }
      isValid = isValid && validator[key](data[key]);
    }
    data['card-type'] = getCreditCardType(data['card-number']);
    data.isValid = isValid;
    // Gateway logic
    let paymentGateway;
    if (data['card-type'] === 'amex') {
      if (data['currency'] === 'USD') {
        paymentGateway = gateway.paypal;
      } else {
        paymentGateway = null;
      }
    } else {
      if (data['currency'] === 'USD' || data['currency'] === 'EUR' || data['currency'] === 'AUD') {
        paymentGateway = gateway.paypal;
      } else {
        paymentGateway = gateway.braintree;
      }
    }
    if (paymentGateway) {
      paymentGateway.payAsync(data)
        .then(function(res) {
          console.log('res');
          console.log(JSON.stringify(res,null, 2));
          return res;
        })
        .catch(function(err) {
          console.log('err');
          console.log(err);
          if (err.response) {
              console.log(err.response);
          }
          throw err;
        })
        .then(function(res) {
          const record = {
            uuid: uuidv4(),
            name: data['customer-name'],
            phone: data['customer-phone'],
            currency: data['currency'],
            price: data['price'],
            response: JSON.stringify(res)
          };
          return db.insertAsync(record);
        })
        .then(function(){
          // TODO update cache
          // TODO send proper response to front end
        })
        .catch(function(err) {
          // TODO send proper response to front end
        });
    } else {
      // TODO error handling, amex must use usd
    }
    res.send(JSON.stringify(data, null, 4));
  });

module.exports = router;
