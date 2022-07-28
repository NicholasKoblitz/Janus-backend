CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_teacher BOOLEAN NOT NULL DEFAULT FALSE 
);

CREATE TABLE courses (
    course_id TEXT UNIQUE NOT NULL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE user_courses (
    course_id TEXT
        REFERENCES courses ON DELETE CASCADE,
    user_id INTEGER
        REFERENCES users ON DELETE CASCADE,
    PRIMARY KEY (course_id, user_id)
);