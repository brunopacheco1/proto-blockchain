# proto-blockchain

It's a learning case of the blockchain, built in JavaScript over Node.js. I'm using ES6 and 10.* versions respectively.

It's possible to add and broadcast new transactions and to mine new blocks and broadcast them as well, calling some endpoints. It's possible to find more about the endpoints the Open API section.

To add new nodes in the network previously I had to run endpoints manually to register the new node and to synchronize the blockchain. I'm using RabbitMQ to do it automatically. Any new node has to publish his own address in a topic and it'll receive back in another topic the blockchains from everyone else to run the consensus algorithm.

Regarding the consensus algorithm, I'm currently using the longest chain, which means simply that the longest chain will be the last one if it's a valid chain.

## Open API

The API documentation can be found in the link below.

https://proto-blockchain.herokuapp.com/api-docs

## CI/CD

I'm using Travis-CI, SonarCloud and Heroku. Travis is running a simple script which executes the tests, analyze the code with Sonar and deploys the app in Heroku Cloud. It's possible to find this config on .travis.yml file.

## Testing

I had to use AVA instead MOCHA to run the tests because there're some bugs in MOCHA to run ES6 code. It was quite easy writing test cases and also AVA already supports promises, besides providing good assert options.

To run the test cases just execute npm test. I coded several unit tests and some integration tests. For integration tests, I'm using supertest library, but in the future, I might write more consistent ones as I'm not testing the network behavior when new nodes are added or when the transaction and block are broadcasted.

I split the test cases into many different files just to keep the semantic and reduce the files. They are not found automatically by AVA because I'm not following the known path standards. AVA was throwing some crazy not caught exception, so to the workaround I'm importing and declaring them manually in the file test.mjs.

## Future work

I have a list of improvements to do:
- Persist somehow the blockchain somewhere, as Heroku has not persistent drivers as far as I know;
- Automate the deployment of all nodes;
- Valid new transactions according to the sender's balance;
- Create integration tests to evaluate the network behavior;