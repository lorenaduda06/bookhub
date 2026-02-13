import { sql } from './db.js';

sql`
CREATE TABLE cadastro(
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    senha TEXT
);
`.then(() => {
    console.log("Tabela criada");
});

sql`
CREATE TABLE livros(
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    capa_url TEXT
)
`.then(() => {
    console.log("Tabela criada");
})

sql`
CREATE TABLE user_livros(
    user_id TEXT,
    livro_id INT,
    status_livro TEXT,
    PRIMARY KEY(user_id, livro_id),
    FOREIGN KEY(user_id) REFERENCES cadastro(id),
    FOREIGN KEY(livro_id) REFERENCES livros(id)
)
`.then(() => {
    console.log("Tabela criada");
});

sql`
INSERT INTO livros (titulo, autor, capa_url) VALUES
('Um Perfeito Cavalheiro', 'Julia Quinn', '/img/bridgerton3.png'),
('A Viajante Do Tempo', 'Diana Gabaldon', '/img/outlander1.png'),
('Um Amor Para Recordar', 'Nicolas Sparks', '/img/amorprecordar.png'),
('O Verão Que Mudou A Minha Vida', 'Jenny Han', '/img/overao1.png'),
('It - A Coisa', 'Stephen King', '/img/it.png'),
('O Iluminado', 'Stephen King', '/img/iluminado.png'),
('Verity', 'Colleen Hoover', '/img/verity.png'),
('Novembro De 63', 'Stephen King', '/img/nov63.png'),
('Príncipe Do Mar', 'Linsey Miller', '/img/princemar.png'),
('Asas Reluzentes', 'Allison Saft', '/img/asasreluz.png'),
('Harry Potter E A Pedra FIlosofal', 'J. K. Rowling', '/img/harry1.png'),
('O Senhor Dos Anéis', 'J. R. R. Tolkien', '/img/sraneis.png')
`.then(() => {
    console.log("Dados inseridos");
});