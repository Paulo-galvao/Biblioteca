import jwt from "jsonwebtoken";
import "dotenv/config";

function generateToken(id, name) {
    return jwt.sign(
        {id, name},
        process.env.SECRET_KEY,
        {expiresIn: 86400}
    );
}

export default generateToken;