import emailInUse from '../../../src/middlewares/emailInUse';
import { User } from '../../../src/models/User';

describe('emailInUse', () => {
    let req;
    let res;
    let next;
    let sandbox;
    let findStub;

    beforeEach(() => {
        sandbox = createSandbox();
        const mocks = TestUtils.mockReqRes(sandbox);

        req = mocks.req;
        res = mocks.res;
        next = mocks.next;

        req.body = { email: 'silviosantos@softeam.com.br' };

        findStub = sandbox.stub(User, 'findOne');
    });

    it('should find a user by email', async () => {
        await emailInUse(req, res, next);

        expect(findStub.calledWith({ email: req.body.email })).to.be.true;
    });

    it('should mark emailInUse as false if user is not found', async () => {
        findStub.resolves(null);

        await emailInUse(req, res, next);

        expect(req.emailInUse).to.be.false;
    });

    it('should mark emailInUse as true if user is found', async () => {
        const user = new User({
            name: 'Mize Ravi',
            email: 'mizeraviacerto@softeam.com.br',
            password: 'melancia'
        });

        findStub.resolves(user);

        await emailInUse(req, res, next);

        expect(req.emailInUse).to.be.true;
    });

    afterEach(() => {
        sandbox.restore();
    });
});