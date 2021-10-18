import jwt from "jsonwebtoken"

export default async (req, res, next) => {
    let jwtString = req.headers['authorization'];

    try {
        if (typeof jwtString === 'undefined') {
            res.status(403).json({error: 'No authorizationCode provided'})
        }
        const bearer = jwtString.split(' ');
        const payload = await jwt.verify(bearer[1], process.env.JWT_SECRET);
        if (payload) {
            req.user = payload;
            next()
        }
    } catch (err) {
        next(err)
    }

}
