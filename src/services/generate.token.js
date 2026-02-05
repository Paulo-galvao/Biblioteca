import jwt from "jsonwebtoken";
import "dotenv/config";

function generateToken(id, email) {
    return jwt.sign(
        {id, email},
        process.env.SECRET_KEY,
        {expiresIn: 86400}
    );
}

export default generateToken;