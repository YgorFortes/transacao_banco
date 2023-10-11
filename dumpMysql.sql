CREATE DATABASE dindin;

USE dindin;

CREATE TABLE usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	senha VARCHAR(255) NOT NULL
);

CREATE TABLE categorias (
	id INT AUTO_INCREMENT PRIMARY KEY,
	usuario_id INT NOT NULL,
	descricao TEXT NOT NULL,
	FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE transacoes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	descricao TEXT NOT NULL,
	valor DECIMAL(10,2) NOT NULL,
	data DATE NOT NULL,
	categoria_id INT NOT NULL,
	usuario_id INT NOT NULL,
	tipo TEXT NOT NULL,
	FOREIGN KEY (categoria_id) REFERENCES categorias(id),
	FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
