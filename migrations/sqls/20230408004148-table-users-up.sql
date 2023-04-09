CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  password text
);

INSERT INTO users(username, first_name, last_name, password)
VALUES ('admin', 'chuong', 'le', '$2b$10$eHWY6aMRi1bvHpr9CDiTBO0uSYMeIQYRMgQkT89/DrUhbJo/4NdsS');