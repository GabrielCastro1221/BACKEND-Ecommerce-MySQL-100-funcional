USE petshop;

DELIMITER / /

CREATE PROCEDURE add_product_to_wishlist(
    IN p_wishlist_id CHAR(36),
    IN p_product_id CHAR(36)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM wishlists WHERE id = p_wishlist_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wishlist no encontrada';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM wishlist_products 
        WHERE wishlist_id = p_wishlist_id AND product_id = p_product_id
    ) THEN
        INSERT INTO wishlist_products (wishlist_id, product_id)
        VALUES (p_wishlist_id, p_product_id);
    END IF;

    SELECT 
        p.id, 
        p.title, 
        p.price, 
        p.image
    FROM wishlist_products wp
    JOIN products p ON wp.product_id = p.id
    WHERE wp.wishlist_id = p_wishlist_id;
END;
//

CREATE PROCEDURE get_products_from_wishlist(
    IN p_wishlist_id CHAR(36)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM wishlists WHERE id = p_wishlist_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wishlist no encontrada';
    END IF;

    SELECT 
        p.id, 
        p.title, 
        p.price, 
        p.image
    FROM wishlist_products wp
    JOIN products p ON wp.product_id = p.id
    WHERE wp.wishlist_id = p_wishlist_id;
END;
//

CREATE PROCEDURE delete_product_from_wishlist(
    IN p_wishlist_id CHAR(36),
    IN p_product_id CHAR(36)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM wishlists WHERE id = p_wishlist_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wishlist no encontrada';
    END IF;

    DELETE FROM wishlist_products
    WHERE wishlist_id = p_wishlist_id AND product_id = p_product_id;
END;
//

CREATE PROCEDURE empty_wishlist(
    IN p_wishlist_id CHAR(36)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM wishlists WHERE id = p_wishlist_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wishlist no encontrada';
    END IF;

    DELETE FROM wishlist_products WHERE wishlist_id = p_wishlist_id;
END;
//

CREATE PROCEDURE get_wishlist_by_id(
    IN p_wishlist_id CHAR(36)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM wishlists WHERE id = p_wishlist_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wishlist no encontrada';
    END IF;

    SELECT 
        p.id, 
        p.title, 
        p.price, 
        p.image
    FROM wishlist_products wp
    JOIN products p ON wp.product_id = p.id
    WHERE wp.wishlist_id = p_wishlist_id;
END;
//

DELIMITER;