CREATE TABLE order_details (
  id SERIAL PRIMARY KEY,
  order_id int,
  product_id int,
  quantity int
);