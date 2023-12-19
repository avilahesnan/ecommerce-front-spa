import { View } from "../../js/view.js";

class GerenciarCategoriaView extends View {

    //////////////
    //Construtor//
    //////////////

    constructor(contentView, templatePath = '/views/categoria/gerenciar-categorias.html') {
        super(contentView, templatePath);
        this._safe = true;

        document.addEventListener("eventCategoriaInserida", async (e) => {
            this.showSpinner();
            const listaCategorias = await this.recuperarTodasCategorias();
            this.criarTabela(listaCategorias);
            this.configuraEventListeners();
        });

        document.addEventListener("eventCategoriaDeletada", async (e) => {
            this.showSpinner();
            const listaCategorias = await this.recuperarTodasCategorias();
            this.criarTabela(listaCategorias);
            this.configuraEventListeners();
        });

        document.addEventListener("eventCategoriaAtualizada", async (e) => {
            this.showSpinner();
            const listaCategorias = await this.recuperarTodasCategorias();
            this.criarTabela(listaCategorias);
            this.configuraEventListeners();
        });
    }

    /////////////////////
    //Metodos Sincronos//
    /////////////////////

    showSpinner() {
        const tableBody = document.getElementById('tbody-lista-categoria');
        if (tableBody) {
            tableBody.innerHTML = `<tr>
                <td colspan="2" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                </td>
            </tr>`;
        }
    }

    criarTabela(listaCategorias) {
       
        const containerTBodyCategorias = document.getElementById('tbody-lista-categorias');
        if (!containerTBodyCategorias) return;
        containerTBodyCategorias.innerHTML = "";

        //Percorre a lista de categorias
        listaCategorias.forEach(categoria => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${categoria.id}</td>
                <td>${categoria.name}</td>
                <td class="align-items-center">
                    <button class="btn btn-danger delete-btn" data-id="${categoria.id}">Deletar</button>
                    <button class="btn btn-primary update-btn" data-id="${categoria.id}" data-nome="${categoria.name}">Atualizar</button>
                </td>`;
            containerTBodyCategorias.appendChild(row);
        });

    }

    configuraEventListeners() {
        document.querySelectorAll('.delete-btn').forEach((btn) => {
            btn.addEventListener('click', (event) => {
                this.showModalDeleteCategoria(event.target.getAttribute('data-id'));
            });
        });

        document.querySelectorAll('.update-btn').forEach((btn) => {
            btn.addEventListener('click', (event) => {
                console.log(event.target.getAttribute('data-nome'));
                this.showModalAtualizarCategoria(event.target.getAttribute('data-id'), event.target.getAttribute('data-nome'));
            });
        });

      
    }

    ///////////////////////
    //Metodos Assincronos//
    ///////////////////////

    async recuperarTodasCategorias() {
        const successToast = new bootstrap.Toast(document.getElementById('successToastCategoria'));
        const errorToast = new bootstrap.Toast(document.getElementById('errorToastCategoria'));
        try {
            const response = await fetch('http://localhost:3000/api/v1/categories');

            if (!response.ok) {
                console.log(response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            successToast.show();
            const data = await response.json();
            return data;

        } catch (error) {
            errorToast.show();
            return [];
        }
    } 
    
    async showModalDeleteCategoria(id) {

        var deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        var eventCategoriaDeletada = new Event('eventCategoriaDeletada', { bubbles: true, cancelable: false });
        
        //Ação de deleção
        const deletarCategoria = async (id) => {
            const successToast = new bootstrap.Toast(document.getElementById('successToastDeletarCategoria'));
            const errorToast = new bootstrap.Toast(document.getElementById('errorToastDeletarCategoria'));
            try {
                const response = await fetch(`http://localhost:3000/api/v1/categories/${id}`,
                    {
                        method: 'DELETE'
                    }
                );
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                deleteModal.hide();
                document.dispatchEvent(eventCategoriaDeletada);
                successToast.show();
                const data = await response.json();
                return data;
    
            } catch (error) {
                deleteModal.hide();
                errorToast.show();
                return [];
            }
        }
        
        document.getElementById('confirmDelete').onclick = function () {
            const response = deletarCategoria(id);
        };

        deleteModal.show();
    }

    async showModalAtualizarCategoria(id, nome) {
       
        document.getElementById('nomeUpdate').value = nome;

        var updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
        var eventCategoriaAtualizada = new Event('eventCategoriaAtualizada', { bubbles: true, cancelable: false });
        
        //Ação de deleção
        const atualizarCategoria = async (id, nome) => {
            const successToast = new bootstrap.Toast(document.getElementById('successToastAtualizarCategoria'));
            const errorToast = new bootstrap.Toast(document.getElementById('errorToastAtualizarCategoria'));
            try {
                const response = await fetch(`http://localhost:3000/api/v1/categories/${id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: id,
                            name: nome
                        })
                    }
                );
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                updateModal.hide();
                document.dispatchEvent(eventCategoriaAtualizada);
                successToast.show();
                const data = await response.json();
                return data;
    
            } catch (error) {
                updateModal.hide();
                errorToast.show();
                return [];
            }
        }
    
        // Set up the update action
        document.getElementById('confirmUpdate').onclick = function() {
            var novoNome = document.getElementById('nomeUpdate').value;
            const response = atualizarCategoria(id,novoNome);
        };
    
        
        updateModal.show();
    }
  
    async manipularCategoriaForm(event) {
        event.preventDefault();
        const categoriaForm = new FormData(event.target);
        const nome = categoriaForm.get('nome');

        const response = await fetch('http://localhost:3000/api/v1/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nome
            })
        });
        const data = await response.json();
        var eventCategoriaInserida = new Event('eventCategoriaInserida', { bubbles: true, cancelable: false });
        document.dispatchEvent(eventCategoriaInserida);
    }

    async init() {
        await this.show();
        const categoriaForm = document.getElementById('categoriaForm');
        if (categoriaForm) {
            categoriaForm.addEventListener('submit', this.manipularCategoriaForm);
        }
        this.showSpinner();
        const listaCategorias = await this.recuperarTodasCategorias();
        this.criarTabela(listaCategorias);
        this.configuraEventListeners();
    }

}

export { GerenciarCategoriaView }