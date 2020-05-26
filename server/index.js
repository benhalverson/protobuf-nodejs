const grpc = require('grpc');
function main() {
  const server = new grpc.Server();
  server.bind('localhost:50051', grpc.ServerCredentials.createInsecure())
  server.start()
  console.log('server is running on 50051');
}

main();