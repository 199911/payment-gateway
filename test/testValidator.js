const assert = require('assert');
const validator = require('../public/javascripts/validator.js');

let expect;

//

expect = true;
assert(expect === validator['customer-name']('Your name'), 'Expect string Your name is valid');

expect = false;
assert(expect === validator['customer-name'](''), 'Expect empty string is invalid');

console.log('test customer-name');

//

expect = true;
assert(expect === validator['customer-phone']('1234'), 'Expect string 1234 is valid');
assert(expect === validator['customer-phone'](1234), 'Expect number 1234 is valid');

expect = false;
assert(expect === validator['customer-phone']('ASDF'), 'Expect ASDF is invalid');
assert(expect === validator['customer-phone']('+12.34'), 'Expect string +12.34 is invalid');
assert(expect === validator['customer-phone']('1234-10987'), 'Expect 1234-10987 is invalid');
assert(expect === validator['customer-phone']('234@#$%^&'), 'Expect 234@#$%^& is invalid');

console.log('test customer-phone');

//

expect = true;
assert(expect === validator['currency']('HKD'), 'Expect HKD is valid');
assert(expect === validator['currency']('EUR'), 'Expect EUR is valid');
assert(expect === validator['currency']('CNY'), 'Expect CNY is valid');

expect = false;
assert(expect == validator['currency']('ASDF'), 'Expect ASDF is invalid');

console.log('test currency');

//

expect = true;
assert(expect === validator['price']('1234.00'), 'Expect string 1234 is valid');
assert(expect === validator['price']('0.13'), 'Expect string 0.13 is valid');

expect = false;
assert(expect === validator['price']('1A34'), 'Expect 12A34 is invalid');
assert(expect === validator['price']('2.4'), 'Expect string -12.34 is invalid');
assert(expect === validator['price']('-12.34'), 'Expect string -12.34 is invalid');

console.log('test price');

//

expect = true;
assert(expect === validator['cardholder-name']('Your name'), 'Expect string Your name is valid');

expect = false;
assert(expect === validator['cardholder-name'](''), 'Expect empty string is invalid');

console.log('test cardholder-name');

//

expect = true;
assert(expect === validator['card-number']('378282246310005'), 'Expect string 378282246310005 is valid');
assert(expect === validator['card-number']('5555555555554444'), 'Expect string 5555555555554444 is valid');
assert(expect === validator['card-number']('4111111111111111'), 'Expect string 4111111111111111 is valid');
assert(expect === validator['card-number']('6799990100000000019'), 'Expect string 6799990100000000019 is valid');

expect = false;
assert(expect === validator['card-number']('12345678901'), 'Expect string 12345678901 is invalid');
assert(expect === validator['card-number']('12345678901234567890'), 'Expect string 12345678901 is invalid');
assert(expect === validator['card-number']('1234-10987'), 'Expect 1234-10987 is invalid');
assert(expect === validator['card-number']('234@#$%^&'), 'Expect 234@#$%^& is invalid');

console.log('test card-number');

//

// test must be independent from the date when the test is executed

validator.getCurrentDate = function() {
    // month is 0-based, 2017, 9 is OCT 2017
    return new Date(2017, 9);
}

expect = true;
assert(expect === validator['expiration']('11/34'), 'Expect 11/34 is valid');
assert(expect === validator['expiration']('01/20'), 'Expect 01/20 is valid');

expect = false;
assert(expect === validator['expiration']('01/17'), 'Expect 01/17 is invalid');
assert(expect === validator['expiration']('12/10'), 'Expect 12/10 is invalid');
assert(expect === validator['expiration']('00/44'), 'Expect 00/20 is invalid');
assert(expect === validator['expiration']('13/44'), 'Expect 13/20 is invalid');
assert(expect === validator['expiration']('88/44'), 'Expect 88/20 is invalid');

//

expect = true;

assert(expect === validator['card-cvv']('1234'), 'Expect string 1234 is valid');
assert(expect === validator['card-cvv']('5555'), 'Expect string 1234 is valid');
assert(expect === validator['card-cvv']('0034'), 'Expect string 1234 is valid');
assert(expect === validator['card-cvv']('034'), 'Expect string 1234 is valid');
assert(expect === validator['card-cvv']('789'), 'Expect string 1234 is valid');

expect = false;
assert(expect === validator['card-cvv']('ASDF'), 'Expect ASDF is invalid');
assert(expect === validator['card-cvv']('1234-10987'), 'Expect 1234-10987 is invalid');
assert(expect === validator['card-cvv']('234@#$%^&'), 'Expect 234@#$%^& is invalid');

console.log('test card-cvv');

//

expect = true;
assert(expect === validator['order-id']('7baa07c7-39ff-4299-a0fa-32cae789bf11'), 'Expect string 7baa07c7-39ff-4299-a0fa-32cae789bf11 is valid');

expect = false;
assert(expect === validator['order-id']('11982iouqwhiuc1p93rc98hugerwfhqwec3d'), 'Expect string 11982iouqwhiuc1p93rc98hugerwfhqwec3d is invalid');

console.log('test order-id');

//

expect = true;
assert(expect === validator['order-name']('Your name'), 'Expect string Your name is valid');

expect = false;
assert(expect === validator['order-name'](''), 'Expect empty string is invalid');

console.log('test order-name');
