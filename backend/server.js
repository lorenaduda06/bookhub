import { fastify } from 'fastify';
import { DatabasePostgres } from './database-postgres.js';

const server = fastify();

const database = new DatabasePostgres();

server.post('/cadastro', async (request, reply) => {
    const { email, username, senha } = request.body;

    if (email.length === 0 || username.length === 0 || senha.length === 0) {
        console.error("Erro: os campos são obrigatórios para efetuar o cadastro");

        return reply.status(400).send();
    }
    else if (!email.includes('@')) {
        console.error("Erro: digite um email válido para efetuar o cadastro");

        return reply.status(400).send();
    }
    else {
        await database.create({
            email,
            username,
            senha,
        });
        return reply.status(201).send();
    }
});

server.post('/login', async (request, reply) => {
    const { username, senha } = request.body;

    if (username.length === 0 && senha.length === 0) {
        console.error("Erro: preencha os campos para efetuar o login");

        return reply.status(400).send();
    }

    const login = await database.login({ username, senha });

    if (login === null) {
        console.error("Erro: o usuário não foi encontrado");

        return reply.status(404).send();
    }
    else if (login.senha != senha) {
        console.error("A senha está incorreta");

        return reply.status(401).send();
    }
    else if (login.senha === senha) {
        return reply.status(200).send();
    }
});

server.get('/bookhub', async (request) => {
    const search = request.query.search;

    const cadastro = await database.list(search);

    return cadastro;
});

server.put('/atualizacao/:id', async (request, reply) => {
    const cadId = request.params.id;
    const { username, senha } = request.body;

    const cadastro = await database.update(cadId, {
        username,
        senha
    });

    if (cadastro === 0) {
        return reply.status(404).send();
    }
    else {
        return reply.status(204).send();
    }
});

server.delete('/exclusao/:id', async (request, reply) => {
    const cadId = request.params.id;

    const cadastro = await database.delete(cadId);

    if (cadastro === 0) {
        return reply.status(404).send();
    }
    else {
        return reply.status(204).send();
    }
});

server.listen({
    port: 3002,
});