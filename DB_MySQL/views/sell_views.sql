USE petshop;

CREATE VIEW resumen_ventas_productos AS
SELECT
    p.id,
    p.title,
    SUM(tp.quantity) AS cantidad_vendida,
    SUM(tp.quantity * tp.price) AS ingreso_total
FROM
    ticket_products tp
    JOIN products p ON p.id = tp.product_id
GROUP BY
    p.id,
    p.title;

CREATE VIEW ingresos_por_tienda AS
SELECT tp.store_type, SUM(tp.quantity * tp.price) AS ingreso_total
FROM ticket_products tp
GROUP BY
    tp.store_type;

CREATE VIEW rango_ventas_productos AS
SELECT
    MAX(sub.total_vendido) AS maximo_vendido,
    MIN(sub.total_vendido) AS minimo_vendido
FROM (
        SELECT product_id, SUM(quantity) AS total_vendido
        FROM ticket_products
        GROUP BY
            product_id
    ) AS sub;

CREATE VIEW compras_por_usuario AS
SELECT
    u.id AS usuario_id,
    CONCAT(u.name, ' ', u.last_name) AS nombre_completo,
    COUNT(DISTINCT t.id) AS total_compras,
    SUM(tp.quantity * tp.price) AS total_gastado
FROM
    users u
    JOIN tickets_online t ON t.purchaser_id = u.id
    JOIN ticket_products tp ON tp.ticket_id = t.id
GROUP BY
    u.id,
    nombre_completo;