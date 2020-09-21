import { Router } from 'express';
import UserController from '../controllers/UserController';
import { userRules } from '../models/User';
import limitRequests from '../middlewares/limitRequests';
import verifyToken from '../middlewares/verifyToken';
import verifyId from '../middlewares/verifyId';
import validate from '../middlewares/validate';

const router = Router();

router.use(limitRequests.slightly);

router.get('/', UserController.getAll);
router.get('/:id', verifyId, UserController.getById);

router.use(verifyToken);

router.put('/', validate(userRules), UserController.update);
router.delete('/', UserController.remove);

export default { router, name: '/user' };
