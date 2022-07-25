from models import db
from app import app


db.drop_all()
db.create_all()


# DATA_1 = {
#     "first_name": "John",
#     "last_name": "Doe",
#     "username": "blue",
#     "password": "test",
#     "is_teacher": False
# }


# DATA_2 = {
#     "course_id": "BIO223",
#     "name": "Biology",
# }

# DATA_3 = {
#     "user_id": 1,
#     "course_id": "BIO223"
# }


# john = User.signup(**DATA_1)
# bio = Course(**DATA_2)
# many = UserCourse(**DATA_3)


# db.session.add_all([john, bio])
# db.session.commit()
# db.session.add(many)
# db.session.commit()
