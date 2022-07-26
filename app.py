from crypt import methods
import os
from flask import Flask, make_response, request, jsonify, Response
from models import db, connect_db, User, Course, UserCourse, serialize_course, serialize_user, serialize_user_course
# from Flask_Cors import CORS


app = Flask(__name__)
# CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgresql:///janus'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get(
    'SECRET_KEY', "kdkkdiieiei1242easndado")

connect_db(app)


@app.route('/api/register', methods=["POST"])
def register_user():
    """Creates a new user"""

    first_name = request.json["first_name"]
    last_name = request.json["last_name"]
    username = request.json["username"]
    password = request.json["password"]
    is_teacher = request.json["is_teacher"]

    user = User.signup(first_name, last_name, username,
                       password, is_teacher)

    db.session.commit()

    serialized_user = serialize_user(user)

    return (jsonify(user=serialized_user), 201)


@app.route('/api/login', methods=["POST"])
def login():
    """Checks user is in database"""

    username = request.json['username']
    password = request.json["password"]

    user = User.authenticate(username, password)

    serialized_user = serialize_user(user)

    return (jsonify(user=serialized_user), 200)


@app.route('/api/courses')
def get_all_courses():
    """Gets list of all courses"""

    courses = Course.query.all()

    serialized_courses = [serialize_course(course) for course in courses]

    return (jsonify(courses=serialized_courses), 200)


@app.route('/api/courses/<course_id>')
def get_course(course_id):
    """Get a single course"""

    course = Course.query.get_or_404(course_id)

    serialized_course = serialize_course(course)

    return (jsonify(course=serialized_course), 200)


@app.route('/api/courses', methods=["POST"])
def create_course():
    """Adds a course"""

    course_id = request.json["course_id"]
    name = request.json["name"]

    course = Course(course_id=course_id, name=name)

    db.session.add(course)
    db.session.commit()

    serialized_course = serialize_course(course)

    return (jsonify(course=serialized_course), 201)


@app.route('/api/courses/<course_id>/users')
def get_students_for_course(course_id):
    """Get students based on course"""

    course = Course.query.get_or_404(course_id)

    serialized_users = [serialize_user(user) for user in course.users]

    return (jsonify(users=serialized_users), 200)


@app.route('/api/users/<int:user_id>/courses')
def get_courses_by_student(user_id):
    """Get courses based on a student"""

    user_id = int(user_id)
    user = User.query.get_or_404(user_id)

    serialized_courses = [serialize_course(course) for course in user.courses]

    return (jsonify(courses=serialized_courses), 200)


@app.route('/api/users/assign', methods=["POST"])
def assign_student_to_course():
    """Assigns a student to a course"""

    username = request.json["username"]
    course_id = request.json["course_id"]

    user = User.query.filter_by(username=username).first()
    course = Course.query.filter_by(course_id=course_id).first()

    assigned_student = UserCourse(
        user_id=user.id, course_id=course.course_id)

    db.session.add(assigned_student)
    db.session.commit()

    serialized_student = serialize_user_course(assigned_student)

    return (jsonify(assigned=serialized_student), 201)


@app.route('/api/courses/<course_id>/remove', methods=["DELETE"])
def remove_course(course_id):
    """Deletes the selected course"""

    course = Course.query.get_or_404(course_id)
    message = {
        message: "Deleted"
    }

    db.session.delete(course)
    db.session.commit()

    return (jsonify(message=message), 200)
