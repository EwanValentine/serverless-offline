'use strict';

const Boom = require('boom');
const AWS = require('aws-sdk');
const utils = require('./utils');

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
      const { req } = request.raw;
      const pathParams = {};
      Object.keys(request.params).forEach(key => {
        pathParams[key] = encodeURIComponent(request.params[key]);
      });
      const event = {
        type: 'REQUEST',
        path: request.path,
        httpMethod: request.method.toUpperCase(),
        headers: Object.assign(request.headers, utils.capitalizeKeys(request.headers)),
        pathParameters: utils.nullIfEmpty(pathParams),
        queryStringParameters: utils.nullIfEmpty(request.query),
      };
      new AWS.Lambda().invoke({
        FunctionName: authFun,
        InvocationType: 'Event',
        Payload: JSON.stringify(event),
      }, (err, data) => {
        if (err) return reply(Boom.unauthorized('Unauthorised response from lambda'));
        const { policy } = JSON.parse(data);
        if (!policy.principalId) {
          serverlessLog(`Authorization response did not include a principalId: (λ: ${authFunName})`, err);
          return reply(Boom.forbidden('No principalId set on the Response'));
        }
        return reply.continue({ credentials: { user: policy.principalId, context: policy.context, usageIdentifierKey: policy.usageIdentifierKey } });
      });
    }
  })
};

module.exports = {
  createLambdaAuthScheme,
};
