const crypto = require('crypto')
const twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const util = require('util')

module.exports = {
    roles : input => {
        let output = {
            ADMIN_ROLE: 'Admin',
            USER_ROLE: 'User'
            //...
        }
        return input ? output[input] : output;
    },
    userRoles : input => {
        let output = {
            USER_ROLE: 'User'
            //...
        }
        return input ? output[input] : output;
    },

    avatarPath: () => 'public/uploads/avatar/',
    avatarViewPath: () => '/uploads/avatar/',

    uploadFile: async (directory, fieldName, filter, request, response) => {
        let result = {}
        let upload = multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => cb(null, directory),
                // By default, multer removes file extensions so let's add them back
                filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }),
            fileFilter: filter,
        }).single(fieldName)
        upload = util.promisify(upload)
        try {
            console.log(request.file)
            await upload(request, response)
            result.fileName = request.file.filename
        } catch (err) {
            if (request.fileValidationError)  result.err = request.fileValidationError
            else if (!request.file)  result.err = 'Please select an image to upload'
            else if (err instanceof multer.MulterError)  result.err = err
            else if (err)  result.err = err
        }
        return result
    },
    deleteFile: (directory, filename) => {
        fs.unlinkSync(directory+filename)
    },

    imageFilter : (req, file, cb) => {
        // Accept images only
        if (!path.extname(file.originalname).match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    docFilter : (req, file, cb) => {
        // Accept images only
        if (!path.extname(file.originalname).match(/\.(pdf|PDF|doc|DOC|docx|DOCX)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },

    sendMessage: (toNumber, message, successCallback, errorCallback) => {
        twilioClient.messages.create({
            to: toNumber,
            from: process.env.TWILIO_NUMBER,
            body: message,
        }).then(function() {
            successCallback()
        }).catch(function(err) {
            errorCallback(err)
        })
    },

    randomNumber : (length = 10) => {
        let response = ''
        for (let i = 0; i < length; i++) {
            let y = Math.random()*100
            response += String(y).substr(String(y).length-1, 1)
        }
        return response;
    },

    makeHash : (secret,data) =>  crypto.createHash('sha256').update(secret+data).digest('base64'),

    wordSplitter: string => {
        string.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                let worldPieces = string.split(char)
                string = worldPieces[0] + " " + char + worldPieces[1]
            }
        })
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
}