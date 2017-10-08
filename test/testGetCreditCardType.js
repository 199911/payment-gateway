const assert = require('assert');
const getCreditCardType = require('../lib/getCreditCardType.js');

let expect;

//

expect = 'amex';
assert(expect === getCreditCardType('378282246310005'), 'Expect amex');
assert(expect === getCreditCardType('371449635398431'), 'Expect amex');

expect = 'mastercard';
assert(expect === getCreditCardType('5555555555554444'), 'Expect mastercard');
assert(expect === getCreditCardType('5110926052281468'), 'Expect mastercard');
assert(expect === getCreditCardType('2223000048400011'), 'Expect mastercard');

expect = 'visa';
assert(expect === getCreditCardType('4111111111111111'), 'Expect visa');
assert(expect === getCreditCardType('4032037666284084'), 'Expect visa');

expect = 'discover';
assert(expect === getCreditCardType('6011111111111117'), 'Expect discover');
assert(expect === getCreditCardType('6011041778999902'), 'Expect discover');

expect = 'maestro';
assert(expect === getCreditCardType('6304000000000000'), 'Expect maestro');


console.log('tested getCreditCardType');

//
