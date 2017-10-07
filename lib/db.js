const Promise = require('bluebird');
const mysql = require('promise-mysql');
const config = require('../config.js').database;

const pool = mysql.createPool(config);

// Init database
pool.query(`
  CREATE TABLE IF NOT EXISTS payment_record (
    id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id for internal db usage',
    uuid varchar(36) NOT NULL COMMENT 'id for customer to query record',
    name text NOT NULL COMMENT 'Use text to not limit the lenght of name',
    phone varchar(20) NOT NULL,
    currency varchar(3) NOT NULL COMMENT '3 char should is enough for paypal and braintree',
    price varchar(20) NOT NULL COMMENT 'Use string to avoid handling the price format',
    response JSON COMMENT 'Use JSON as api response structure is not fixed',
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
`);