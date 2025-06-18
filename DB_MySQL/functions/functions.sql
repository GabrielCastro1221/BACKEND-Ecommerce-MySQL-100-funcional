USE petshop;

DELIMITER / /

CREATE FUNCTION obtener_ingresos_totales()
RETURNS DECIMAL(15, 2)
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(15, 2);
    SELECT SUM(quantity * price) INTO total FROM ticket_products;
    RETURN total;
END;
//

DELIMITER;

DELIMITER / /

CREATE FUNCTION mayor_venta()
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE valor DECIMAL(10,2);
    SELECT MAX(amount) INTO valor FROM tickets_online;
    RETURN valor;
END;
//

DELIMITER;

DELIMITER / /

CREATE FUNCTION menor_venta()
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE valor DECIMAL(10,2);
    SELECT MIN(amount) INTO valor FROM tickets_online;
    RETURN valor;
END;
//

DELIMITER;

DELIMITER / /

CREATE FUNCTION numero_clientes()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT COUNT(DISTINCT purchaser_id) INTO total FROM tickets_online;
    RETURN total;
END;
//

DELIMITER;

DELIMITER / /

CREATE FUNCTION numero_ventas()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total FROM tickets_online WHERE status = 'pagado';
    RETURN total;
END;
//

DELIMITER;

DELIMITER / /

CREATE FUNCTION promedio_ventas()
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE promedio DECIMAL(10,2);
    SELECT AVG(amount) INTO promedio FROM tickets_online WHERE status = 'pagado';
    RETURN promedio;
END;
//

DELIMITER;