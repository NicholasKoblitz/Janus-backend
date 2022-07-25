from ctypes.wintypes import INT
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
bcrypt = Bcrypt()


def connect_db(app):
    db.app = app
    db.init_app(app)


class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    username = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)
    is_teacher = db.Column(db.Boolean, nullable=False, default=False)

    courses = db.relationship(
        "Course", secondary="user_course", backref="users")

    # user_course = db.relationship("UserCourse", backref="users")

    @classmethod
    def signup(cls, first_name, last_name, username, password, is_teacher):
        """Signs up the user"""

        hashed_password = bcrypt.generate_password_hash(
            password).decode("utf-8")

        user = User(
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=hashed_password,
            is_teacher=is_teacher,
        )

        db.session.add(user)
        return user

    @classmethod
    def authenticate(cls, username, password):

        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False


class Course(db.Model):

    __tablename__ = "courses"

    course_id = db.Column(db.Text, nullable=False,
                          primary_key=True, unique=True)
    name = db.Column(db.Text, nullable=False)


class UserCourse(db.Model):

    __tablename__ = "user_course"

    user_id = db.Column(db.Integer, db.ForeignKey(
        "users.id", ondelete="cascade"), primary_key=True)
    course_id = db.Column(db.Text, db.ForeignKey(
        "courses.course_id", ondelete="cascade"), primary_key=True)


def serialize_user(user):

    return {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
        "password": user.password,
        "is_teacher": user.is_teacher
    }


def serialize_course(course):
    return {
        "course_id": course.course_id,
        "name": course.name
    }


def serialize_user_course(user_course):
    return {
        "user_id": user_course.user_id,
        "course_id": user_course.course_id
    }
