const express = require('express');
const router = express.Router();
// Reuse the front-end validation logic
const validator = require('../public/javascripts/validator.js');
const getCreditCardType = require('../lib/getCreditCardType.js');

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

    res.send(JSON.stringify(data, null, 4));
  });

module.exports = router;
