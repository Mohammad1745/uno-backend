const crypto = require('crypto')
const twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const util = require('util')

module.exports = {
    Cards: () => {
        return [
            "0R","1R","1R","2R","2R","3R","3R","4R","4R","5R","5R","6R","6R","7R","7R","8R","8R","9R","9R","sR","sR","rR","rR","dR","dR",
            "0Y","1Y","1Y","2Y","2Y","3Y","3Y","4Y","4Y","5Y","5Y","6Y","6Y","7Y","7Y","8Y","8Y","9Y","9Y","sY","sY","rY","rY","dY","dY",
            "0G","1G","1G","2G","2G","3G","3G","4G","4G","5G","5G","6G","6G","7G","7G","8G","8G","9G","9G","sG","sG","rG","rG","dG","dG",
            "0B","1B","1B","2B","2B","3B","3B","4B","4B","5B","5B","6B","6B","7B","7B","8B","8B","9B","9B","sB","sB","rB","rB","dB","dB",
            "cC","cC","cC","cC","fC","fC","fC","fC"
        ]
    },

    randomNumber : (length = 10) => {
        let response = ''
        for (let i = 0; i < length; i++) {
            let y = Math.random()*100
            response += String(y).substr(String(y).length-1, 1)
        }
        return response;
    }
}