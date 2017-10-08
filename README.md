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
            1. Download node.js docker image
            2. Build app's docker image
            3. Download mysql docker image
            4. Download redis docker image
            5. Build the container
            6. Wait 1 min after containers build
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


