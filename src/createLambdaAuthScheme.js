'use strict';

const Boom = require('boom');

const createLambdaAuthScheme = (
  authFun,
  authorizerOptions,
  funName,
  endpointPath,
  options,
  serverlessLog,
  servicePath,
  serverless
) => {

  return () => ({
    authenticate(request, reply) {
      const event = {};
      new AWS.Lambda().invoke({
        FunctionName: authFun,
        InvocationType: 'Event',
        Payload: JSON.stringify(event),
      }, (err, data) => {
        if (err) {
          // handle this
        }
        // Neet to set actual response
        // here...
        reply({ ok: true });
      });
    }
  })
};

module.exports = {
  createLambdaAuthScheme,
};
