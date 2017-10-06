var validator = {
  'customer-name': function() {
    return true;
  },
  'customer-phone': function(phone) {
    // Numerical string
    var reg = new RegExp('^[0-9]+$');
    return reg.test(phone);
  },
  currency: function(currency) {
    var validCurrencies = [ 'HKD', 'USD', 'AUD', 'EUR', 'JPY', 'CNY'];
    for (var i = 0; i < validCurrencies.length; i++) {
      if (currency === validCurrencies[i]) {
        return true;
      }
    }
    return false;
  },
  price: function(price) {
    // Allow float number
    var reg = new RegExp('^[0-9.]+$');
    return reg.test(price);
  },
  'cardholder-name': function() {
    return true;
  },
  'card-number': function(cardNumber) {
    var reg = new RegExp('^[0-9]+$');
    return reg.test(cardNumber);
  },
  expiration: function(expiration) {
    // In format MM/YY
    var reg = new RegExp('^[0-9]{2}/[0-9.]{2}$');
    if (reg.test(expiration)) {
      var date = expiration.split('/');
      var month = parseInt(date[0]);
      // month in [0,12], month >= current month
      var year = parseInt(date[1]);
      // year >= current year
      var now = new Date();
      // Month in js is 0 based
      var currentMonth = now.getMonth() + 1;
      // We only need the last 2 digit
      var currentYear = now.getYear() % 100;
      return month >= currentMonth && year >= currentYear;
    } else {
      return false;
    }
  },
  'card-cvv': function(price) {
    // 3 or 4 digit number
    var reg = new RegExp('^[0-9.]{3,4}$');
    return reg.test(price);
  },
}

// Simple way to make the front-end and back-end using the same
// validator logic, prevent subtle integration bugs
if (module) {
  module.exports = validator;
}