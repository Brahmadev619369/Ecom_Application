const JWT = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization || req.headers.Authorization;
    
    // Ensure the header exists and starts with "Bearer"
    if (authorization && authorization.startsWith("Bearer ")) {
        const token = authorization.split(" ")[1];
        
        // Verify the token
        JWT.verify(token, process.env.SECRETKEY, (err, info) => {
            if (err) {
                return res.status(401).send({ error: "Unauthorized: Invalid token" });
            }
            
            // Attach decoded token info to the request object
            req.user = info;
            next();
        });
    } else {
        // Return error if token is missing or improperly formatted
        return res.status(401).send({ error: "Unauthorized: No token provided" });
    }
};

module.exports = authMiddleware;
