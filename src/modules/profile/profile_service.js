const ResponseService = require('../../base/response_service')
const {User} = require('../../models')
const {imageFilter, uploadFile, avatarPath, deleteFile} = require('../../helper/helper')

class ProfileService extends ResponseService {

    /**
     * UserService constructor.
     */
    constructor() {
        super()
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    profile = async request => {
        try {
            const user = await User.findOne({where:{id:request.user.id}, attributes:['id','firstName', 'lastName', 'email','phoneCode', 'phone', 'image']})
            const {id, firstName, lastName, email,phoneCode, phone} = user
            const image = user.image
            return this.response( {id, firstName, lastName, email,phoneCode, phone, image}).success()
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    updateInfo = async request => {
        try {
            let user = await User.findOne({where:{id: request.user.id}})
            if (!user) {
                return this.response().error('User Doesn\'t Exist')
            }
            await User.update(this._userDataFormatter(request.body), {where: {id: user.id}})

            return this.response().success(`Profile updated successfully.`)
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    _userDataFormatter = data => {
        return data ?
            {
                firstName: data.firstName,
                lastName: data.lastName
                // email: data.email,
                // phoneCode: data.phoneCode,
                // phone: data.phone,
            }
            : {}
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {Object}
     */
    uploadImage = async (request, response) => {
        try {
            let image = await uploadFile(avatarPath(), 'image', imageFilter, request, response)
            if (image.err) {
                return this.response().error(image.err)
            }
            let user = await User.findOne({where: {id: request.user.id}})
            if (user.image) deleteFile(avatarPath(), user.image)
            await User.update( {image:image.fileName}, {where: {id:request.user.id}})

            return this.response({image:image.fileName}).success("Profile Picture updated successfully")
        } catch (e) {
            return this.response().error(e.message)
        }
    }
}

module.exports = ProfileService