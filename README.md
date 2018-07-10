[![Build Status](https://travis-ci.org/brunopacheco1/proto-blockchain.svg?branch=master)](https://travis-ci.org/brunopacheco1/proto-blockchain) [![Coverage Status](https://coveralls.io/repos/github/brunopacheco1/proto-blockchain/badge.svg?branch=master)](https://coveralls.io/github/brunopacheco1/proto-blockchain?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/brunopacheco1/proto-blockchain/badge.svg?targetFile=package.json)](https://snyk.io/test/github/brunopacheco1/proto-blockchain?targetFile=package.json)

# proto-blockchain

It's a learning case of the blockchain, built in JavaScript over Node.js. I'm using ES6 and 10.* versions respectively.

It's possible to add and broadcast new transactions and to mine new blocks calling some endpoints. Take a look the Open API section for more details.

I had to run endpoints manually to register new nodes and to synchronize them within the blockchain network, but now I'm using RabbitMQ. Any new node has to publish his own address in a topic and it'll receive back from another topic everyone else's blockchain to run the consensus algorithm.

I'm currently using the longest chain algorithm, which means simply that a chain will be kept by the network nodes if it's the longest valid chain.

## Open API

The API documentation can be found in the link below.

https://proto-blockchain.herokuapp.com/api-docs

## CI/CD

I'm using Travis-CI, Coveralls and Heroku. Travis is running a simple script which executes the tests, analyzes the code with IstambulJS (nyc) and deploys the app in Heroku Cloud.

## Testing

I'm using AvaJS and IstambulJS to run the test cases and to analyze the code. I'm not using Mocha instead because I faced some bugs on it while running ES6 code. After some googling, I found that it was quite easy writing test cases using AvaJS, I didn't have bug with async/await and it provides good assert options.

To run the test cases just execute npm test. I'm using supertest library for integration tests, but in the future I might write more consistent tests, as I'm not testing the network behavior when new nodes are added or when the transactions and blocks are broadcasted.

I splitted the test cases into many different files just to keep the semantic and reduce the files' size.

## Future work

TODO:
- Persist somehow the blockchain, as Heroku has not persistent drivers as far as I know;
- Automate the deployment of all nodes;
- Valid new transactions according to the sender's balance;
- Create integration tests to evaluate the network behavior;