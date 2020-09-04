import jwt from 'jsonwebtoken';
import { promisify } from 'util';

function isMalformed(type, token) {
    if (!type || !token) {
        return true;
    }

    if (type !== 'Bearer') {
        return true;
    }

    return false;
}

async function verifyToken(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ message: 'Nenhum token foi providenciado.' });
    }

    const [type, token] = header.split(' ');

    if (isMalformed(type, token)) {
        return res.status(401).json({ message: 'Token inválido.' });
    }

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
        req.userId = decoded.id;

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
}

export default verifyToken;