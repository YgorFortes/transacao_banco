CREATE DATABASE dindin;

USE dindin;

CREATE TABLE usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(255),
	email VARCHAR(255) UNIQUE,
	senha VARCHAR(255)
);

CREATE TABLE categorias (
	id INT AUTO_INCREMENT PRIMARY KEY,
	usuario_id INT,
	descricao TEXT,
	FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE transacoes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	descricao TEXT,
	valor DECIMAL(10,2),
	data DATE,
	categoria_id INT,
	usuario_id INT,
	tipo TEXT,
	FOREIGN KEY (categoria_id) REFERENCES categorias(id),
	FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
