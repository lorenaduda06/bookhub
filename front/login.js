const API = 'http://localhost:3002/login';

const usernameLogin = document.getElementById("username-login");
const senhaLogin = document.getElementById("senha-login");

const newUsername = document.getElementById("new-username").value;
const newSenha = document.getElementById("new-senha").value;

const btLogin = document.getElementById("bt-login");
btLogin.addEventListener("click", async (e) => {
    const userLogin = {
        username: usernameLogin.value,
        senha: senhaLogin.value
    }

    try {
        const resp = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': application/json
            },
            body: JSON.stringify(userLogin)
        });

        if (resp.status === 200) {
            const userLogado = await resp.json();

            localStorage.setItem("idLogado", userLogado.id);

            if (newUsername) {
                newUsername.value = userLogado.username;
            }

            if (newSenha) {
                newSenha.value = userLogado.senha;
            }
        }
        else if (resp.status === 401) {
            // nao exibe o login
        }
        else {
            // erro de conexao com o servidor
        }
    }
    catch(error) {
        alert("Erro ao conectar com o servidor");
    }
});

async function loginStatus() {
    const idUser = localStorage.getItem("idLogado");

    if (!idUser) {
        // mantem aparecendo só o form de login
    }

    try {
        const resp = await fetch(`${URL}/${idUser}`, {
            method: 'GET',
        });

        if (resp.status === 200) {
            const userLogado = await resp.json();
            // permite aparecer as inf do user logado
        }
        else {
            logout();
        }
    }
    catch(error) {
        // nao realizou o login, deixa aparecendo só o conteudo da pag de login mesmo
    }
}

async function logout() {
    localStorage.removeItem("idLogado");

    window.location.reload();
}

document.addEventListener('DOMContentLoaded', loginStatus);