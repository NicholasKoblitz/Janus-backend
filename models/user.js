const db = require('../db');
const bcrypt = require('bcrypt');
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require('../config');



class User {

    static async authenticate(username, password) {
        const res = await db.query(
            `SELECT 
            first_name AS "firstName",
            last_name AS "lastName",
            username,
            password,
            is_teacher AS "isTeacher"
            FROM users
            WHERE username = $1`,
            [username]
        );

        const user = res.rows[0];

        if(user) {
            const isValid = await bcrypt.compare(password, user.password);
            if(isValid === true) {
                delete user.password;
                return user;
            }
        }
        throw new UnauthorizedError("Invalid username/password");
    }


    static async register({firstName, lastName, username, password, isTeacher}) {
        const duplicateCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username]
        )

        if(duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`)
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        console.log(firstName, lastName, username, password, isTeacher)

        const res = await db.query(
            `INSERT INTO users 
                (first_name,
                last_name,
                username,
                password,
                is_teacher)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING first_name AS "firstName", last_name AS "lastName", username, is_teacher AS "isTeacher"`,
            [
                firstName,
                lastName,
                username,
                hashedPassword,
                isTeacher
            ]
        );

        const user = res.rows[0];

        return user;
    }


    static async getCoursesByUser(username) {
        const res = await db.query(
            `SELECT 
                c.course_id AS "courseId",
                c.name
            FROM courses c
            JOIN user_courses uc ON c.course_id = uc.course_id
            JOIN users u ON uc.user_id = u.id
            WHERE username = $1`,
            [username]
        )

        const courses = res.rows
        
        return courses
    }

    static async assignUser({username, courseId}) {
        const preCheck1 = await db.query(
            `SELECT course_id
            FROM courses
            WHERE course_id = $1`,
            [courseId]
        )
        const course = preCheck1.rows[0];
        if(!course) throw new NotFoundError(`No course: ${courseId}`)

        const preCheck2 = await db.query(
            `SELECT id, username
             FROM users
             WHERE username = $1`, 
             [username]);

        const user = preCheck2.rows[0];
        if (!user) throw new NotFoundError(`No username: ${username}`);
    
        const res = await db.query(
            `INSERT INTO user_courses (course_id, user_id)
            VALUES ($1, $2)`,
            [courseId, user.id]
        )

        return res.rows[0];
    }
}

module.exports = User;