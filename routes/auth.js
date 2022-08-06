/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/token");
const loginUserSchema = require("../schemas/loginUserSchema.json");
const registerUserSchema = require("../schemas/registerUserSchema.json");
const { BadRequestError } = require("../expressError");



router.post('/login', async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, loginUserSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const {username, password} = req.body;
        const user = await User.authenticate(username, password);
        const isTeacher = user.isTeacher;
        const firstName = user.firstName;
        const token = createToken(user);
        return res.json({token, isTeacher, firstName});
    }
    catch (err) {
        return next(err);
    }

});

router.post('/register/student', async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, registerUserSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }   

        const newUser = await User.register({...req.body, isTeacher: false});
        const token = createToken(newUser);
        return res.status(201).json({token});
    }
    catch(errs) {
        return next(errs)
    }
});

router.post('/register/teacher', async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, registerUserSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }   

        const newUser = await User.register({...req.body, isTeacher: true});
        const token = createToken(newUser);
        return res.status(201).json({token});
    }
    catch(errs) {
        return next(errs)
    }
})

module.exports = router;