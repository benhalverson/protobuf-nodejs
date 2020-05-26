/* eslint-disable no-console */
const grpc = require('grpc');
const greets = require('../server/protos/greet_pb');
const services = require('../server/protos/greet_grpc_pb');

function main() {
  console.log('hello from the client');
  const client = new services.GreetServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure(),
  );

  // create our rpc request
  const request = new greets.GreetRequest();

  // create a proto buf greeting message
  const greeting = new greets.Greeting();
  greeting.setFirstName('Ben');
  greeting.setLastName('Halverson');

  request.setGreet(greeting);


  client.greet(request, (error, response) => {
    if (!error) {
      console.log('Greeting response', response.getResult());
      // console.log('SerializeBinary response', response.serializeBinary());
      // console.log('Response toObject', response.toObject());
      // console.log('Set result', response.setResult(greeting));
      // console.log('Get result', response.getResult().array[0]);
    } else {
      console.error('Error', error.details);
    }
  });
}

main();
