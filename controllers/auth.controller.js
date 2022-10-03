import { User } from '../models/User.js';
import { generateRefreshToken, generateToken } from '../utils/manageToken.js';

export const register = async(req, res) => {
    const { email, password } = req.body;
    
    try {
        let user = await User.findOne({email});
        
        if(user) throw ({code: 1100})
        user = new User({email, password});
        await user.save();
        //Se genera el token JWT

        const {token, expiresTime} = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.status(201).json({token, expiresTime});
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
        const {token, expiresTime} = generateToken(req.uid);
        res.send({token, expiresTime});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Error de servidor'});
    }
}

export const logout = (req, res) => {
    res.clearCookie("refreshToken")
    res.json({ok: true});
}

