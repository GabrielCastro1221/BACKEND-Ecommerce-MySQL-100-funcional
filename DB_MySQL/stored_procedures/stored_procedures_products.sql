USE petshop;

DELIMITER / /

CREATE PROCEDURE create_product (
    IN p_id CHAR(36),
    IN p_code CHAR(36),
    IN p_title VARCHAR(255),
    IN p_price DECIMAL(10,2),
    IN p_description TEXT,
    IN p_image VARCHAR(255),
    IN p_type_product ENUM('destacado', 'nuevo arribo', 'oferta', 'mas vendido', 'Normal'),
    IN p_offer_percentage INT,
    IN p_stock INT,
    IN p_category VARCHAR(100),
    IN p_brand VARCHAR(100)
)
BEGIN
    IF p_title IS NULL OR p_price IS NULL OR p_description IS NULL OR p_stock IS NULL OR p_category IS NULL OR p_brand IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Todos los campos obligatorios deben ser proporcionados';
    END IF;

    INSERT INTO products (
        id, title, price, description, image, type_product,
        offer_percentage, code, stock, category, brand
    ) VALUES (
        p_id, p_title, p_price, p_description, p_image,
        p_type_product, p_offer_percentage, p_code, p_stock, p_category, p_brand
    );
END;
//

CREATE PROCEDURE get_product_by_id(IN p_id CHAR(36))
BEGIN
    SELECT * FROM products WHERE id = p_id;
END;
//

CREATE PROCEDURE delete_product(IN p_id CHAR(36))
BEGIN
    DELETE FROM product_thumbnails WHERE product_id = p_id;
    DELETE FROM products WHERE id = p_id;
END;
//

CREATE PROCEDURE update_product(
    IN p_id CHAR(36),
    IN p_title VARCHAR(255),
    IN p_price DECIMAL(10,2),
    IN p_description TEXT,
    IN p_image VARCHAR(255),
    IN p_type_product ENUM('destacado', 'nuevo arribo', 'oferta', 'mas vendido', 'Normal'),
    IN p_offer_percentage INT,
    IN p_stock INT,
    IN p_category VARCHAR(100),
    IN p_brand VARCHAR(100)
)
BEGIN
    UPDATE products SET
        title = p_title,
        price = p_price,
        description = p_description,
        image = p_image,
        type_product = p_type_product,
        offer_percentage = p_offer_percentage,
        stock = p_stock,
        category = p_category,
        brand = p_brand
    WHERE id = p_id;
END;
//

CREATE PROCEDURE toggle_product_type(
    IN p_id CHAR(36),
    IN p_type ENUM('destacado', 'nuevo arribo', 'mas vendido')
)
BEGIN
    DECLARE current_type ENUM('destacado', 'nuevo arribo', 'oferta', 'mas vendido', 'Normal');

    SELECT type_product INTO current_type FROM products WHERE id = p_id;

    IF current_type = p_type THEN
        SET current_type = NULL;
    ELSE
        SET current_type = p_type;
    END IF;

    UPDATE products SET type_product = current_type WHERE id = p_id;
END;
//

CREATE PROCEDURE get_paginated_products(
    IN p_limit INT,
    IN p_offset INT,
    IN p_sort ENUM('asc', 'desc')
)
BEGIN
    SET @order = IF(p_sort = 'desc', 'DESC', 'ASC');
    SET @sql = CONCAT(
        'SELECT * FROM products ORDER BY price ', @order,
        ' LIMIT ', p_limit, ' OFFSET ', p_offset
    );
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END;
//

CREATE PROCEDURE get_paginated_products_by_category(
    IN p_category VARCHAR(100),
    IN p_limit INT,
    IN p_offset INT,
    IN p_sort ENUM('asc', 'desc')
)
BEGIN
    SET @order = IF(p_sort = 'desc', 'DESC', 'ASC');
    SET @sql = CONCAT(
        'SELECT * FROM products WHERE category = ? ORDER BY price ', @order,
        ' LIMIT ', p_limit, ' OFFSET ', p_offset
    );

    PREPARE stmt FROM @sql;
    SET @cat = p_category;
    EXECUTE stmt USING @cat;
    DEALLOCATE PREPARE stmt;
END;
//

CREATE PROCEDURE get_unique_categories()
BEGIN
    SELECT DISTINCT category FROM products;
END;
//

CREATE PROCEDURE insert_product_thumbnail(
    IN p_thumb_id CHAR(36),
    IN p_product_id CHAR(36),
    IN p_url VARCHAR(255),
    IN p_public_id VARCHAR(255)
)
BEGIN
    INSERT INTO product_thumbnails (id, product_id, url, public_id)
    VALUES (p_thumb_id, p_product_id, p_url, p_public_id);
END;
//

CREATE PROCEDURE delete_product_thumbnails(IN p_product_id CHAR(36))
BEGIN
    DELETE FROM product_thumbnails WHERE product_id = p_product_id;
END;
//

DELIMITER;