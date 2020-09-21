import Log from '../models/Log';

class LogController {
    static async create(content) {
        await Log.create({ content });
    }

    static async get(req, res) {
        try {
            const logs = await Log.find();
            return res.status(200).json(logs);
        } catch ({ message }) {
            return res.status(500).json({ message });
        }
    }
}

export default LogController;
