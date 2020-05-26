/* eslint-disable no-console */
const grpc = require('grpc');
const greets = require('./protos/greet_pb');
const service = require('./protos/greet_grpc_pb');

/*
  Implements the greet RPC method
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

function main() {
  const server = new grpc.Server();
  server.addService(service.GreetServiceService, { greet });
  server.bind('localhost:50051', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('server is running on 50051');
}

main();
