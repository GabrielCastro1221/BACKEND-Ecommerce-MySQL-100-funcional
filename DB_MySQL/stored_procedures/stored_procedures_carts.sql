USE petshop;

DELIMITER / /

CREATE PROCEDURE add_product_to_cart(
    IN p_cart_id CHAR(36),
    IN p_product_id CHAR(36),
    IN p_quantity INT
)
BEGIN
    DECLARE existing_quantity INT;

    IF NOT EXISTS (SELECT 1 FROM carts WHERE id = p_cart_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Carrito no encontrado';
    END IF;

    SELECT quantity INTO existing_quantity
    FROM cart_products
    WHERE cart_id = p_cart_id AND product_id = p_product_id;

    IF existing_quantity IS NOT NULL THEN
        UPDATE cart_products
        SET quantity = existing_quantity + p_quantity
        WHERE cart_id = p_cart_id AND product_id = p_product_id;
    ELSE
        INSERT INTO cart_products (cart_id, product_id, quantity)
        VALUES (p_cart_id, p_product_id, p_quantity);
    END IF;
END;
//

CREATE PROCEDURE get_products_from_cart(
    IN p_cart_id CHAR(36)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM carts WHERE id = p_cart_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Carrito no encontrado';
    END IF;

    SELECT 
        p.id, 
        p.title, 
        p.price, 
        p.image, 
        cp.quantity
    FROM cart_products cp
    JOIN products p ON cp.product_id = p.id
    WHERE cp.cart_id = p_cart_id;
END;
//

CREATE PROCEDURE delete_product_from_cart(
    IN p_cart_id CHAR(36),
    IN p_product_id CHAR(36)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM carts WHERE id = p_cart_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Carrito no encontrado';
    END IF;

    DELETE FROM cart_products
    WHERE cart_id = p_cart_id AND product_id = p_product_id;
END;
//

CREATE PROCEDURE empty_cart(
    IN p_cart_id CHAR(36)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM carts WHERE id = p_cart_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Carrito no encontrado';
    END IF;

    DELETE FROM cart_products WHERE cart_id = p_cart_id;
END;
//

CREATE PROCEDURE get_cart_by_id(
    IN p_cart_id CHAR(36)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM carts WHERE id = p_cart_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Carrito de compras no encontrado';
    END IF;

    SELECT 
        p.id, 
        p.title, 
        p.price, 
        p.image, 
        cp.quantity
    FROM cart_products cp
    JOIN products p ON cp.product_id = p.id
    WHERE cp.cart_id = p_cart_id;
END;
//

DELIMITER;