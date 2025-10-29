import jwt from "jsonwebtoken";
import "dotenv/config";

function generateToken(id, username) {
    return jwt.sign(
        {id, username},
        process.env.SECRET_KEY,
        {expiresIn: 86400}
    );
}

export default generateToken;