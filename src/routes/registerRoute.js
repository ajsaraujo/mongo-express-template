import { Router } from 'express';
import UserController from '../controllers/UserController';
import emailInUse from '../middlewares/emailInUse';
import validate from '../middlewares/validate';
import { userRules } from '../models/User';
import limitRequests from '../middlewares/limitRequests';

const router = Router();

router.post('/',
    limitRequests.heavily,
    validate(userRules),
    emailInUse,
    UserController.create
);

export default { router, name: '/register' };
