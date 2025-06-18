CREATE DATABASE IF NOT EXISTS petshop CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE petshop;

CREATE TABLE products (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    type_product ENUM(
        'destacado',
        'nuevo arribo',
        'oferta',
        'mas vendido',
        'Normal'
    ) DEFAULT 'Normal',
    offer_percentage INT DEFAULT 0 CHECK (
        offer_percentage BETWEEN 0 AND 100
    ),
    code VARCHAR(100) NOT NULL,
    stock INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE product_thumbnails (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    url VARCHAR(255),
    public_id VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE carts (id CHAR(36) PRIMARY KEY);

CREATE TABLE wishlists (id CHAR(36) PRIMARY KEY);

CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    image VARCHAR(255),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT,
    cart_id CHAR(36),
    wishlist_id CHAR(36),
    role ENUM('admin', 'usuario', 'cliente') DEFAULT 'cliente',
    gender ENUM('masculino', 'femenino'),
    newsletter ENUM('suscrito', 'no suscrito') DEFAULT 'no suscrito',
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    token_reset_token VARCHAR(255),
    token_reset_expire DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts (id),
    FOREIGN KEY (wishlist_id) REFERENCES wishlists (id)
);

CREATE TABLE cart_products (
    cart_id CHAR(36),
    product_id CHAR(36),
    quantity INT NOT NULL,
    PRIMARY KEY (cart_id, product_id),
    FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE wishlist_products (
    wishlist_id CHAR(36),
    product_id CHAR(36),
    PRIMARY KEY (wishlist_id, product_id),
    FOREIGN KEY (wishlist_id) REFERENCES wishlists (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE tickets_online (
    id CHAR(36) PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    shipping VARCHAR(255) NOT NULL,
    subtotal VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    purchaser_id CHAR(36) NOT NULL,
    cart_id CHAR(36) NOT NULL,
    purchase_datetime DATETIME NOT NULL,
    status ENUM(
        'pagado',
        'cancelado',
        'en proceso'
    ) DEFAULT 'en proceso',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (purchaser_id) REFERENCES users (id),
    FOREIGN KEY (cart_id) REFERENCES carts (id)
);

CREATE TABLE tickets_tienda_fisica (
    id CHAR(36) PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    purchaser_id CHAR(36) NOT NULL,
    purchase_datetime DATETIME NOT NULL,
    status ENUM(
        'pagado',
        'cancelado',
        'en proceso'
    ) DEFAULT 'en proceso',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (purchaser_id) REFERENCES users (id)
);

CREATE TABLE ticket_products (
    ticket_id CHAR(36),
    product_id CHAR(36),
    title VARCHAR(255),
    price DECIMAL(10, 2),
    quantity INT,
    store_type ENUM('online', 'tienda_fisica') NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    PRIMARY KEY (
        ticket_id,
        product_id,
        store_type
    ),
    FOREIGN KEY (ticket_id) REFERENCES tickets_online (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id)
);
