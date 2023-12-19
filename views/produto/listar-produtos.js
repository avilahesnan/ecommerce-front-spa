import { View } from "../../js/view.js";

class ListarProdutosView extends View {

  //////////////
  //Construtor//
  //////////////

  constructor(contentView, templatePath = '/views/produto/listar-produtos.html') {
    super(contentView, templatePath);
    this._safe = false;
  }

  /////////////////////
  //Metodos Sincronos//
  /////////////////////

  criarCards(listaProdutos) {

    //Recuperar o Elemento e Testa se ele Existe
    const containerCardsProdutos = document.getElementById('container-produtos');
    if (!containerCardsProdutos) return;

    //Inicializa o container
    containerCardsProdutos.innerHTML = "";

    //Template do Badges Categorias do Produto
    const templateBadgesCategoriasProdutos = (listaCategoriasProduto) => {
      let htmlBadgeProduto = '';
      //Repetição através das categorias recuperadas
      listaCategoriasProduto.forEach(categoriaProduto => {
        htmlBadgeProduto = htmlBadgeProduto + `<span class="badge bg-primary rounded-pill me-1">${categoriaProduto.nome}</span>`
      });
      return htmlBadgeProduto;
    };

    //Template do Cards Produtos
    const templateCardsProdutos = (produto) => {
      const htmlBadgeProduto = templateBadgesCategoriasProdutos(produto.categorias);
      return `<div class="col mb-5">
          <div class="card h-100">
              <div class="card-header">
                <h5 class="fw-bolder">${produto.nome}</h5>
              </div> 
              <!-- Imagem do Produto -->
            
              <!-- Detalhes do Produto -->
              <div class="card-body p-4">
                <div class="text-center">
                  <!-- Descrição do Produto-->
                  ${produto.descricao}
                </div>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item"> R$ ${produto.valor} </li>
                <li class="list-group-item">
                  ${htmlBadgeProduto}
                </li>
              </ul>
              <!-- Product actions-->
              <div class="card-footer p-4 pt-4 pt-0">
                  <div class="text-center"><a class="btn mt-auto"  style="background-color: #655d54; color: #fcfcfc" href="#">Adicionar</a></div>
              </div>
          </div>
      </div>`;
    }

    //Repetição através dos produtos recuperadas
    listaProdutos.map(produto => {
      containerCardsProdutos.insertAdjacentHTML('beforeend', templateCardsProdutos(produto));
    });
  }

  showSpinner() {
    const container = document.getElementById('container-produtos');
    if (container) {
      container.innerHTML = `
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      `;
    }
  }

  ///////////////////////
  //Metodos Assincronos//
  ///////////////////////

  async recuperarTodosProdutos() {
    const successToast = new bootstrap.Toast(document.getElementById('successToastProduto'));
    const errorToast = new bootstrap.Toast(document.getElementById('errorToastProduto'));
    try {
      const response = await fetch('http://localhost:3000/api/v1/produtos');

      if (!response.ok) {
        console.log(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      successToast.show();
      return data;
    } catch (error) {
      errorToast.show();
      return [];
    }
  }

  async init() {
    await this.show();
    this.showSpinner();
    const listaProdutos = await this.recuperarTodosProdutos();
    this.criarCards(listaProdutos);
  }

}

export { ListarProdutosView }