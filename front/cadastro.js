const API = 'http://localhost:3002/cadastro';
const btCad = document.getElementById("bt-cad");

btCad.addEventListener("click", async (e) => {
    const emailCad = document.getElementById("email-cad").value;
    const usernameCad = document.getElementById("username-cad").value;
    const senhaCad = document.getElementById("senha-cad").value;

    if (emailCad.length === 0 || usernameCad.length === 0 || senhaCad.length === 0) {
        alert("Os seguintes campos são obrigatórios para se cadastrar");
        return;
    }
    else if (!emailCad.includes('@')) {
        alert("Digite um endereço de email válido");
        return;
    }

    const userCad = {
        email: emailCad.trim(),
        username: usernameCad.trim(),
        senha: senhaCad.trim()
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
            document.getElementById("form-cad").reset();
        }
        else if (resp.status === 409) {
            alert("Email/nome de usuário já existem");
        }
    }
    catch(error) {
        alert("Erro ao conectar com o servidor.");
    }
});