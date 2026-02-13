const API_MINHA_AREA = 'http://localhost:3002/minha-area';

document.querySelectorAll(".bt-lista-lido").forEach(bt => {
    bt.addEventListener("click", () => {
        const livroId = bt.dataset.livro;
        addBook(livroId, "lido");
    });
});

document.querySelectorAll(".bt-lista-desejo").forEach(bt => {
    bt.addEventListener("click", () => {
        const livroId = bt.dataset.livro;
        addBook(livroId, "desejo");
    });
});

async function addBook(livroId, statusLivro) {
    const userId = localStorage.getItem("idLogado");

    if (!userId) {
        alert("É necessário estar logado para adicionar livros");
        return;
    }

    const livro = {
        livroId,
        statusLivro
    }

    try {
        const resp = await fetch(`${API_MINHA_AREA}/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)
        });

        if (resp.status === 201) {
            console.log("Livro adicionado a lista do usuário");
            window.location.href = "minhaArea.html"
        }
        else if (resp.status === 409) {
            alert("O livro já está na sua lista");
        }
        else {
            alert("Não foi possível adicionar o livro a sua lista");
        }
    }
    catch(error) {
        console.error("Erro. Tente novamente mais tarde");
    }
}

function confirmUserLogado() {
    const userId = localStorage.getItem("idLogado");
    const linkMinhaArea = document.getElementById("link-minha-area");
    const linkCad = document.getElementById("link-cad");

    if (!linkMinhaArea) return;

    if (userId) {
        linkMinhaArea.href = "minhaArea.html";
        
        if (linkCad) {
            linkCad.style.display = "none";
        }
    }
    else {
        linkMinhaArea.href = "login.html";
    }
}

document.addEventListener("DOMContentLoaded", confirmUserLogado);