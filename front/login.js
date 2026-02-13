const API_LOGIN = 'http://localhost:3002/login';
const API_DADOS = 'http://localhost:3002/usuario';
const API_UPDATE = 'http://localhost:3002/atualizacao';
const API_DELETE = 'http://localhost:3002/exclusao';

// VARIÁVEIS - LOGIN
const formLogin = document.getElementById("form-login");
const usernameLogin = document.getElementById("username-login");
const senhaLogin = document.getElementById("senha-login");
const btLogin = document.getElementById("bt-login");

// VARIÁVEIS - EDITAR PERFIL
const containerDados = document.getElementById("container-dados");
const dadosUser = document.getElementById("dados-user");
const btExcluir = document.getElementById("bt-excluir");
const btSair = document.getElementById("bt-logout");
const divDivisor = document.getElementById("divisorLogin");
const containerUpdate = document.getElementById("container-update");
const newUsername = document.getElementById("new-username");
const oldSenha = document.getElementById("old-senha");
const newSenha = document.getElementById("new-senha");
const btEditar = document.getElementById("bt-editar");

// AUTENTICAÇÃO - LOGIN
function statusInicial() {
    formLogin.style.display = "flex";
    divDivisor.style.display = "none";
    containerDados.style.display = "none";
    containerUpdate.style.display = "none";
}

function statusLogado(user) {
    formLogin.style.display = "none";
    divDivisor.style.display = "flex";
    containerDados.style.display = "flex";
    dadosUser.style.display = "flex";
    dadosUser.innerHTML = `<p><span>Email:</span> ${user.email}</p>
    <p><span>Username:</span> ${user.username}</p>`;
    containerUpdate.style.display = "flex";
}

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userLogin = {
        username: usernameLogin.value.trim(),
        senha: senhaLogin.value.trim()
    }

    try {
        const resp = await fetch(API_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userLogin)
        });

        if (resp.status === 200) {
            const userLogado = await resp.json();

            localStorage.setItem("idLogado", userLogado.id);
            statusLogado(userLogado);
        }
        else if (resp.status === 401) {
            statusInicial();
        }
        else if (resp.status === 404) {
            alert("Usuário não encontrado");
        }
        else if (resp.status === 400) {
            alert("Preencha todos os campos");
        }
        else {
            alert("Erro no servidor");
        }
    }
    catch(error) {
        alert("Erro ao conectar com o servidor");
    }
});

async function loginStatus() {
    const idUser = localStorage.getItem("idLogado");

    if (!idUser) {
        statusInicial();
        return;
    }

    try {
        const resp = await fetch(`${API_DADOS}/${idUser}`, {
            method: 'GET',
        });

        if (resp.status === 200) {
            const userLogado = await resp.json();
            statusLogado(userLogado);
        }
        else {
            logout();
            console.error("Falha");
        }
    }
    catch(error) {
        console.error("Erro: não foi possível autenticar o login");
        statusInicial();
    }
}

async function logout() {
    localStorage.removeItem("idLogado");

    window.location.reload();
}

btSair.addEventListener("click", logout);

// EDITAR PERFIL
async function updateDate() {
    const userId = localStorage.getItem("idLogado");

    if (!userId) {
        alert("É necessário efetuar o login para acessar os dados");
        return;
    }

    if (!oldSenha.value) {
        alert("É necessário informar sua senha atual para editar os dados");
        return;
    }

    if (!newSenha.value && !newUsername.value) {
        alert("Preencha no mínimo um dos campos para enviar");
        return;
    }

    const dados_editar = {
        oldSenha: oldSenha.value,
        newSenha: newSenha.value,
        newUsername: newUsername.value
    }

    try {
        const resp = await fetch(`${API_UPDATE}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados_editar)
        });

        if (resp.ok) {
            alert("Perfil atualizado com sucesso");
            newUsername.value = "";
            oldSenha.value = "";
            newSenha.value = "";
            await loginStatus();
        }
        else if (resp.status === 401) {
            alert("Erro: a senha atual está incorreta");
        }
    }
    catch(error) {
        alert("Erro. Tente novamente mais tarde");
    }
}

btEditar.addEventListener("click", updateDate);

// EXCLUIR PERFIL
async function deleteLogin() {
    const userId = localStorage.getItem("idLogado");

    if (!userId) {
        alert("Para executar essa ação é necessário estar logado");
        return;
    }

    const conf = confirm("Deseja realmente exlcuir seu perfil?");

    if (!conf) {
        alert("Operação cancelada");
        return;
    }

    try {
        const resp = await fetch(`${API_DELETE}/${userId}`, {
            method: 'DELETE'
        });

        if (resp.status === 204) {
            alert("Perfil excuído com sucesso!");
            await logout();
        }
        else {
            alert("Erro: não foi possível excluir o perfil");
        }
    }
    catch(error) {
        alert("Erro. Tente novamente mais tarde");
    }
}

btExcluir.addEventListener("click", deleteLogin);

document.addEventListener('DOMContentLoaded', loginStatus);