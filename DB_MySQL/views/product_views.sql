USE petshop;

CREATE VIEW top_productos_mas_vendidos AS
SELECT tp.product_id, p.title, SUM(tp.quantity) AS total_vendido
FROM
    ticket_products tp
    JOIN products p ON p.id = tp.product_id
GROUP BY
    tp.product_id,
    p.title
ORDER BY total_vendido DESC
LIMIT 10;

CREATE VIEW productos_menos_vendidos AS
SELECT tp.product_id, p.title, SUM(tp.quantity) AS total_vendido
FROM
    ticket_products tp
    JOIN products p ON p.id = tp.product_id
GROUP BY
    tp.product_id,
    p.title
ORDER BY total_vendido ASC
LIMIT 10;

CREATE VIEW destacados_top_ventas AS
SELECT p.id, p.title, SUM(tp.quantity) AS total_vendido
FROM
    ticket_products tp
    JOIN products p ON p.id = tp.product_id
WHERE
    p.type_product = 'destacado'
GROUP BY
    p.id,
    p.title
ORDER BY total_vendido DESC;