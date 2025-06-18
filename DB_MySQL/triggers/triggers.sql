USE petshop;

DELIMITER / /

CREATE TRIGGER tr_actualizar_producto_fecha
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.stock != OLD.stock OR NEW.price != OLD.price THEN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
    END IF;
END;
//

DELIMITER;

CREATE TABLE auditoria_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id CHAR(36),
    estado_anterior ENUM(
        'pagado',
        'cancelado',
        'en proceso'
    ),
    estado_nuevo ENUM(
        'pagado',
        'cancelado',
        'en proceso'
    ),
    modificado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER / /

CREATE TRIGGER tr_cambio_estado_ticket
AFTER UPDATE ON tickets_online
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status THEN
        INSERT INTO auditoria_tickets(ticket_id, estado_anterior, estado_nuevo)
        VALUES (NEW.id, OLD.status, NEW.status);
    END IF;
END;
//

DELIMITER;

DELIMITER / /

CREATE TRIGGER tr_prevenir_stock_negativo
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
    IF NEW.stock < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: El stock no puede ser negativo';
    END IF;
END;
//

DELIMITER;

CREATE TABLE auditoria_eliminacion_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id CHAR(36),
    eliminado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER / /

CREATE TRIGGER tr_auditar_eliminacion_producto
AFTER DELETE ON products
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_eliminacion_productos(product_id)
    VALUES (OLD.id);
END;
//

DELIMITER;

DELIMITER / /

CREATE TRIGGER tr_prevenir_borrado_admin
BEFORE DELETE ON users
FOR EACH ROW
BEGIN
    IF OLD.role = 'admin' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: No se puede eliminar un usuario con rol admin';
    END IF;
END;
//

DELIMITER;