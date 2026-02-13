import { randomUUID } from "node:crypto";
import { sql } from './db.js';

export class DatabasePostgres {
    async create(cadastro) {
        const cadId = randomUUID();
        const { email, username, senha } = cadastro;

        await sql`INSERT INTO cadastro (id, email, username, senha) VALUES (${cadId}, ${email}, ${username}, ${senha})`;
    }

    async autenticarLogin(username) {
        const autenticacao = await sql`SELECT id, email, username, senha FROM cadastro WHERE LOWER(username) = LOWER(${username})`;

        const resultado = (autenticacao.length > 0) ? autenticacao[0] : null;
        return resultado;
    }

    async dadosUsuario(id) {
        const loginUser = await sql`SELECT id, email, username FROM cadastro WHERE id = ${id}`;

        const resultado = (loginUser.length > 0) ? loginUser[0] : null;
        return resultado;
    }

    async validarSenha(id) {
        const resultado = await sql`SELECT senha FROM cadastro WHERE id = ${id}`;

        return (resultado.length > 0) ? resultado[0] : null;
    }

    async update(id, user) {
        const { newSenha, newUsername } = user;

        if (newUsername && newSenha) {
            const updateUser = await sql`UPDATE cadastro SET username = ${newUsername}, senha = ${newSenha} WHERE id = ${id}`;

            return updateUser.rowCount;
        }

        if (newUsername) {
            const updateUser = await sql`UPDATE cadastro SET username = ${newUsername} WHERE id = ${id}`;

            return updateUser.rowCount;
        }

        if (newSenha) {
            const updateUser = await sql`UPDATE cadastro SET senha = ${newSenha} WHERE id = ${id}`;

            return updateUser.rowCount;
        }
        return 0;
    }

    async delete(id) {
        await sql`DELETE FROM user_livros WHERE user_id = ${id}`;
        
        const resultado = await sql`DELETE FROM cadastro WHERE id = ${id}`;
        return resultado.rowCount;
    }

    // MINHA ÁREA
    async listBooksByUser(userId) {
        const resultado = await sql`
            SELECT l.id, l.titulo, l.autor, l.capa_url, lu.status_livro FROM livros AS l
            JOIN user_livros AS lu ON l.id = lu.livro_id
            WHERE lu.user_id = ${userId}
        `;
        return resultado;
    }

    async bookAlreadyExists(userId, livroId) {
        const userArea = await sql `SELECT * FROM user_livros WHERE user_id = ${userId} AND livro_id = ${livroId}`;

        const resultado = (userArea.length) ? userArea[0] : null;
        return resultado;
    }

    async addBook(userId, livroId, statusLivro) {
        await sql`INSERT INTO user_livros (user_id, livro_id, status_livro) VALUES (${userId}, ${Number(livroId)}, ${statusLivro})`;
    }

    async statusUpdate(userId, livroId, statusLivro) {
        await sql`UPDATE user_livros SET status_livro = ${statusLivro} WHERE user_id = ${userId} AND livro_id = ${livroId}`;
    }

    async removeBook(userId, livroId) {
        await sql`DELETE FROM user_livros WHERE user_id = ${userId} AND livro_id = ${livroId}`;
    }
}