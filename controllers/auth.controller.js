import { User } from '../models/User.js';
import { generateRefreshToken, generateToken } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

export const register = async(req, res) => {
    const { email, password } = req.body;
    
    try {
        let user = await User.findOne({email});
        
        if(user) throw ({code: 1100})
        user = new User({email, password});
        await user.save();

        return res.status(201).json({ok: true});
    } catch (error) {
        if(error.code === 1100){
            console.log(error);
            return res.status(400).json({error: 'Ya existe este usuario'});
        }

        return res.status(500).json({error: "Algo falló en el servidor"})
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({email});
        if(!user) return res.status(403).json({error: 'No existe el usuario'});

        const respuestaPassword = await user.comparePassword(password);
        if(!respuestaPassword) return res.status(403).json({error: 'Credenciales incorrectas'});
        
        //Se genera el token JWT

        const {token, expiresTime} = generateToken(user.id);

        generateRefreshToken(user.id, res);

        res.send({token, expiresTime});
    } catch (error) {
        console.log(error);
    }
}

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean();
        res.json({email: user.email});    
    } catch (error) {
        return res.status(500).json({error: 'Error de servidor'});
    }
}

export const refreshToken = (req, res) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken
        if(!token) throw new Error("No existe el token");

        const {uid} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);            

        const {token, expiresTime} = generateToken(uid);
        res.send({token, expiresTime});
    } catch (error) {
        console.log(error);
        const tokenVerificationErrors = {
            "invalid signature": "La firma del JWT no es valida",
            "jwt expired": "JWT expirado",
            "invalid token": "Token no valido",
            "No Bearer": "Utiliza formato Bearer",
            "jwt malformed": "JWT formato no valido"
        }
        return res.status(401).send({error: tokenVerificationErrors[error.message]});
    }
}

export const logout = (req, res) => {
    res.clearCookie("refreshToken")
    res.json({ok: true});
}

