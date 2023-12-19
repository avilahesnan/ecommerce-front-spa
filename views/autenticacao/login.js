import { View } from "../../js/view.js";

class LoginView extends View {

    /////////////
    //Atributos//
    /////////////

    _eventLogin;
   
    //////////////
    //Construtor//
    //////////////

    constructor(contentView, templatePath = '/views/autenticacao/login.html') {
        super(contentView, templatePath);
    }

    ///////////////////////
    //Metodos Assincronos//
    ///////////////////////

    async init() {
        await this.show();
    }

}

export { LoginView }