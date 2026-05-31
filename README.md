PharmaCare API
ASP.NET Web API backend for the PharmaCare frontend.

Run
cd backend\PharmaCare.Api
dotnet restore
dotnet run
Endpoints
GET    /api/products       public
GET    /api/products/{id}  public
POST   /api/orders         public checkout
GET    /api/orders         admin only
DELETE /api/orders         admin only
POST   /api/auth/login     admin login
POST   /api/uploads/product-image admin only
POST   /api/products       admin only
PUT    /api/products/{id}  admin only
DELETE /api/products/{id}  admin only
Admin login accepts:

{
  "username": "admin",
  "password": "123456"
}
The backend checks the XAMPP/MySQL PharmaCare database and the login table with columns id, username, and password.

Normal users do not need an account. They can view products and buy from the website. Only the admin logs in, and only admin requests can add, edit, or delete products.

XAMPP tables
Run this SQL in phpMyAdmin for the PharmaCare database:

CREATE TABLE  login (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE  products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(80) NOT NULL,
  img VARCHAR(300) NULL,
  discount TINYINT(1) NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  address VARCHAR(255) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NULL,
  product_name VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_order_items_orders
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE
);
Optional starter data:

INSERT INTO login (username, password)
VALUES ('admin', '123456');

INSERT INTO products (name, price, category, img, discount) VALUES
('Paracetamol', 5.00, 'Medicine', 'images/Paracetamol.jpg', 1),
('Ibuprofen', 8.00, 'Medicine', 'images/Ibuprofen.jpg', 0),
('Vitamin C', 10.00, 'Vitamins', 'images/Vitamin C.jpeg', 1),
('Baby Shampoo', 12.00, 'Baby Products', 'images/BabyShampoo.jpg', 0),
('Multivitamins', 15.00, 'Vitamins', 'images/Multivitamins.jpeg', 0);
The default connection uses XAMPP/MySQL:

Server=localhost;Port=3308;Database=PharmaCare;User=root;Password=;
