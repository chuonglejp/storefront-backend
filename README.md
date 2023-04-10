# Storefront Backend Project

## Installation
#### Docker
- docker-compose up -d

#### Start server
- Rename .envsample to .env, update information inside .env exept BCRYPT_PASSWORD
- npm i
- db-migrate up
- npm start

## Get the JWT
- An user(username: admin, password: 1234) already created. Post request to ```/users/authenticate``` with body ```{ "username": "admin", "password": "1234" }``` to get the JWT

## Route
#### User
- GET   ```/users```                [token required] get all users
- GET   ```/users/:id```            [token required] get an user by id
- POST  ```/users/add```            [token required] add a new user
- POST  ```/users/authenticate```   authentication

#### Product
- GET   ```/products```             get all products
- GET   ```/products/:id```         get a product by id
- POST  ```/products```             [token required] add a new product

#### Order
- POST  ```/orders```               [token required] get the current order
- POST  ```/orders/add-to-cart```   [token required] add a product with quantity to current order
