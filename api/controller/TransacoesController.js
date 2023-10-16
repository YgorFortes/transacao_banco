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
      });

  
      return res.status(200).send(transacoes);
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
   
  }

  static async listarTransacaoPorId(req, res){
    const {id} = req.params;
    try {

      //Buscando id de usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);

      //Buscando transação do usuário
      const [transacoes] = await db('transacoes').select([
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
      .where('transacoes.id', id)

      if(!transacoes){
        return res.status(404).send({mensagem: 'Transação não encontrada'});
      }


      return res.status(200).send(transacoes);
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async cadastrarTransacao(req, res){
    const {descricao, valor, data, categoria_id, tipo} = req.body;
    
    try {

      //Buscando id de usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);
      
      //Verificando se campos 
      const erroCampos = verificaCamposEmBranco(req.body, 'descricao', 'valor', 'data', 'categoria_id', 'tipo');
      if(erroCampos){
        return res.status(409).send({mensagem: erroCampos});
      }

      //Validando se o campo tipo foi escrito de forma correta
      const erroTipo = verificandoTipoSaida(tipo);
      if(erroTipo){
        return res.status(409).send({mensagem: erroTipo});
      }


     
      //Verificando se existe categoria cadastrada
      const [categoriaExiste] = await db('categorias').select([
        'categorias.id',
        'categorias.descricao ',
        'usuarios.nome as usuario',
        'usuario_id',
      ])
      .innerJoin('usuarios', function (){
        this.on('categorias.usuario_id', '=', 'usuarios.id')
        .andOn('usuarios.id', '=', idUsuario);
      }).where('categorias.id', categoria_id);

      //Verificando se categoria existe
      if(!categoriaExiste){
        return res.status(404).send({mensagem: 'Categoria informada não existe, ou não estar associada ao usuário'});
      }
      
      //Cadastando transação
      const [idNovaTransacao] = await db('transacoes').insert({descricao, valor, data, categoria_id, usuario_id: idUsuario, tipo});

      //Buscando transação  recente cadastratada
      const [novaTransacao] = await db('transacoes').select([
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
      .where('transacoes.id', idNovaTransacao);

      return res.status(200).send(novaTransacao);
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
   
  }

  static async atualizarTransacao(req, res){
    const{descricao, valor, data, categoria_id, tipo} = req.body;
    const {id} = req.params;
    try {

       //Buscando id de usuário pelo token
       const idUsuario = await resgatarIdUsuarioPorToken(req);

       //Verificando se campos 
      const erroCampos = verificaCamposEmBranco(req.body, 'descricao', 'valor', 'data', 'categoria_id', 'tipo');
      if(erroCampos){
        return res.status(409).send({mensagem: erroCampos});
      }

      
      //Validando se o campo tipo foi escrito de forma correta
      const erroTipo = verificandoTipoSaida(tipo);
      if(erroTipo){
        return res.status(409).send({mensagem: erroTipo});
      }


      //Verificando se existe transação cadastrada pelo usuário
      const [transacao] = await db('transacoes').select([
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
      .where('transacoes.id', id);

      //Verificando se transação é de usuário 
      if(!transacao){
        return res.status(404).send({mensagem: 'Transação informada não existe, ou não estar associada ao usuário'});
      }

      //Verificando se existe categoria cadastrada
      const [categoriaExiste] = await db('categorias').select([
        'categorias.id',
        'categorias.descricao ',
        'usuarios.nome as usuario',
        'usuario_id',
      ])
      .innerJoin('usuarios', function (){
        this.on('categorias.usuario_id', '=', 'usuarios.id')
        .andOn('usuarios.id', '=', idUsuario);
      }).where('categorias.id', categoria_id);

      //Verificando se categoria existe
      if(!categoriaExiste){
        return res.status(404).send({mensagem: 'Categoria informada não existe, ou não estar associada ao usuário'});
      }
      
      //Atualizando transação
      const resultadoAtualizacao = await db('transacoes').update({descricao, valor, data, categoria_id, usuario_id: idUsuario, tipo}).where('id', id);

      //Verificando se atualizou com sucesso
      if(resultadoAtualizacao <1){
        return res.status(409).send({mensagem: "Transação não atualizada."});
      }
      return res.status(200).send({mensagem: 'Transação atualizada com sucesso.'})
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async excluirTransacao(req, res){
    const {id} = req.params;
    const{descricao, valor, data, categoria_id, tipo} = req.body;

    try {

      //Resgatando id de Usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);

       //Verificando se existe transação cadastrada pelo usuário
       const [transacao] = await db('transacoes').select([
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
      .where('transacoes.id', id);

      //Verificando se transação é de usuário 
      if(!transacao){
        return res.status(404).send({mensagem: 'Transação informada não existe, ou não estar associada ao usuário'});
      }
      
      //Excluindo transação por id
      const resultadoExclusao = await db('transacoes').delete().where('id', id);

      //Verificando se deletou com sucesso
      if(resultadoExclusao <1){
        return res.status(409).send({mensagem: "Transação não excluída."});
      }
      return res.status(200).send({mensagem: 'Transação excluída com sucesso.'})

    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }


}

 function verificandoTipoSaida(tipo){
  // const tipoFormatado= tipo.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  let mensagem ;
  if((tipo !== 'saida') && (tipo !=='entrada') ){
    return mensagem = 'Digite saida ou entrada sem letras com acento, ou maísculas';
  }

}


export default TransacoesController;