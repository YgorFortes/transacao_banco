import Services from "./services.js";
import db from '../database/conecaoDb.js';
class CategoriasServices extends Services{
  constructor(){
    super('categorias');
  }

  async listarTodosResgistro(idUsuario){
    return db('categorias').select([       
      'categorias.id',
      'categorias.descricao ',
      'usuarios.nome as usuario',
      'usuario_id',
    ])
    .innerJoin('usuarios', function (){
      this.on('categorias.usuario_id', '=', 'usuarios.id')
      .andOn('usuarios.id', '=', idUsuario);
    });
  }
  


}

export default CategoriasServices