const API = 'http://localhost:3002/cadastro';

const btCad = document.getElementById("bt-cad");
btCad.addEventListener("click", async (e) => {
    const emailCad = document.getElementById("email-cad").value;
    const usernameCad = document.getElementById("username-cad").value;
    const senhaCad = document.getElementById("senha-cad").value;

    if (emailCad.length === 0 || usernameCad === 0 || senhaCad === 0) {
        alert("Os seguintes campos são obrigatórios para se cadastrar");
        return;
    }
    else if (!emailCad.includes('@')) {
        alert("Digite um endereço de email válido");
        return;
    }

    const userCad = {
        email: emailCad,
        username: usernameCad,
        senha: senhaCad
    }

    try {
        const resp = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCad)
        });

        if (resp.status === 201) {
            alert("Cadastro concluído com sucesso!");
        }
    }
    catch(error) {
        alert("Erro ao conectar com o servidor.");
    }
});