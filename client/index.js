const grpc = require('grpc');
const services = require('../server/proto/dummy_grpc_pb');

function main() {
  console.log('hello from the client');
  const client = new services.DummyServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  )
    console.log('client', client);
    
  // do something here...
}

main();