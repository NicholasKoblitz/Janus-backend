/** Routes for users. */
const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrTeacher, ensureTeacher } = require("../middleware/auth");
const assignUserSchema = require('../schemas/assignUserSchema.json');
const { BadRequestError } = require("../expressError");
const User = require("../models/user");

const router = express.Router();


router.get('/:username/courses', ensureCorrectUserOrTeacher,async function(req, res, next) {
    try{
        
        const courses = await User.getCoursesByUser(req.params.username);
        return res.json({courses})
    }
    catch (err) {
        return next(err)
    }
});

router.post('/assign', ensureCorrectUserOrTeacher, async function(req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, assignUserSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const assignedUser = await User.assignUser(req.body);
        return res.status(201).json({assignedUser});
    }
    catch(err) {
        return next(err);
    }
})

module.exports = router;
