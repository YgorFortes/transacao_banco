import Services from "./services.js";
import db from "../database/conecaoDb.js";

class TransacoesServices extends Services{
  constructor(){
    super('transacoes');
    this.CategoriasServices = new Services('categorias');
  }

  async listarTodosOsRegistros(idUsuario){
    return  db('transacoes').select([
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
  }

  async listarRegistro(parametro, valorParametro, idUsuario){
    return db('transacoes').select([
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
    .where(parametro, valorParametro);
  }

  async listarRegistroPorFiltro(parametro, valorParametro, idUsuario){
    return   db('transacoes').select([
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
    .whereIn(parametro, valorParametro);
  }

  async gerarValorTotalEntrada(idUsuario){
    return await db('transacoes')
    .innerJoin('categorias', function(){
      this.on('transacoes.categoria_id', '=', 'categorias.id')
    })
    .innerJoin('usuarios', function (){
      this.on('transacoes.usuario_id', '=', 'usuarios.id')
      .andOn('usuarios.id',  '=', idUsuario);
    }).sum('transacoes.valor as valorTotal')
    .where('tipo', 'entrada');
    
    
  }


  async gerarValorTotalSaida(idUsuario){
    //Valor total das transações de saída
    return await db('transacoes')
    .innerJoin('categorias', function(){
      this.on('transacoes.categoria_id', '=', 'categorias.id')
    })
    .innerJoin('usuarios', function (){
      this.on('transacoes.usuario_id', '=', 'usuarios.id')
      .andOn('usuarios.id',  '=', idUsuario);
    }).sum('transacoes.valor as valorTotal')
    .where('tipo', 'saida');  
  }
}

export default TransacoesServices;