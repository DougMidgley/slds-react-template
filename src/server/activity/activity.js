const url = require('url');
const jwtLib = require('jwt-simple');
const fetch = require("node-fetch");
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
  fastify.get('/login',(request, reply)=>{

    getUserInfo();


    const clientId = '93m1a6r5pqy1vthgxr5e9wrc';
    const url = 'https://sfmc-template.herokuapp.com/activity/oauth2';
    // const redirectLink = 'https://mc7t1g5l24q50klr8c1gqkvj63d1.auth.marketingcloudapis.com/v2/authorize?response_type=code&client_id=' + clientId +'&redirect_uri='+encodeURIComponent(url);
    const redirectLink = 'https://sfmc-template.herokuapp.com/#/Activity';
    reply.redirect(redirectLink);
  });
  fastify.get('/oauth2',(request, reply)=>{
    console.log('BODY', JSON.stringify(request.body));
    console.log('QUERY', JSON.stringify(request.query));
    reply.send('OK');
  });
  next();
};

function validate(request, reply, done){
  if(process.env.NODE_ENV == "production" && request.body){
    console.log('JWT DECODING', JSON.stringify(request.body));
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


const getUserInfo = async () => {
  try {
    const url = "https://mc7t1g5l24q50klr8c1gqkvj63d1.auth.marketingcloudapis.com/v2/userinfo";
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log(error);
  }
};