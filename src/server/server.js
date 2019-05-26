

const mode = process.env.NODE_ENV;
const port = process.env.PORT || 3000;
console.log("production", mode);

const fastify = require('fastify')({ logger: mode != "production" });

const path = require('path');
// serves static assets from the `src/ui` folder
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '..','..', 'dist'),
});
fastify.route({
  method: 'GET',
  url: '/api',
  schema: {
    // request needs to have a querystring with a `name` parameter
    querystring: {
      name: { type: 'string' }
    },
    // the response needs to be an object with an `hello` property of type 'string'
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' },
          query: { type: 'string' }
        }
      }
    }
  },
  // this function is executed for every request before the handler is executed
  preHandler: async (request, reply) => {
    // E.g. check authentication
  },
  handler: async (request, reply) => {
    return { hello: 'world' , query : request.query.name };
  }
});

const start = async () => {
  try {
    await fastify.listen(port, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();