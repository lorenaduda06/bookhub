const API_MINHA_AREA = 'http://localhost:3002/minha-area';

const lista_lidos = document.getElementById("lista-finalizados");
const lista_desejos = document.getElementById("lista-desejos");

async function myLib() {
    const userId = localStorage.getItem("idLogado");

    // VALIDAÇÃO
    if (!userId) {
        alert("Nenhum usuário está logado");
        window.location.href = "login.html";
    }

    try {
        const resp = await fetch(`${API_MINHA_AREA}/${userId}`, {
            method: 'GET',
        });

        if (resp.status === 204) return;

        const livros = await resp.json();
        console.log(livros);

        livros.forEach(livro => {
            const item_book = document.createElement("li");
            item_book.className = "livro";

            item_book.innerHTML = `
                <div class="meus-livros">
                    <h3>${livro.titulo}</h3>
                    <img src="${livro.capa_url}" alt="${livro.titulo}">
                    <h4>Autor(a): ${livro.autor}</h4>
                    <div class="bt-status">
                        <button class="bt-trocar">Mover</button>
                        <button class="bt-excluir">Remover</button>
                    </div>
                </div>
            `;
            if (livro.status_livro === "lido") {
                lista_lidos.appendChild(item_book);
            }
            else {
                lista_desejos.appendChild(item_book);
            }

            item_book.querySelector(".bt-trocar").addEventListener("click", async () => {
                const updateStatus = livro.status_livro === "lido" ? "desejo" : "lido";

                const dados_livro = {
                    livroId: livro.id,
                    statusLivro: updateStatus
                }

                await fetch(`${API_MINHA_AREA}/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dados_livro)
                });
                location.reload();
            });

            item_book.querySelector(".bt-excluir").addEventListener("click", async () => {
                const resp = confirm("Deseja realmente remover este livro da sua área?");

                if (!resp) return;

                await fetch(`${API_MINHA_AREA}/${userId}/${livro.id}`, {
                    method: "DELETE"
                });
                item_book.remove();
            });
        });
    }
    catch(error) {
        console.error("Erro de conexão com o servidor");
        alert("Não foi possível se conectar ao servidor");
    }
}

document.addEventListener('DOMContentLoaded', myLib);