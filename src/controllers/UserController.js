import { User } from '../models/User';

async function create(req, res) {
    try {
        if (req.emailInUse) {
            return res.status(400).json({ message: `O email ${req.body.email} já está em uso.` });
        }

        const user = await User.create(req.body);

        user.password = undefined;

        return res.status(201).json(user);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

// findByIdAndUpdate não aciona 'save'. Atualizamos e chamamos save manualmente.
async function update(req, res) {
    try {
        const { name, password, email } = req.body;
        const user = await User.findById(req.userId).select('+password');

        if (!user) {
            return res.status(404).json({ message: `Não foi encontrado usuário com o id ${req.userId}` });
        }

        user.name = name;
        user.email = email;
        user.password = password;

        await user.save();

        user.password = undefined;

        return res.status(200).json(user);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function getAll(req, res) {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function getById(req, res) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: `Não há usuário com o id ${req.params.id}.` });
        }

        return res.status(200).json(user);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function remove(req, res) {
    try {
        const user = await User.findByIdAndRemove(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        return res.status(200).json(user);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

export default {
    create,
    update,
    remove,
    getAll,
    getById
};
