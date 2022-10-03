import jwt from 'jsonwebtoken';
import { tokenVerificationErrors } from '../utils/manageToken.js';

export const requireToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;
        if(!token) throw new Error('No existe el token en el header');
        
        token = token.split(" ")[1]; 

        const {uid} = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({error: tokenVerificationErrors[error.message] || error.message });
    }
}