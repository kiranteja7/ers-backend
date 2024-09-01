
import jwt from 'jsonwebtoken';

export const jwtAuth = (req, res, next) =>{

    const token = req.headers['authorization'];

    if(!token){
        return res.status(403).send('Token not provided :)');
    }


    const secretCode = process.env.JWT_SEC;

    try{
        const payload = jwt.verify(token, secretCode);
        req.userID = payload.userID;
    }catch(err){
        return res.status(401).send(err);
    }

    next();
}