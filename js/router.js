import { View } from "./view.js";

class Router {

    /////////////
    //Atributos//
    /////////////

    _routes;

    //////////////
    //Construtor//
    //////////////

    constructor(routes) {
        this._routes = routes;
    }

    ///////////
    //Metodos//
    ///////////
    
    navigateTo(path) {
        //Recupera a View da Configuração de Rotas
        let view = this._routes[path];

        //Verifica seExiste Implementação da View
        if (!(view instanceof View)){
            history.replaceState("", "", "/not-found");
            this.navigateTo("/not-found");
            return;
        }

        //Inicializa a View
        view.init();
    }

}

export { Router }
