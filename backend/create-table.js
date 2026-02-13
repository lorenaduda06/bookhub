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