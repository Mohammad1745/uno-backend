module.exports = {
    verified : (req, res, next) => {
        if (!(req.user && req.user.isPhoneVerified)) {
            res.json({
                success: false,
                message: 'Phone is not verified'
            })
        }
        next()
    }
}