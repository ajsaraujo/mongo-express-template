import { expect } from 'chai';
import LogController from '../../../src/controllers/LogController';
import TestUtils from '../TestUtils';

describe('LogController', () => {
    let Log;
    let logController;
    let sandbox;

    beforeEach(() => {
        sandbox = createSandbox();
        Log = { create: sandbox.stub(), find: sandbox.stub() };
        logController = new LogController(Log);
    });

    describe('create()', () => {
        it('should create a Log with the given content', async () => {
            await logController.create('O servidor papocou');

            expect(Log.create.calledWith({ content: 'O servidor papocou' })).to.be.true;
        });
    });

    describe('get()', () => {
        let req;
        let res;

        beforeEach(() => {
            req = TestUtils.mockReq();
            res = TestUtils.mockRes();
        });

        it('should return 200 and find all logs', async () => {
            const logs = [{ content: 'O servidor papocou' }, { content: 'Eh resenha soh kkk' }];

            Log.find.resolves(logs);

            const { status, json } = await logController.get(req, res);

            expect(Log.find.getCall(0).args.length).to.equal(0);
            expect(status).to.equal(200);
            expect(json).to.deep.equal(logs);
        });

        it('should return 500 if an error is thrown', async () => {
            Log.find.rejects({ message: 'Rapaz tá tudo pegando fogo' });

            const { status, json } = await logController.get(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Rapaz tá tudo pegando fogo' });
        });
    });

    afterEach(() => sandbox.restore());
});
