import { randomUUID } from "node:crypto";
import { sql } from './db.js';

export class DatabasePostgres {
    async create(cadastro) {
        const cadId = randomUUID();
        const { email, username, senha } = cadastro;

        await sql`INSERT INTO cadastro (id, email, username, senha) VALUES (${cadId}, ${email}, ${username}, ${senha})`;
    }

    async login(user) {
        let loginUser;

        const { username, senha } = user;

        loginUser = await sql`SELECT email, username, senha FROM cadastro WHERE username = ${username}`;

        if (loginUser.rowCount > 0) {
            return loginUser.rows[0];
        }
        else {
            return null;
        }
    }

    async list(search) {
        let cadastro;

        if (search) {
            cadastro = await sql`SELECT username FROM cadastro WHERE username iLike ${'%' + search + '%'}`;
        }
        else {
            cadastro = await sql`SELECT username FROM cadastro`;
        }
        return cadastro;
    }

    async update(id, user) {
        let updateUser;

        const { username, senha } = user;
        
        updateUser = await sql`UPDATE cadastro SET username = ${username}, senha = ${senha} WHERE id = ${id}`;

        if (updateUser.rowCount > 0) {
            return 1;
        }
        return 0;
    }

    async delete(id) {
        let deleteUser;

        deleteUser = await sql`DELETE FROM cadastro WHERE id = ${id}`;

        if (deleteUser.rowCount > 0) {
            return 1;
        }
        return 0;
    }
}