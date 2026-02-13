import { fastify } from 'fastify';
import cors from '@fastify/cors';
import { DatabasePostgres } from './database-postgres.js';
import { request } from 'express';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify();

server.register(cors, {
    origin: '*',
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
});

server.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/'
});

const database = new DatabasePostgres();

server.post('/cadastro', async (request, reply) => {
    const { email, username, senha } = request.body;

    if (email.length === 0 || username.length === 0 || senha.length === 0) {
        console.error("Erro: os campos são obrigatórios para efetuar o cadastro");

        return reply.status(400).send();
    }
    if (!email.includes('@')) {
        console.error("Erro: digite um email válido para efetuar o cadastro");

        return reply.status(400).send();
    }

    try {
        await database.create({
            email: email.trim(),
            username: username.trim(),
            senha: senha.trim(),
        });
        return reply.status(201).send();
    }
    catch (error) {
        if (error.code === '23505') {
            if (error.detail.includes("email")) {
                return reply.status(409).send({ message: "Email já cadastrado" });
            }
            if (error.detail.includes("username")) {
                return reply.status(409).send({ message: "Nome de usuário já cadastrado" });
            }
        }
        console.error(error);
        return reply.status(500).send();
    }
});

server.post('/login', async (request, reply) => {
    const { username, senha } = request.body;

    if (!username || !senha) {
        return reply.status(400).send({error: "Preencha todos os campos"});
    }

    const login = await database.autenticarLogin(username.trim());

    if (!login) {
        return reply.status(404).send({error: "Usuário não encontrado"});
    }

    if (login.senha !== senha) {
        console.error("Erro: a senha está incorreta");

        return reply.status(401).send({error: "Senha incorreta"});
    }
    return reply.status(200).send({
        id: login.id,
        email: login.email,
        username: login.username
    });
});

server.get('/usuario/:id', async (request, reply) => {
    const cadId = request.params.id;

    const user = await database.dadosUsuario(cadId);

    if (!user) {
        console.error("Erro: nenhum usuário foi encontrado");

        return reply.status(404).send();
    }
    else {
        return reply.status(200).send({
            id: user.id,
            email: user.email,
            username: user.username
        });
    }
});

server.put('/atualizacao/:id', async (request, reply) => {
    const cadId = request.params.id;
    const { oldSenha, newSenha, newUsername } = request.body;

    const user = await database.validarSenha(cadId);

    if (!user) {
        return reply.status(404).send();
    }
    else if (user.senha !== oldSenha) {
        return reply.status(401).send();
    }
    
    const statusUpdate = await database.update(cadId, { newUsername, newSenha });

    if (statusUpdate === 0) {
        return reply.status(400).send();
    }

    return reply.status(204).send();
});

server.delete('/exclusao/:id', async (request, reply) => {
    const cadId = request.params.id;

    const user = await database.delete(cadId);

    if (user != 0) {
        return reply.status(204).send();
    }

    return reply.status(404).send();
});

// MINHA ÁREA - CARREGA OS LIVROS
server.get('/minha-area/:id', async (request, reply) => {
    const userId = request.params.id;

    const book = await database.listBooksByUser(userId);

    if (book.length === 0) {
        return reply.status(204).send();
    }

    return reply.status(200).send(book);
})

// MINHA ÁREA - ADICIONA LIVRO
server.post('/minha-area/:id', async (request, reply) => {
    try {
        const userId = request.params.id;

        const { livroId, statusLivro } = request.body;

        const books = await database.listBooksByUser(userId);
        const existsBook = books.find(b => Number(b.id) === Number(livroId));

        if (existsBook) {
            // Pode trocar o status
            if (existsBook.status_livro !== statusLivro) {
                await database.statusUpdate(userId, livroId, statusLivro);
                return reply.status(200).send();
            }
            return reply.status(409).send();
        }
        await database.addBook(userId, livroId, statusLivro);
        return reply.status(201).send();
    }
    catch(error) {
        console.error("erro ao adicionar o livro: ", error.message);
    }
});

// MINHA ÁREA - TROCAR STATUS
server.put('/minha-area/:id', async (request, reply) => {
    const userId = request.params.id;
    const { livroId, statusLivro } = request.body;

    await database.statusUpdate(userId, livroId, statusLivro);
    return reply.status(200).send();
});

// MINHA ÁREA - REMOVER LIVRO
server.delete('/minha-area/:id/:livroId', async (request, reply) => {
    const { id: userId, livroId } = request.params;

    await database.removeBook(userId, livroId);
    return reply.status(204).send();
});

server.listen({
    port: 3002,
});