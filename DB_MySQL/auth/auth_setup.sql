USE petshop;

CREATE USER 'admin_petshop' @'%' IDENTIFIED BY 'AdminSeguro123!';

CREATE USER 'vendedor_petshop' @'%' IDENTIFIED BY 'Vendedor123!';

CREATE USER 'usuario_petshop' @'%' IDENTIFIED BY 'Usuario123!';

GRANT ALL PRIVILEGES ON petshop.* TO 'admin_petshop' @'%';

GRANT SELECT, INSERT , UPDATE ON petshop.* TO 'vendedor_petshop' @'%';

GRANT SELECT ON petshop.* TO 'usuario_petshop' @'%';

FLUSH PRIVILEGES;