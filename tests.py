from unittest import TestCase
from app import app
from models import db, User, Course, UserCourse


# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///janus_test'
app.config['SQLALCHEMY_ECHO'] = False

# Make Flask errors be real errors, rather than HTML pages with error info
app.config['TESTING'] = True

db.drop_all()
db.create_all()

DATA_1 = {
    "first_name": "John",
    "last_name": "Doe",
    "username": "blue",
    "password": "test",
    "is_teacher": False
}

DATA_1_2 = {
    "first_name": "Jane",
    "last_name": "Doe",
    "username": "green",
    "password": "test",
    "is_teacher": True
}

DATA_2 = {
    "course_id": "BIO223",
    "name": "Biology",
}

DATA_2_2 = {
    "course_id": "MAT101",
    "name": "Math"
}


class RoutesTests(TestCase):

    def setUp(self):

        User.query.delete()
        Course.query.delete()
        UserCourse.query.delete()

        john = User.signup(**DATA_1)
        bio = Course(**DATA_2)

        db.session.add_all([john, bio])
        db.session.commit()

        self.john = john
        self.bio = bio

        many = UserCourse(user_id=self.john.id, course_id=self.bio.course_id)

        db.session.add(many)
        db.session.commit()

        self.many = many

    def tearDown(self):
        """Clean up fouled transactions."""

        db.session.rollback()

    def test_user_register(self):
        with app.test_client() as c:
            resp = c.post("/api/register", json=DATA_1_2)

            self.assertEqual(resp.status_code, 201)

            data = resp.json

            self.assertEqual(data, {
                "user": {
                    "first_name": "Jane",
                    "last_name": "Doe",
                    "username": "green",
                    "password": data['user']['password'],
                    "is_teacher": True
                }
            })
            self.assertEqual(User.query.count(), 2)

    def test_user_login(self):
        with app.test_client() as c:
            resp = c.get(
                "/api/login", json={
                    "username": "blue",         "password": "test"
                })

            self.assertEqual(resp.status_code, 200)

            data = resp.json

            self.assertEqual(data, {
                "user": {
                    "first_name": "John",
                    "last_name": "Doe",
                    "username": "blue",
                    "password": self.john.password,
                    "is_teacher": False
                }
            })

    def test_get_All_courses(self):
        with app.test_client() as c:
            resp = c.get('/api/courses')

            data = resp.json

            self.assertEqual(resp.status_code, 200)

            self.assertEqual(data, {
                "courses": [{
                    "course_id": self.bio.course_id,
                    "name": self.bio.name
                }]
            })

    def test_get_single_course(self):
        with app.test_client() as c:
            resp = c.get("/api/courses/BIO223")

            data = resp.json

            self.assertEqual(resp.status_code, 200)

            self.assertEqual(data, {
                "course": {
                    "course_id": self.bio.course_id,
                    "name": self.bio.name
                }
            })

    def test_create_course(self):
        with app.test_client() as c:
            resp = c.post('/api/courses', json=DATA_2_2)

        data = resp.json

        self.assertEqual(resp.status_code, 201)

        self.assertEqual(data, {
            "course": {
                "course_id": "MAT101",
                "name": "Math"
            }
        })

    def test_get_users_by_course(self):
        with app.test_client() as c:
            resp = c.get("/api/courses/BIO223/users")

            data = resp.json

            self.assertEqual(resp.status_code, 200)

            self.assertEqual(data, {
                "users": [{
                    "first_name": "John",
                    "last_name": "Doe",
                    "username": "blue",
                    "password": self.john.password,
                    "is_teacher": False
                }]
            })

    def test_get_courses_by_user(self):
        with app.test_client() as c:
            resp = c.get(f'/api/users/{self.john.id}/courses')

            data = resp.json

            self.assertEqual(resp.status_code, 200)

            self.assertEqual(data, {
                "courses": [
                    {
                        "course_id": "BIO223",
                        "name": "Biology",
                    }
                ]
            })

    def test_assign_user_to_course(self):
        with app.test_client() as c:

            jan = User.signup(**DATA_1_2)

            resp = c.post('/api/users/assign',
                          json={"username": "green", "course_id": "BIO223"})

            data = resp.json

            self.assertEqual(resp.status_code, 201)

            self.assertEqual(data, {
                "assigned": {
                    "user_id": jan.id,
                    "course_id": "BIO223"
                }
            })
