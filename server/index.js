/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
const grpc = require('grpc');
const greets = require('./protos/greet_pb');
const service = require('./protos/greet_grpc_pb');
const calc = require('./protos/calculator_pb');
const calcService = require('./protos/calculator_grpc_pb');


/**
 * Implements the greet RPC method
 */

function greet(call, callback) {
  const greeting = new greets.GreetResponse();
  greeting.setResult(
    `Hello... 
    ${call.request.getGreet().getFirstName()}
    ${call.request.getGreet().getLastName()}
    `,
  );
  callback(null, greeting);
}

/**
 * Implements the sum RPC method
 */
function sum(call, callback) {
  const sumResponse = new calc.SumResponse();
  sumResponse.setSumResult(
    call.request.getFirstNumber() + call.request.getSecondNumber(),
  );

  callback(null, sumResponse);
}

function main() {
  const server = new grpc.Server();
  server.addService(service.GreetServiceService, { greet });
  server.addService(calcService.CalculatorServiceService, {
    sum,
  });
  server.bind('localhost:50051', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('server is running on 50051');
}

main();
