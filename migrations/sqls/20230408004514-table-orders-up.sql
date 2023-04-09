CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id int,
  status varchar(10)
);