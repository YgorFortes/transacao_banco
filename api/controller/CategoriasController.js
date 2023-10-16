import db from '../database/conecaoDb.js';
import utilitarios from '../helpers/utilitarios.js';
const {verificaCamposEmBranco, resgatarIdUsuarioPorToken} = utilitarios;

import Services from '../services/index.js'
const {CategoriasServices} =  Services;
const categoriasServices = new CategoriasServices();

class CategoriasController{

  static async listarCategorias(req, res){
    try {

      //Resgatando id de usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);
      const categoriasUsuarios = await categoriasServices.listarTodosResgistro(idUsuario);
   
      return res.status(200).send(categoriasUsuarios);
    
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async listarCategoriaPorId(req, res){
    const {id} =  req.params;
    try {
  
      //Resgatando id de usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);

      //Buscando categoria por id
      const [categoria] = await categoriasServices.litarRegistroPorId(id, idUsuario);

      //Verificando se categoria existe
      if((!categoria)){
        return  res.status(404).send({mensagem: "Categoria não encontrada."})
      }
   
      return res.status(200).send(categoria);
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async cadastrarCategoria(req, res){
    const {descricao} = req.body;
    try {
      //Resgatando id de usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);


      //Verificando se algum campo ficou em branco
      const erroCampos = verificaCamposEmBranco(req.body, 'descricao');
      if(erroCampos){
        return res.status(409).send({mensagem: erroCampos});
      }

      //Fazendo a inserção de novo usuário
      const [idNovaCategoria] = await categoriasServices.cadastrarRegistro({usuario_id: idUsuario, descricao});

      //Buscando novo Usuário
      const [novaCategoria] = await categoriasServices.litarRegistroPorId(idNovaCategoria, idUsuario);

      //Verificando se categoria existe
      if((!novaCategoria)){
        return  res.status(404).send({mensagem: "Categoria não encontrada."})
      }
   
      return res.status(200).send(novaCategoria);
      
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async atualizarCategoria(req, res){
    const {id} = req.params;
    const {descricao} = req.body;
    try {
      //Resgatando id de usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);
      
      //Verificando se algum campo ficou em branco
      const erroCampos = verificaCamposEmBranco(req.body, 'descricao');
      if(erroCampos){
        return res.status(409).send({mensagem: erroCampos});
      }

      //Buscando categoria por id
      const [categoria] = await categoriasServices.litarRegistroPorId(id, idUsuario);

      //Verificando se categoria existe
      if((!categoria)){
        return  res.status(404).send({mensagem: "Categoria não encontrada."})
      }

      //Atualizando categoria
      const resultadoAtualizacao = await categoriasServices.atualizarDadosRegistros({descricao},'id', id);

      //Verificando se atualizou com sucesso
      if(resultadoAtualizacao <1){
        return  res.status(404).send({mensagem: "Categoria não atualizada."})
      }

      return res.status(200).send({mensagem: 'Categoria cadastrada com sucesso.'})
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async excluirCategoria(req, res){
    const {id} =req.params;

    try {
      //Resgatando id de usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);

      //Buscando categoria por id
      const [categoria] = await categoriasServices.litarRegistroPorId(id, idUsuario);
      
      //Verificando se categoria existe
      if(!categoria){
        return res.status(404).send({mensagem: "Categoria não encontrada."})
      }

      //Excluindo categoria
      const resultadoExclusao = await categoriasServices.excluirRegistro('id', id);

      //Verificando se excluiu
      if(resultadoExclusao <1){
        return res.status(404).send({mensagem: "Categoria não excluída."});
      }
      
      return res.status(200).send({mensagem: 'Categoria excluída com sucesso.'})
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }
}




export default CategoriasController;