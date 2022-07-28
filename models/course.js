const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");


class Course {

    static async getAll() {
        const res = await db.query(
            `SELECT 
                course_id AS "courseId",
                name
                FROM courses`
        );

        const courses = res.rows;

        return courses;
    }

    static async getSingleCourse(courseId) {
        const res = await db.query(
            `SELECT 
                course_id AS "courseId",
                name
                FROM courses
                WHERE course_id = $1`,
                [courseId]
        )

        const course = res.rows[0];

        if(!course) throw new NotFoundError(`Course not found: ${courseId}`)

        return course;
    }

    static async createCourse({courseId, name}) {
        
        const res = await db.query(
            `INSERT INTO courses
            (course_id, name)
            VALUES ($1, $2)
            RETURNING course_id AS "courseId", name`,
            [courseId, name]
        );

        const course = res.rows[0];

        return course;
    }


    static async getUsersByCourse(courseId) {
        const res = await db.query(
            `SELECT 
                u.first_name AS "firstName",
                u.last_name As "lastName",
                c.course_id
            FROM users u
            JOIN user_courses  uc ON u.id = uc.user_id
            JOIN courses c ON uc.course_id = c.course_id
            WHERE uc.course_id = $1`,
            [courseId]
        );

        const users = res.rows;

        if(!users) throw new NotFoundError(`No users assigned to ${courseId}`)

        return users;
    }

    static async deleteCourse(courseId) {
        const res = await db.query(
            `DELETE 
            FROM courses
            WHERE course_id = $1
            RETURNING course_id AS "courseId"`,
            [courseId]
        );

        const course = res.rows[0];

        if(!course) throw new NotFoundError(`Course not found: ${courseId}`)
    }
}

module.exports = Course;