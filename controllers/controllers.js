import jwt from "jsonwebtoken"
import jsonpatch from "json-patch"
import download from "image-downloader"
import resizeImg from "resize-img"
import path from "path";
import fs from "fs";

export function health(req, res) {
    res.status(200).json({
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
    res.status(200).json({ accessToken: token }).status(200)
}

export async function jsonPatchHandler(req, res, next) {
    let { jsonObject, jsonPatch} = req.body
    jsonpatch.apply(jsonObject, jsonPatch)
    res.status(200).json({
        patch: jsonObject
    })
}

export async function imageHandler(req, res, next) {
    let extension = path.extname(req.body.url);
    const options = {
        url: req.body.url,
        dest: './public/images/'
    };
    try {
        if (extension === '.jpg' || extension === '.png' || extension === '.jpeg' || extension === '.bmp') {
            const filename = await download.image(options);
            console.log('filename',filename.filename);
            let fName = path.basename(`${filename.filename}`);
            console.log('fName', fName)
            const image = await resizeImg(fs.readFileSync(filename.filename), {
                width: 50, height: 50
            });
            fs.writeFileSync(`./public/images/thumbnails/${fName}`, image);
            res.status(200).json({
                message : "Successfully saved"
            });
        } else {
            res.status(403)
            res.json({
                message: "Invalid image extension"
            })
        }
    } catch (err) {
        next(err)
    }
}
