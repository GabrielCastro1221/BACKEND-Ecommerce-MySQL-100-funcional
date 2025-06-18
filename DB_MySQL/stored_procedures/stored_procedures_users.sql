USE petshop;

DELIMITER / /

CREATE PROCEDURE create_user(
    IN p_id CHAR(36),
    IN p_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_image VARCHAR(255),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_age INT,
    IN p_cart_id CHAR(36),
    IN p_wishlist_id CHAR(36),
    IN p_role ENUM('admin', 'usuario', 'cliente'),
    IN p_gender ENUM('masculino', 'femenino'),
    IN p_newsletter ENUM('suscrito', 'no suscrito'),
    IN p_phone VARCHAR(20),
    IN p_address VARCHAR(255),
    IN p_city VARCHAR(100)
)
BEGIN
    DECLARE user_count INT;

    SELECT COUNT(*) INTO user_count FROM users WHERE email = p_email;
    IF user_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario ya existe';
    END IF;

    INSERT INTO carts (id) VALUES (p_cart_id);
    INSERT INTO wishlists (id) VALUES (p_wishlist_id);

    INSERT INTO users (
        id, name, last_name, image, email, password, age, cart_id, wishlist_id,
        role, gender, newsletter, phone, address, city
    )
    VALUES (
        p_id, p_name, p_last_name, p_image, p_email, p_password, p_age,
        p_cart_id, p_wishlist_id, p_role, p_gender, p_newsletter, p_phone, p_address, p_city
    );
END;
//

CREATE PROCEDURE get_all_users()
BEGIN
    SELECT id, name, last_name, image, email, password, age, cart_id, wishlist_id,
           role, gender, newsletter, phone, address, city
    FROM users;
END;
//

CREATE PROCEDURE update_user(
    IN p_id CHAR(36),
    IN p_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_image VARCHAR(255),
    IN p_email VARCHAR(100),
    IN p_age INT,
    IN p_role ENUM('admin', 'usuario', 'cliente'),
    IN p_gender ENUM('masculino', 'femenino'),
    IN p_newsletter ENUM('suscrito', 'no suscrito'),
    IN p_phone VARCHAR(20),
    IN p_address VARCHAR(255),
    IN p_city VARCHAR(100)
)
BEGIN
    DECLARE user_count INT;

    SELECT COUNT(*) INTO user_count FROM users WHERE id = p_id;
    IF user_count = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    UPDATE users SET
        name = p_name,
        last_name = p_last_name,
        image = p_image,
        email = p_email,
        age = p_age,
        role = p_role,
        gender = p_gender,
        newsletter = p_newsletter,
        phone = p_phone,
        address = p_address,
        city = p_city
    WHERE id = p_id;
END;
//

CREATE PROCEDURE delete_user(
    IN p_id CHAR(36)
)
BEGIN
    DECLARE user_count INT;

    SELECT COUNT(*) INTO user_count FROM users WHERE id = p_id;
    IF user_count = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    DELETE FROM users WHERE id = p_id;
END;
//

CREATE PROCEDURE change_user_role(
    IN p_id CHAR(36),
    IN p_new_role ENUM('admin', 'usuario', 'cliente')
)
BEGIN
    DECLARE user_count INT;

    SELECT COUNT(*) INTO user_count FROM users WHERE id = p_id;
    IF user_count = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    UPDATE users SET role = p_new_role WHERE id = p_id;
END;
//

DELIMITER;