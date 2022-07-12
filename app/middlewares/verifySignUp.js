const db = require('../models')
// const Role = require('../models/role.model')
const ROLES = db.ROLES
const User = db.user

const checkDuplicateUsernameOrEmail = (req, res, next) => {

    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if(err) {
            res.status(500).send({msg: err})
            return
        }

        if(user) {
            res.status(400).send({msg: 'Failed Username is already in use!'})
            return
        }
    })

    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if(err) {
            res.status(500).send({msg: err})
            return
        }

        if(user) {
            res.status(400).send({msg: 'Failed Email is already in use!'})
            return
        }

        next()
    })

}

const checkRolesExisted = (req, res, next) => {
    if(req.body.roles) {
        for(let i = 0; i < req.body.roles; i++) {
            if(!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    msg: `Failed! Role ${req.body.roles[i]} does not exist!`
                })

                return
            }
        }
    }

    next()
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
}

module.exports = verifySignUp

