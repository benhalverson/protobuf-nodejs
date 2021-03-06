/* eslint-disable no-console */
const grpc = require('grpc');
const greets = require('../server/protos/greet_pb');
const services = require('../server/protos/greet_grpc_pb');
const calc = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');
const blogs = require('../server/protos/blog_pb');
const blogService = require('../server/protos/blog_grpc_pb');

function callGreeting() {
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

function callSum() {
  const client = new calcService.CalculatorServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure(),
  );

  const sumRequest = new calc.SumRequest();

  sumRequest.setFirstNumber(10);
  sumRequest.setSecondNumber(10);

  client.sum(sumRequest, (error, response) => {
    if (!error) {
      console.log(`${sumRequest.getFirstNumber()} + ${sumRequest.getSecondNumber()} = ${response.getSumResult()}`);
    } else {
      console.error('Error', error.details);
    }
  });
}

function callGreetingManyTimes() {
  const client = new services.GreetServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure(),
  );

  // create request
  const request = new greets.GreetManyTimesRequest();
  const greeting = new greets.Greeting();

  greeting.setFirstName('Benny');
  greeting.setLastName('Halverson');

  client.greetManyTimes(request, () => { });
}
function callListBlog() {
  const client = new blogService.BlogServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure(),
  );
  const emptyBlogRequest = new blogs.ListBlogRequest();
  const call = client.listBlog(emptyBlogRequest, () => { });

  call.on('data', (response) => {
    console.log('Client streaming response: ', response.getBlog().toString());
  });

  call.on('error', (error) => {
    console.error(error.details);
  });
}

function callCreateBlog() {
  const client = new blogService.BlogServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure(),
  );

  const blog = new blogs.Blog();
  blog.setAuthor('Lulu');
  blog.setTitle('A blog by a dog...');
  blog.setContent('Some content about sleeping all day');

  const blogRequest = new blogs.CreateBlogRequest();
  blogRequest.setBlog(blog);

  client.createBlog(blogRequest, (error, response) => {
    if (!error) {
      console.log('Received create blog response', response.toString());
    } else {
      console.error(error.details);
    }
  });
}

function callReadBlog() {
  const client = new blogService.BlogServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure(),
  );

  const readBlogRequest = new blogs.ReadBlogRequest();
  readBlogRequest.setBlogId('21');

  client.readBlog(readBlogRequest, (error, response) => {
    if (!error) {
      console.log('found a blog: ', response.toString());
    } else if (error.code === grpc.status.NOT_FOUND) {
      console.log('not found');
    } else {
      // do something else
    }
  });
}
function main() {
  // callGreeting();
  // callSum();
  // callGreetingManyTimes();
  callListBlog();
  callCreateBlog();
  callReadBlog();
}

main();
