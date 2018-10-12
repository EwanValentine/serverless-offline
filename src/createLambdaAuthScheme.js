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
  let identityHeader = 'authorization';
  return () => ({
    authenticate(request, reply) {
      const event = {};
      const { req } = request.raw;
      const pathParams = {};
      Object.keys(request.params).forEach(key => {
        pathParams[key] = encodeURIComponent(request.params[key]);
      });
      let event, handler;

      new AWS.Lambda().invoke({
        FunctionName: authFun,
        InvocationType: 'Event',
        Payload: JSON.stringify(event),
      }, (err, data) => {
        if (err) {
          // handle this
        }
        const res = JSON.parse(data);
        console.log(res);
        // Neet to set actual response
        // here...
        return reply.continue({ credentials: { user: policy.principalId, context: policy.context, usageIdentifierKey: policy.usageIdentifierKey } });
      });
    }
  })
};

module.exports = {
  createLambdaAuthScheme,
};
