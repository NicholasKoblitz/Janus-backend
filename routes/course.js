/** Routes for courses. */
const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrTeacher, ensureTeacher } = require("../middleware/auth");
const newCourseSchema = require('../schemas/newCourseSchema.json');
const { BadRequestError } = require("../expressError");
const Course = require("../models/course");

const router = express.Router();

router.get('/', ensureCorrectUserOrTeacher, async function(req, res, next) {
    try {
        const courses = await Course.getAll();
        return res.json({courses})
    }
    catch (err){
        return next(err);
    }
});

router.get('/:courseId', ensureCorrectUserOrTeacher, async function(req, res, next) {
    try{
        const course = Course.getSingleCourse(req.params.courseId);
        return res.json({course})
    }
    catch(err) {
        return next(err);
    }
})

router.post('/', ensureTeacher, async function(req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, newCourseSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const course = await Course.createCourse(req.body);
        return res.status(201).json({course});
    }
    catch(err) {
        return next(err);
    }
})

router.get('/:courseId/users', ensureCorrectUserOrTeacher, async function(req, res, next){
    try{
        const users = await Course.getUsersByCourse(req.params.courseId);
        return res.json({users})
    }
    catch(err) {
        return next(err);
    }
})

router.delete('/:course_id/remove', ensureTeacher, async function(req, res, next) {
    try {
        const course = await Course.deleteCourse(req.params.course_id);
        return res.json({course})
    }
    catch(err) {
        return next(err);
    }
})

module.exports = router;
