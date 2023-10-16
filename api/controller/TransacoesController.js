import db from "../database/conecaoDb.js";
import utilitarios from '../helpers/utilitarios.js';
const {verificaCamposEmBranco, resgatarIdUsuarioPorToken} = utilitarios;

class TransacoesController{

  static async listarTransacoes(req, res){

    try {
      //Resgatando id de usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);

      //Buscando transações do usuário
      const transacoes = await db('transacoes').select([
        'transacoes.id',
        'transacoes.descricao',
        'transacoes.valor',
        'transacoes.data',
        'transacoes.categoria_id',
        'transacoes.usuario_id',
        'transacoes.tipo',
        'usuarios.nome as usuario',
        'categorias.descricao as categoria_nome'
      ])
      .innerJoin('categorias', function(){
        this.on('transacoes.categoria_id', '=', 'categorias.id')
      })
      .innerJoin('usuarios', function (){
        this.on('transacoes.usuario_id', '=', 'usuarios.id')
        .andOn('usuarios.id',  '=', idUsuario);
      })

  
      return res.status(200).send({mensagem: transacoes});
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
   
  }
}


export default TransacoesController;