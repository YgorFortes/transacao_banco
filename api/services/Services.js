import db from '../database/conecaoDb.js';
class Services{
  constructor(nomeTabela){
    this.nomeTabela = nomeTabela;
  }

  async listarRegistro(parametro, valorParametro){
    return db(this.nomeTabela).where(parametro, valorParametro);
  }

  async listarTodosResgistro(){
    return db(this.nomeTabela);
  }

  async cadastrarRegistro(dados ){
    return db(this.nomeTabela).insert(dados);
  }

  async atualizarDadosRegistros(novosDados, parametro, valorParametro){
    return db(this.nomeTabela).update(novosDados).where(parametro, valorParametro);
  }

  async excluirRegistro(parametro, valorParametro){
    return db(this.nomeTabela).delete().where(parametro, valorParametro);
  }
}

export default Services;