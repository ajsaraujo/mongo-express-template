/* eslint-disable no-underscore-dangle */
import rewire from 'rewire';

function mockReqRes(sandbox) {
    const req = { params: {}, headers: {} };

    const res = {
        status: sandbox.stub().callsFake(() => res),
        json: sandbox.stub().callsFake(returnItself)
    };

    const next = sandbox.stub();

    return { req, res, next };
}

function mockReq() {
    return { params: {}, headers: {} };
}

function mockRes() {
    const Response = class Response {
        status(statusCode) {
            this.status = statusCode;
            return this;
        }

        json(data) {
            this.json = data;
            return this;
        }
    };

    return new Response();
}

function mockNext(sandbox) {
    return sandbox.stub();
}

function getPrivateMethod(modulePath, methodName) {
    const module = rewire(modulePath);

    return module.__get__(methodName);
}

function stubPrivateMethod(sandbox, modulePath, methodName) {
    const module = rewire(modulePath);

    const stub = sandbox.stub();

    module.__set__(methodName, stub);

    return stub;
}

export default { mockReqRes, mockReq, mockRes, mockNext, getPrivateMethod, stubPrivateMethod };
