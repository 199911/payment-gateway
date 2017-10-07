const express = require('express');
const router = express.Router();
// Reuse the front-end validation logic
const validator = require('../public/javascripts/validator.js');
const getCreditCardType = require('../lib/getCreditCardType.js');
const gateway = require('../lib/gateway.js');
const db = require('../lib/db.js');
const uuidv4 = require('uuid/v4');
const cache = require('../lib/cache.js');

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
      if (key == 'getCurrentDate' || key == 'order-id' || key == 'order-name') {
        continue;
      }
      isValid = isValid && validator[key](data[key]);
    }
    data['card-type'] = getCreditCardType(data['card-number']);
    if (!isValid) {
      // This branch will be hit only if user send POST require directly
      // Because the front-end and back-end are using the same validation logic
      res.render('index', {
        messageTitle: 'Error',
        messageBody: 'Invalid form data'
      });
      return ;
    }

    // Gateway logic
    let paymentGateway;
    // Detect error related to payment gateway
    let gatewayMessage;
    if (data['card-type'] === 'amex') {
      if (data['currency'] === 'USD') {
        paymentGateway = gateway.paypal;
      } else {
        paymentGateway = null;
        gatewayMessage = {
          messageTitle: 'Error',
          messageBody: 'Only USD payment is allowed with AMEX card'
        };
      }
    } else {
      if (data['currency'] === 'USD' || data['currency'] === 'EUR' || data['currency'] === 'AUD') {
        paymentGateway = gateway.paypal;
      } else {
        if (data['currency'] === 'JPY' && (data['price'] % 1 !== 0)) {
          gatewayMessage = {
            messageTitle: 'Error',
            messageBody: 'For JPY payment, only integer price is allowed'
          };
        } else {
          paymentGateway = gateway.braintree;
        }
      }
    }
    if (paymentGateway) {
      const uuid = uuidv4();
      paymentGateway.payAsync(data)
        .then(function(res) {
          console.log('res');
          console.log(JSON.stringify(res,null, 2));
          return res;
        })
        .catch(function(err) {
          // Extract the error message from different gateway, re-throw the error to let next
          // catch to handle
          let message = paymentGateway.extractErrorMessage(err);
          throw new Error(message);
        })
        .then(function(res) {
          const record = {
            uuid: uuid,
            name: data['customer-name'],
            phone: data['customer-phone'],
            currency: data['currency'],
            price: data['price'],
            response: JSON.stringify(res)
          };
          return db.insertAsync(record);
        })
        .then(function(){
          return cache.setAsync(uuid, {
            uuid: uuid,
            name: data['customer-name'],
            phone: data['customer-phone'],
            currency: data['currency'],
            price: data['price'],
          });
        })
        .then(function(){
          res.render('index', {
            messageTitle: 'Success',
            messageBody: `Your order id: ${uuid}`
          });
        })
        .catch(function(err) {
          // Gather error message and give proper response to user
          res.render('index', {
            messageTitle: 'Error',
            messageBody: `${err.message}`
          });
        });
    } else {
      res.render('index', gatewayMessage);
    }
  });

router
  .post('/check-payment', function(req, res, next) {
    const data = req.body;

    // Validation
    let isValid = true;
    for (var key of ['order-id', 'order-name']) {
      isValid = isValid && validator[key](data[key]);
    }
    if (!isValid) {
      // This branch will be hit only if user send POST require directly
      // Because the front-end and back-end are using the same validation logic
      res.render('index', {
        messageTitle: 'Error',
        messageBody: 'Invalid form data'
      });
      return ;
    }

    // Query logic
    cache.getAsync(data['order-id'])
      .then(function(cacheData) {
        // MySQL is case insensitive by default, check the customer name here
        if (cacheData && (data['order-name'] === cacheData.name)) {
          let recordMessage = '';
          recordMessage += `Order ID: ${cacheData.uuid}\n`;
          recordMessage += `Customer Name: ${cacheData.name}\n`;
          recordMessage += `Customer Phone Number: ${cacheData.phone}\n`;
          recordMessage += `Currency: ${cacheData.currency}\n`;
          recordMessage += `Price: ${cacheData.price}\n`;
          res.render('index', {
            messageTitle: 'Order found',
            messageBody: recordMessage
          });
        } else {
          res.render('index', {
            messageTitle: 'Error',
            messageBody: 'Order not found'
          });
        }
      })
      .catch(function(err) {
        res.render('index', {
          messageTitle: 'Error',
          messageBody: 'Cannot check record'
        });
      });
  });

module.exports = router;
