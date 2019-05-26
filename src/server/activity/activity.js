const url = require('url');
const jwtLib = require('jwt-simple');
module.exports = function (fastify, opts, next) {
  fastify.get('/config.json', (request, reply) => {
    const activityJSON = JSON.stringify(require('./config.json'))
      .replace(/{{ActivityKey}}/g, process.env.ActivityKey)
      .replace(/{{ActivityName}}/g, process.env.ActivityName)
      .replace(/{{EncryptionCustomerKey}}/g, process.env.EncryptionCustomerKey)
      .replace(
        /{{EndPoint}}/g,
        url.format({
          protocol: 'https',
          host: request.hostname,
          slashes: true
        })
      );
    reply.send(JSON.parse(activityJSON));
  });
  fastify.post('/publish',{ preHandler : validate },(request, reply)=>{
    reply.send('OK');
  });
  fastify.post('/validate',{ preHandler : validate },(request, reply)=>{
    reply.send('OK');
  });
  fastify.post('/save',{ preHandler : validate },(request, reply)=>{
    reply.send('OK');
  });
  fastify.get('/login',{ preHandler : validate },(request, reply)=>{
    try {
      const redirectLink = request.body.request.query.deepLink + request.body.request.organization.id;
      console.log('DIRECTING TO ', redirectLink );
      reply.redirect(redirectLink);
    } catch (ex) {
      console.error(ex);
      reply.code(500).send('Redirect Failed');
    }
  } );
  fastify.get('/logout',{ preHandler : validate },(request, reply)=>{
    request.body == {};
    reply.send();
  });
  next();
};

function validate(request, reply, done){
  if(process.env.NODE_ENV == "production" ){
    const jwt = request.body.jwt != undefined ? request.body.jwt : request.body.toString('utf8');
    try {
      request.body = jwtLib.decode(jwt, process.env.appSignatureMC, false, 'HS256');
    } catch (ex) {
      console.error('Decoding failed for jwt: ' + jwt);
      console.error('Exception: ' + ex);
      return reply.code(401).send(ex);
    }
  } 
  done();
}