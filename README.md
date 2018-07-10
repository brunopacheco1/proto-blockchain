[![Build Status](https://travis-ci.org/brunopacheco1/proto-blockchain.svg?branch=master)](https://travis-ci.org/brunopacheco1/proto-blockchain) [![Coverage Status](https://coveralls.io/repos/github/brunopacheco1/proto-blockchain/badge.svg?branch=master)](https://coveralls.io/github/brunopacheco1/proto-blockchain?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/brunopacheco1/proto-blockchain/badge.svg?targetFile=package.json)](https://snyk.io/test/github/brunopacheco1/proto-blockchain?targetFile=package.json)

# proto-blockchain

It's a learning case of the blockchain, built in JavaScript over Node.js. I'm using ES6 and 10.* versions respectively.

It's possible to add and broadcast new transactions and to mine new blocks and broadcast them as well, calling some endpoints. It's possible to find more about the endpoints the Open API section.

To add new nodes in the network previously I had to run endpoints manually to register the new node and to synchronize the blockchain. I'm using RabbitMQ to do it automatically. Any new node has to publish his own address in a topic and it'll receive back in another topic the blockchains from everyone else to run the consensus algorithm.

Regarding the consensus algorithm, I'm currently using the longest chain, which means simply that the longest chain will be the last one if it's a valid chain.

## Open API

The API documentation can be found in the link below.

https://proto-blockchain.herokuapp.com/api-docs

## CI/CD

I'm using Travis-CI, Coveralls and Heroku. Travis is running a simple script which executes the tests, analyze the code with IstambulJS (nyc) and deploys the app in Heroku Cloud. It's possible to find this config on .travis.yml file.

## Testing

I started using AVA instead MOCHA because I faced some bugs in MOCHA to run ES6 code. After some googling, I found AVA and It was quite easy writing test cases, I didn't have bug with async/await and it provides good assert options.

To run the test cases just execute npm test. I coded several unit tests and some integration tests. For integration tests, I'm using supertest library, but in the future I might write more consistent ones, as I'm not testing the network behavior when new nodes are added or when the transaction and block are broadcasted.

I split the test cases into many different files just to keep the semantic and reduce the files' size.

## Future work

TODO:
- Persist somehow the blockchain, as Heroku has not persistent drivers as far as I know;
- Automate the deployment of all nodes;
- Valid new transactions according to the sender's balance;
- Create integration tests to evaluate the network behavior;