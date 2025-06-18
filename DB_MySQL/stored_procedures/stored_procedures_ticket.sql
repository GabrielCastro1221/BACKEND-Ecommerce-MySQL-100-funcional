USE petshop;

DELIMITER / /

CREATE PROCEDURE create_ticket(
    IN p_id CHAR(36),
    IN p_code VARCHAR(255),
    IN p_shipping DECIMAL(10,2),
    IN p_subtotal DECIMAL(10,2),
    IN p_amount DECIMAL(10,2),
    IN p_purchaser_id CHAR(36),
    IN p_cart_id CHAR(36),
    IN p_purchase_datetime DATETIME,
    IN p_status VARCHAR(50)
)
BEGIN
    INSERT INTO tickets_online (
        id, code, shipping, subtotal, amount, purchaser_id, cart_id, purchase_datetime, status
    ) VALUES (
        p_id, p_code, p_shipping, p_subtotal, p_amount, p_purchaser_id, p_cart_id, p_purchase_datetime,
        IFNULL(p_status, 'en proceso')
    );
END;
//

CREATE PROCEDURE find_user_by_cart_id(
    IN p_cart_id CHAR(36)
)
BEGIN
    SELECT * FROM users WHERE cart_id = p_cart_id;
END;
//

CREATE PROCEDURE get_user_by_id(
    IN p_user_id CHAR(36)
)
BEGIN
    SELECT * FROM users WHERE id = p_user_id;
END;
//

CREATE PROCEDURE get_all_tickets()
BEGIN
    SELECT t.*, u.name, u.last_name, u.email
    FROM tickets_online t
    JOIN users u ON t.purchaser_id = u.id;
END;
//

CREATE PROCEDURE get_ticket_by_id(
    IN p_ticket_id CHAR(36)
)
BEGIN
    SELECT t.*, u.name, u.last_name, u.email, u.phone, u.address, u.city
    FROM tickets_online t
    JOIN users u ON t.purchaser_id = u.id
    WHERE t.id = p_ticket_id;

    SELECT tp.*, p.image
    FROM ticket_products tp
    JOIN products p ON tp.product_id = p.id
    WHERE tp.ticket_id = p_ticket_id AND tp.store_type = 'online';
END;
//

CREATE PROCEDURE delete_ticket(
    IN p_ticket_id CHAR(36)
)
BEGIN
    DELETE FROM tickets_online WHERE id = p_ticket_id;
END;
//

CREATE PROCEDURE update_ticket_status(
    IN p_ticket_id CHAR(36),
    IN p_status VARCHAR(50)
)
BEGIN
    UPDATE tickets_online SET status = p_status WHERE id = p_ticket_id;
END;
//

CREATE PROCEDURE pay_ticket(IN p_ticket_id CHAR(36))
BEGIN
    CALL update_ticket_status(p_ticket_id, 'pagado');
END;
//

CREATE PROCEDURE pay_cancel(IN p_ticket_id CHAR(36))
BEGIN
    CALL update_ticket_status(p_ticket_id, 'cancelado');
END;
//

CREATE PROCEDURE pay_process(IN p_ticket_id CHAR(36))
BEGIN
    CALL update_ticket_status(p_ticket_id, 'en proceso');
END;
//

DELIMITER;