// Get card type by card number
// https://creditcardjs.com/credit-card-type-detection

// NOTE: This function is not 100% accurate, as only paypal
// cardNumber is string
const getCreditCardType = function(cardNumber) {
  const types = {
    visa: function(number) {
      return number[0] === '4';
    },
    mastercard: function(number) {
      const prefix = number.slice(0,2);
      return prefix >= '50' && prefix <= '55'
    },
    amex: function(number) {
      const prefix = number.slice(0,2);
      return prefix === '34' || prefix === '37'
    },
    discover: function(number) {
      if (number.slice(0,4) === '6011') {
        return true;
      } else if (number.slice(0,2) === '65') {
        return true;
      } else {
        const prefix6 = number.slice(0,6);
        if (prefix6 >= '622126' && prefix6 <= '622925') {
          return true;
        }
        const prefix3 = number.slice(0,3);
        if (prefix3 >= '644' && prefix3 <= '649') {
          return true;
        }
      }
      return false;
    },
    maestro: function(number) {
      const validPrefix = [
        '5018', '5020', '5038', '5612', '5893', '6304', '6759', '6761','6762', '6763', '0604', '6390'
      ];
      const prefix = number.slice(0,4);
      for (var i = 0; i < validPrefix.length; i++) {
        if (validPrefix[i] === prefix) {
          return true;
        }
      }
      return false;
    },
  };
  for (var key in types) {
    if (types[key](cardNumber)) {
      return key;
    }
  }
  return 'others';
}

module.exports = getCreditCardType;