import { HomeView } from "../views/home/home.js";
import { NotFoundView } from "../views/not-found/not-found.js";
import { LoginView } from "../views/autenticacao/login.js";
import { ListarCategoriasView } from "../views/categoria/listar-categorias.js";
import { ContatoView } from "../views/contato/contato.js";
import { SobreView } from "../views/sobre/sobre.js";
import { ListarProdutosView } from "../views/produto/listar-produtos.js";

//Recupera o elemento que vai armazenar os conteúdos das views
const containerView = document.getElementById('content-view');

//Instancia as Viees
const homeView = new HomeView(containerView);
const contatoView = new ContatoView(containerView);
const sobreView =  new SobreView(containerView);
const notFoundView = new NotFoundView(containerView);
const loginView = new LoginView(containerView);
const listarCategoriasView = new ListarCategoriasView(containerView);
const listaProdutosView = new ListarProdutosView(containerView);

//Define um objeto para relacionar as rotas (URL) as view
const routes = {
  '/': homeView,
  '/home': homeView,
  '/contato': contatoView,
  '/sobre': sobreView,
  '/not-found': notFoundView,
  '/login':loginView,
  '/listar-categorias': listarCategoriasView,
  '/listar-produtos': listaProdutosView
};

export { routes }