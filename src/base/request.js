const { body , validationResult} = require('express-validator')
const {wordSplitter} = require('../helper/helper')
const { QueryTypes, Sequelize} = require('sequelize')
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_USER, {dialect:process.env.DB_ENGINE})

//RULES: required|string|number|array|email|unique:TABLE_NAME|regex:/^(1){3}$/|min:NUMBER|max:NUMBER|in:1,2,3|same:FIELD_NAME
class Request {
    constructor(ruleStrings) {
        let validationRules = Object.keys(ruleStrings).map(field => body(field).custom((value, {req}) => this.#setRule(ruleStrings[field], field, value, req)))
        this.validate = [validationRules, this.#validator]
    }

    #setRule = async (ruleString, field, value, req) => {
        const rules = ruleString.split('|')
        let fieldName = wordSplitter(field)
        for (let rule of rules) {
            if (rule==='required' && !value) return Promise.reject(`${fieldName} is required.`)
            else if (rule==='string' && typeof value !== 'string') return Promise.reject(`${fieldName} must be an string.`)
            else if (rule==='number' && isNaN(Number(value))) return Promise.reject(`${fieldName} must be a number.`)
            else if (rule==='array' && !Array.isArray(value)) return Promise.reject(`${fieldName} must be an array.`)
            else if (rule==='email') {
                const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if (!(typeof value === 'string' && regex.test(value))) return Promise.reject(`Invalid ${fieldName}.`)
            }
            else if (rule.startsWith('unique:')) {
                let tableName = rule.split(':')[1]
                const entry = await sequelize.query("SELECT * FROM \""+tableName+"\" WHERE "+field+"='"+value+"'" , { type: QueryTypes.SELECT })
                if (entry[0]) return Promise.reject(`${fieldName} already exists.`)
            }
            else if (rule.startsWith('regex:')) {
                let regString = rule.split(':')[1]
                const regex = new RegExp(regString.substr(1, regString.length-2))
                if (!(typeof value === 'string' && regex.test(value))) return Promise.reject(`Invalid ${fieldName}.`)
            }
            else if (rule.startsWith('min:')) {
                const min = Number(rule.split(':')[1])
                if (value.length<min) return Promise.reject(`${fieldName} must have at least ${min} character`)
            }
            else if (rule.startsWith('max:')) {
                const max = Number(rule.split(':')[1])
                if (value.length>max) return Promise.reject(`${fieldName} must have not more than ${max} character`)
            }
            else if (rule.startsWith('in:')) {
                const choices = rule.split(':')[1].split(',')
                if (!choices.includes(value)) return Promise.reject(`Invalid ${fieldName}.`)
            }
            else if (rule.startsWith('same:')) {
                let target = rule.split(':')[1]
                if (value !== req.body[target]) {
                    target = wordSplitter(target)
                    return Promise.reject(`${fieldName} and ${target} doesn't match.`)
                }
            }
        }
        return Promise.resolve(true)
    }

    #validator = (request, response, next) => {
        const error = validationResult(request)
        if (!error.isEmpty()) {
            const errors = {}
            error.array().map(error => errors[error.param] = error)
            return response.json({
                success: false,
                message: errors
            })
        } else {
            response.clearCookie('errors')
            next()
        }
    }
}
module.exports = Request