document.getElementById("btnCadastrar").addEventListener("click", cadastrarCliente);
document.getElementById("buscarNome").addEventListener("click", buscarCliente);
document.querySelectorAll(".excluirCliente").forEach(botao => {
    botao.addEventListener("click", () => {
        const id = botao.getAttribute("data-id");
        excluirCliente(id);
    });
});

document.getElementById("pesquisarNome").addEventListener("input", (e) => {
    const valor = e.target.value.trim();
    if (valor === "") {
        exibirClientes(); // recarrega todos os clientes
    }
});

function abrirModalEdicao(cliente) {
    
    document.getElementById("editId").value = cliente.id;
    document.getElementById("editNome").value = cliente.nome;
    document.getElementById("editTelefone").value = cliente.telefone;
    document.getElementById("editEmail").value = cliente.email;
    document.getElementById("editCPF").value = cliente.cpf;

    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById("modalEditarCliente"));
    modal.show();

    // adiciona o listener do botao salvar aqui dentro
    document.getElementById("salvarEdicao").onclick = function () {
        const id = document.getElementById("editId").value;
        const nome = document.getElementById("editNome").value;
        const telefone = document.getElementById("editTelefone").value;
        const email = document.getElementById("editEmail").value;
        const cpf = document.getElementById("editCPF").value;

        fetch(`https://688a495f4c55d5c73955c4e8.mockapi.io/cliente/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, telefone, email, cpf })
        })
            .then(res => res.json())
            .then(() => {
                alert("Dados alterados com sucesso!");
                const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarCliente"));
                modal.hide();
                exibirClientes(); 
            })
            .catch(err => {
                alert("Erro ao editar cliente.");
                console.error(err);
            });
    };
}

window.onload = exibirClientes;

function cadastrarCliente() {
    const nome = document.getElementById("nomeCliente").value;
    const telefone = document.getElementById("telCliente").value;
    const email = document.getElementById("emailCliente").value;
    const cpf = document.getElementById("cpfCliente").value;

    fetch('https://688a495f4c55d5c73955c4e8.mockapi.io/cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            telefone: telefone,
            email: email,
            cpf: cpf
        })
    })
        .then(response => response.json())
        .then(data => {
            alert('Cliente cadastrado com sucesso!');
            const modal = bootstrap.Modal.getInstance(document.getElementById("meuModal"));
            modal.hide();
            exibirClientes();
            limparFormulario();
        })
        .catch(error => {
            alert('Erro ao cadastrar cliente.', error);
        });
}

function limparFormulario() {
    document.getElementById("nomeCliente").value = "";
    document.getElementById("telCliente").value = "";
    document.getElementById("emailCliente").value = "";
    document.getElementById("cpfCliente").value = "";
}


function exibirClientes() {
    const corpoTabela = document.getElementById("corpoTabela");
    corpoTabela.innerHTML = ''; // limpa o corpo da tabela antes de exibir os dados

    fetch('https://688a495f4c55d5c73955c4e8.mockapi.io/cliente')
        .then(res => res.json())
        .then(clientes => {
            clientes.forEach(cliente => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${cliente.nome}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.cpf}</td>
                    <td><button class="btn btn-primary editarCliente">Editar</button></td>
                    <td><button class="btn btn-danger excluirCliente">Excluir</button></td>
                `;

                // Adiciona o evento ao botão de excluir
                const botaoExcluir = linha.querySelector(".excluirCliente");
                botaoExcluir.addEventListener("click", () => {
                    excluirCliente(cliente.id);
                });


                // botão editar com função separada
                const botaoEditar = linha.querySelector(".editarCliente");
                botaoEditar.addEventListener("click", () => {
                    abrirModalEdicao(cliente);
                });

                corpoTabela.appendChild(linha); 
            });
        })
        .catch(erro => alert('Erro ao buscar:', erro));
}


function buscarCliente() {
    const nomeBuscado = document.getElementById('pesquisarNome').value.toLowerCase();
    const corpoTabela = document.getElementById("corpoTabela");
    corpoTabela.innerHTML = '';

    fetch('https://688a495f4c55d5c73955c4e8.mockapi.io/cliente')
        .then(response => response.json())
        .then(clientes => {
            // filtra os clientes 
            const clientesFiltrados = clientes.filter(c => c.nome.toLowerCase() === nomeBuscado);

            if (clientesFiltrados.length === 0) {
                alert = 'Nenhum cliente encontrado.';
                return;
            }

            clientesFiltrados.forEach(cliente => {
                const linha = document.createElement("tr");

                linha.innerHTML = `
                    <td>${cliente.nome}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.cpf}</td>
                    <td><button class="btn btn-primary editarCliente">Editar</button></td>
                    <td><button class="btn btn-danger excluirCliente">Excluir</button></td>
                `;
                //botao excluir
                const botaoExcluir = linha.querySelector(".excluirCliente");
                botaoExcluir.addEventListener("click", () => {
                    excluirCliente(cliente.id);
                    exibirClientes();
                });


                // botão editar 
                const botaoEditar = linha.querySelector(".editarCliente");
                botaoEditar.addEventListener("click", () => {
                    abrirModalEdicao(cliente);
                    exibirClientes();
                });

                corpoTabela.appendChild(linha)
            });
        })
        .catch(error => {
            alert('Erro ao buscar cliente.', error);
        });

}

function excluirCliente(id) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        fetch(`https://688a495f4c55d5c73955c4e8.mockapi.io/cliente/${id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(() => {
                alert("Cliente excluído com sucesso!");
                exibirClientes(); 
            })
            .catch(err => {
                alert("Erro ao excluir cliente.");
                console.error(err);
            });
    }
}





