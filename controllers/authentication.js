import jwt from "jsonwebtoken";

// Replace this with process.env.JWT_SECRET in production
const SECRET_KEY = "mega";

function authentication(req, res, next) {
    const authHeader = req.headers["authorization"];

    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Access token missing" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        req.user = decoded;

        console.log("Decoded Token:", decoded);

        next(); // Proceed to the next middleware/route
    } catch (err) {
        console.error("JWT Verification Failed:", err.message);
        return res.status(403).json({ success: false, message: "Token is invalid or expired" });
    }
}

export default authentication;
