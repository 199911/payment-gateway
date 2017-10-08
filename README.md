# Payment gateway

## Installation

Assume you run the repo on Mac
1. Install Docker
    1. Install Homebrew
        - /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    2. Set up Homebrew-Cask
        - brew tap caskroom/cask
    3. Install Docker
        - brew cask install docker
    4. Start the Docker App
        - Docker logo should be found after you start the app
    5. Check docker and docker-composer version
        - docker -v
        - docker-compose -v
        - If Docker does not change the package, docker-compose should be included when installing docker
2. Deploy the app
    1. Go into the directory of project (assume you clone the project in ~)
        - cd ~/payment-gateway
    2. Deploy the app
        - npm run deploy
        - Everything run automatically, only need to wait
            1. Install npm package
            2. Download node.js docker image
            3. Build app's docker image
            4. Download mysql docker image
            5. Download redis docker image
            6. Build the container
            7. Wait 1 min after containers build
                - Because the MySQL takes some time to set up after the container set up, we wait 1 min to make sure it is ready
3. Access the app
    - http://127.0.0.1:3000/

## Data structure

### Database
- id
    - type: bigint(20) unsigned
    - NOT NULL AUTO_INCREMENT
    - Primary key
    - id for internal db usage
- uuid
    - type: varchar(36)
    - NOT NULL
    - id for customer to query record
- name
    - type: text
    - NOT NULL
    - Use text to not limit the lenght of name
- phone
    - type: varchar(20)
    - NOT NULL,
    - 20 digit is long enough for phone numbers
- currency
    - type: varchar(3)
    - NOT NULL
    - 3 char should is enough for paypal and braintree
- price
    - type: varchar(20)
    - NOT NULL
    - Use string to avoid handling the price format
- response
    - type: JSON
    - Use JSON as api response structure is not fixed
    - And we can query by MySQL JSON functions

### Redis

- Found orders:
    - Key: uuid
    - Value: JSON string
        - uuid: Order ID
        - name: Name of customer
        - phone: Phone number of customer
        - currency
        - price
- Orders not found
    - Key: uuid
    - Value: 'null'

## Testing

- Unit tests
    - npm test
- Access server logs
    - docker logs -f app
- [Test card from brain tree](https://developers.braintreepayments.com/reference/general/testing/node)
    - amex
        - 378282246310005
    - master
        - 5555555555554444
    - visa
        - 4111111111111111
    - maestro
        - 6304000000000000
        - Braintree sandbox does not support maestro account
    - discover
        - 6011111111111117
        - Seems does not work in paypal sandbox
- My PalPay test account
    - PalPay test cards does not work in Braintree
    - visa
        - 4032037666284084
        - 11/22
    - master
        - 5110926052281468
        - 11/22
    - discover
        - 6011041778999902
        - 01/21
        - Don't know why I cannot activate this payment card in my PayPal sandbox account

## Bonus

1. Consider how to add additional payment gateways
    1. Implement a `***Gateway.js` in `/lib`
        - payAsync: the payment logic
            - Input: data object
            - Output: Promise, resolve only if payment success
        - extractErrorMessage:
            - Input: the error throw by payAsync
            - Output: String, error message which will be present to user
    2. Add the new payment gateway in `lib/gateway.js`
    3. Add gateway selection logic in `routes/index.js`
2. Consider how to guarantee payment record are found in your database and Paypal
    - We need to use another payment api which provide scheduled payment
    - scheduled payment -> store info in data base -> confirm the payment
    - scheduled payment (fail) -> halt
    - scheduled payment -> store info in data base (fail) -> cancel the payment
3. Consider cache may expired when check order record
    - In my implementation in `lib/cache.js`, if cache miss, it will automatically fallback to database and update the cache
    - The result of order not exist is also cached, to prevent database attack by spamming queries on order not exist
4. Consider the data encryption for the payment record query
    - If we don't need to do complex query on record query, we can encrypt the data in database, decrypt in app server
5. Consider how to handle security for saving credit cards
    - The most security way is not to store any credit cards information
    - It is recommended by [PCI security standards council](https://www.pcisecuritystandards.org/pdfs/pci_fs_data_storage.pdf)

## Improvement can be done

- Encrypt the config.js data with AWS KMS
- Hiding the information on which gateway do we use
    - PayPal gateway is much slower than Braintress
    - Random wait can be added to braintree gateway, if we don't want user know which gateway do we use
- Apply more validation logic in front end to reduce server load on handing invalid payment
    - JPY price format (decimal number is not allowed)
    - CVV digits (4 digits for amex, 3 digits for others)
    - Even we have validation in front end, validation in back end need to be kept
        - Protect server from malicious POST requests sent directly
- Refactor the gateway logic in `routes/index.js`
    - Make adding new gateway easier
- Move cache expiration time to `config.js`
