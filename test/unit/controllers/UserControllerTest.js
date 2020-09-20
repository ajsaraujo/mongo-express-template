import { expect } from 'chai';
import UserController from '../../../src/controllers/UserController';

describe('UserController', () => {
    let sandbox;
    let req;
    let res;
    let User;
    let userController;

    beforeEach(() => {
        sandbox = createSandbox();

        User = {};
        userController = new UserController(User);

        req = TestUtils.mockReq();
        res = TestUtils.mockRes();
    });

    describe('create()', () => {
        beforeEach(() => {
            User.create = sandbox.stub();

            req.body = {
                name: 'Sófocles Teamildo',
                email: 'softeam@softeam.com.br',
                password: 'cabecadegelo'
            };

            req.emailInUse = false;
        });

        it('should return 400 if email is already in use', async () => {
            req.emailInUse = true;

            const { status, json } = await userController.create(req, res);

            expect(status).to.equal(400);
            expect(json).to.deep.equal({ message: 'O email softeam@softeam.com.br já está em uso.' });
        });

        it('should return 200 and create user', async () => {
            User.create.callsFake(returnItself);

            const { status, json } = await userController.create(req, res);

            expect(User.create.calledWith(req.body)).to.be.true;
            expect(status).to.equal(201);
            expect(json).to.deep.equal(req.body);
        });

        it('should not return the user password', async () => {
            User.create.callsFake(returnItself);

            const { json } = await userController.create(req, res);

            expect(json.password).to.be.undefined;
        });

        it('should return 500 if an error is thrown', async () => {
            User.create.rejects({ message: 'Erro ao criar usuário' });

            const { status, json } = await userController.create(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Erro ao criar usuário' });
        });
    });

    describe('update()', () => {
        beforeEach(() => {
            User.findById = sandbox.stub();
            req.userId = '123456789000';

            req.body = {
                name: 'Sófocles Teamildo Espírito Januário Cruz',
                password: 'asenhasecreta',
                email: 'softeam@softeam.com.br'
            };
        });

        it('should return 404 if user was not found', async () => {
            User.findById.returns({ select: () => null });

            const { status, json } = await userController.update(req, res);

            expect(status).to.equal(404);
            expect(json).to.deep.equal({ message: `Não foi encontrado usuário com o id ${req.userId}` });
        });

        // Consertar esse teste quando for remover DI
        it.skip('should return 200 and update user data', async () => {
            const user = { save: sandbox.spy() };
            User.findById.returns({ select: () => user });

            const { status, json } = await userController.update(req, res);

            const { email, name } = req.body;

            expect(User.findById.calledWith(req.userId));
            expect(user.name).to.equal(name);
            expect(user.email).to.equal(email);
            expect(user.password).to.be.undefined;
            expect(user.save.calledOnce).to.be.true;
            expect(status).to.equal(200);
            expect(json).to.deep.equal(user);
        });

        it('should return 500 if an error is thrown', async () => {
            User.findById.returns({
                select: () => {
                    throw new Error('Erro ao buscar usuário');
                }
            });

            const { status, json } = await userController.update(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Erro ao buscar usuário' });
        });
    });

    describe('getAll()', () => {
        beforeEach(() => {
            User.find = sandbox.stub();
        });

        it('should return 200 and a list of users', async () => {
            const users = [{
                name: 'Jonas Lima',
                email: 'jonaslima@softeam.com.br',
                password: 'designehminhapaixao'
            }, {
                name: 'Yves Bastos',
                email: 'yvesbastos@softeam.com.br',
                password: 'acabecadopovo'
            }];

            User.find.resolves(users);

            const { status, json } = await userController.getAll(req, res);

            expect(status).to.equal(200);
            expect(json).to.deep.equal(users);
        });

        it('should return 500 if an error is thrown', async () => {
            User.find.rejects({ message: 'A busca falhou' });

            const { status, json } = await userController.getAll(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'A busca falhou' });
        });
    });

    describe('getById()', async () => {
        beforeEach(() => {
            User.findById = sandbox.stub();
            req.params.id = '123456789000';
        });

        it('should return 404 if user is not found', async () => {
            User.findById.resolves(null);

            const { status, json } = await userController.getById(req, res);

            expect(status).to.equal(404);
            expect(json).to.deep.equal({ message: `Não há usuário com o id ${req.params.id}.` });
        });

        it('should return 200 and user', async () => {
            const user = {
                name: 'Zé da Onça',
                email: 'zedaonca@softeam.com.br',
                password: 'graaaaawrlllllnhaaauw'
            };

            User.findById.resolves(user);

            const { status, json } = await userController.getById(req, res);

            expect(status).to.equal(200);
            expect(json).to.deep.equal(user);
        });

        it('should return 500 if an error is thrown', async () => {
            User.findById.rejects({ message: 'Usuário não encontrado' });

            const { status, json } = await userController.getById(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Usuário não encontrado' });
        });
    });

    describe('remove()', () => {
        beforeEach(() => {
            req.userId = '123456789000';
            User.findByIdAndRemove = sandbox.stub();
        });

        it('should return 404 if user was not found', async () => {
            User.findByIdAndRemove.resolves(null);

            const { status, json } = await userController.remove(req, res);

            expect(status).to.equal(404);
            expect(json).to.deep.equal({ message: 'Usuário não encontrado.' });
        });

        it('should return 200 and delete the user with the given id', async () => {
            const user = {
                name: 'Mor Tod Asilva',
                email: 'mortodasilva@softeam.com.br',
                password: 'senhaencriptada'
            };

            User.findByIdAndRemove.resolves(user);

            const { status, json } = await userController.remove(req, res);

            expect(User.findByIdAndRemove.calledWith(req.userId)).to.be.true;
            expect(status).to.equal(200);
            expect(json).to.deep.equal(user);
        });

        it('should return 500 if an error is thrown', async () => {
            User.findByIdAndRemove.rejects({ message: 'Não deu pra deletar =/' });

            const { status, json } = await userController.remove(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Não deu pra deletar =/' });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
