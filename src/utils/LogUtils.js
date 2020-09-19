import Log from '../models/Log';
import LogController from '../controllers/LogController';

const logController = new LogController(Log);

async function log(message) {
    if (process.env.NODE_ENV === 'production') {
        await logController.create(message);
    } else {
        console.log(message);
    }
}

export default { log };
