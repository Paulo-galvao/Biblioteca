import "dotenv/config";
import jwt from "jsonwebtoken";

async function authorization(req, res, next) {
    try {
        const secretkey = process.env.SECRET_KEY;
        const { authorization } = req.headers;        

        if(!authorization) {
            res.status(401).json({
                success: false,
                message: "Usuário não autorizado" 
            });
        }

        const parts = authorization.split(" ");
        const [schema, token] = parts;

        const decoded = jwt.verify(token, secretkey);
        req.userID = decoded.id;

        return next();

    } catch (error) {
        res.status(401).json(error.message);
    }
}

export default authorization;