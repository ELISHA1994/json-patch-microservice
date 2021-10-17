import jwt from "jsonwebtoken"
import jsonpatch from "json-patch"

export function health(req, res) {
    res.json({
        message: 'Welcome to the json patch microservice API'
    })
}

export async function login(req, res, next) {
    const user = {
        username : req.body.username,
        password : req.body.password
    };
    const secret = process.env.JWT_SECRET
    const token = jwt.sign(user, secret, { expiresIn: 86400 })
    res.json({ accessToken: token }).status(200)
}

export async function jsonPatchHandler(req, res, next) {
    let { jsonObject, jsonPatch} = req.body
    jsonpatch.apply(jsonObject, jsonPatch)
    res.json({
        patch: jsonObject
    }).status(200)
}
