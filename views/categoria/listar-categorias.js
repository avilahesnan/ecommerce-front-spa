import { View } from "../../js/view.js";

class ListarCategoriasView extends View {

  //////////////
  //Construtor//
  //////////////

  constructor(contentView, templatePath = '/views/categoria/listar-categorias.html') {
    super(contentView, templatePath);
    this._safe = false;
  }

  /////////////////////
  //Metodos Sincronos//
  /////////////////////

  criarBadges(listaCategorias) {

    //Recuperar o Elemento e Testa se ele Existe
    const containerBadgesCategorias = document.getElementById('container-badges-categorias');
    if (!containerBadgesCategorias) return;

    //Inicializa o container
    containerBadgesCategorias.innerHTML = "";

    //Template do Badge Categoria
    const templateBadgeCategoria = (categoria) => {
      return `<h2>
        <span class="badge bg-primary rounded-pill me-2">
          ${categoria.name}
        </span>
      </h2>`
    };

    //Repetição através das categorias recuperadas
    listaCategorias.forEach(categoria => {
      containerBadgesCategorias.insertAdjacentHTML('beforeend', templateBadgeCategoria(categoria));
    });

  }

  showSpinner() {
    const container = document.getElementById('container-badges-categorias');
    if (container) {
      container.innerHTML = `
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      `;
    }
  }

  ///////////////////////
  //Metodos Assincronos//
  ///////////////////////
  
  async recuperarTodasCategorias() {
    const successToast = new bootstrap.Toast(document.getElementById('successToastCategoria'));
    const errorToast = new bootstrap.Toast(document.getElementById('errorToastCategoria'));
    try {
      const response = await fetch('http://localhost:3000/api/v1/categories');

      if (!response.ok){
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

 
  async init() {
    await this.show();
    this.showSpinner();
    const listaCategorias = await this.recuperarTodasCategorias();
    this.criarBadges(listaCategorias);
  }

}

export { ListarCategoriasView }