/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
const grpc = require('grpc');

const environment = process.env.ENVIRONMENT || 'development';
const config = require('./knexfile')[environment];

const fs = require('fs');
const knex = require('knex')(config);
const greets = require('./protos/greet_pb');
const service = require('./protos/greet_grpc_pb');
const calc = require('./protos/calculator_pb');
const calcService = require('./protos/calculator_grpc_pb');
const blogs = require('./protos/blog_pb');
const blogService = require('./protos/blog_grpc_pb');

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

/**
 * Greet many times rpc
 */

function greetManyTimes(call) {
  const count = 0;
  const intervalID = setInterval(() => {
    const firstName = call.request.getGreet().getFirstName();
    const greetManyTimesResponse = new greets.GreetManyTimesResponse();
    greetManyTimesResponse.setResult(firstName);

    // setup streaming
    call.write(greetManyTimesResponse);
    if (++count > 9) {
      clearInterval(intervalID);
    }
    call.end(); // we have sent all the messages.
  }, 1000);
}

/**
 * Blog CRUD
 */
function listBlog(call, callback) {
  console.log('Received list blog request');
  knex('blogs').then((data) => {
    data.forEach((element) => {
      const blog = new blogs.Blog();
      blog.setId(element.id);
      blog.setAuthor(element.author);
      blog.setTitle(element.title);
      blog.setContent(element.content);

      const blogResponse = new blogs.ListBlogResponse();
      blogResponse.setBlog(blog);
      // write to the stream
      call.write(blogResponse);
    });
    call.end();
  });
}

function createBlog(call, callback) {
  console.log('Recieved blog request');

  const blog = call.request.getBlog();
  console.log('Inserting a new blog');

  knex('blogs')
    .insert({
      author: blog.getAuthor(),
      title: blog.getTitle(),
      content: blog.getContent(),
    }).then(() => {
      const id = blog.getId();
      const addedBlog = new blogs.Blog();
      const blogResponse = new blogs.CreateBlogResponse();

      // set the blog response to be returned
      addedBlog.setId(id);
      addedBlog.setAuthor(blog.getAuthor());
      addedBlog.setTitle(blog.getTitle());
      addedBlog.setContent(blog.getContent());
      blogResponse.setBlog(addedBlog);

      callback(null, blogResponse);
    }).catch((error) => {
      console.error(error);
    });
}

function readBlog(call, callback) {
  console.log('get blog request by ID');

  // get id
  const blogId = call.request.getBlogId();

  knex('blogs')
    // eslint-disable-next-line radix
    .where({ id: parseInt(blogId) })
    .then((data) => {
      console.log('searching for blog...');
      if (data.length) {
        const blog = new blogs.Blog();
        console.log('Blog found and sending message');
        // set the blog response to be returned

        blog.setId(blogId);
        blog.setAuthor(data[0].author);
        blog.setTitle(data[0].title);
        blog.setContent(data[0].content);

        const blogResponse = new blogs.ReadBlogResponse();
        blogResponse.setBlog(blog);
        callback(null, blogResponse);
      } else {
        console.log('blog not found');
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'blog not found',
        });
      }
    }).catch((error) => {
      console.error('Error', error.message);
    });
}

function main() {
  const server = new grpc.Server();
  server.addService(service.GreetServiceService, { greet, greetManyTimes });
  server.addService(calcService.CalculatorServiceService, {
    sum,
  });
  server.addService(blogService.BlogServiceService, {
    listBlog,
    createBlog,
    readBlog,
  });


  server.bind('localhost:50051', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('server is running on 50051');
}

main();
