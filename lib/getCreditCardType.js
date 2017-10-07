// Get card type by card number
// https://en.wikipedia.org/wiki/Payment_card_number

// NOTE: This function is not 100% accurate, as only paypal
// cardNumber is string
const getCreditCardType = function(cardNumber) {
  const types = {
    visa: function(number) {
      return number[0] === '4';
    },
    mastercard: function(number) {
      const prefix = number.slice(0,2);
      if (prefix >= '51' && prefix <= '55') {
        return true;
      }
      const prefix4 = number.slice(0,4);
      if (prefix4 >= '2221' && prefix4 <= '2720') {
        return true;
      }
      return false;
    },
    amex: function(number) {
      const prefix = number.slice(0,2);
      return prefix === '34' || prefix === '37';
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
        '50', '56', '57', '58'
      ];
      const prefix = number.slice(0,2);
      for (var i = 0; i < validPrefix.length; i++) {
        if (validPrefix[i] === prefix) {
          return true;
        }
      }
      // From wiki, card start with 6 is also maestro
      if (number[0] === '6') {
        return true;
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