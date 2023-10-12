import Services from "./services.js";
import db from '../database/conecaoDb.js';
class UsuariosServices extends Services{
  constructor(){
    super('usuarios');
  }

  async verificaEmailCadastrado(parametro, valorParametro){
    return db(this.nomeTabela).count(parametro).where(parametro,valorParametro);
  }
}

export default UsuariosServices;