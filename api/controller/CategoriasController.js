import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import 'dotenv/config';
import db from '../database/conecaoDb.js';
import utilitarios from '../helpers/utilitarios.js';
const {verificaCamposEmBranco, resgatarIdUsuarioPorToken} = utilitarios;

class CategoriasController{

  static async listarCategorias(req, res){
    try {

      //Resgatando id de usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);

      //Puxando todas categorias associadas ao usuários
      const categoriasUsuarios = await db('categorias').select([        //Função
        'categorias.id',
        'categorias.descricao ',
        'usuarios.nome as usuario',
        'usuario_id',
      ]).distinct('categorias.id')
      .innerJoin('usuarios', function (){
        this.on('categorias.usuario_id', '=', 'usuarios.id')
        .andOn('usuarios.id', '=', idUsuario);
      });
   

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
      const [categoria] = await db('categorias').select([
        'categorias.id',
        'categorias.descricao ',
        'usuarios.nome as usuario',
        'usuario_id',
      ])
      .innerJoin('usuarios', function (){
        this.on('categorias.usuario_id', '=', 'usuarios.id')
        .andOn('usuarios.id', '=', idUsuario);
      }).where('categorias.id', id);

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

      const [idNovaCategoria] = await db('categorias').insert({usuario_id: idUsuario, descricao});

      const [novaCategoria] = await db('categorias').select([
        'categorias.id',
        'categorias.descricao ',
        'usuarios.nome as usuario',
        'usuario_id',
      ])
      .innerJoin('usuarios', function (){
        this.on('categorias.usuario_id', '=', 'usuarios.id')
        .andOn('usuarios.id', '=', idUsuario);
      }).where('categorias.id', idNovaCategoria);

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
      const [categoria] = await db('categorias')
      .innerJoin('usuarios', function (){
        this.on('categorias.usuario_id', '=', 'usuarios.id')
        .andOn('usuarios.id', '=', idUsuario);
      }).where('categorias.id', id);
      

      
      //Verificando se categoria existe
      if((!categoria)){
        return  res.status(404).send({mensagem: "Categoria não encontrada."})
      }

      const resultado = await  db('categorias').update({descricao}).where('id', id);
      if(resultado <1){
        return  res.status(404).send({mensagem: "Categoria não atualizada."})
      }

      return res.status(200).send({mensagem: 'Categoria cadastrada com sucesso.'})
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }
}

// async function verificaCategoriaCadastrada(res, parametro, ...novosDados){
//   const [emailCadastrado] =  db(this.nomeTabela).count(parametro).where(parametro,valorParametro);
//   const quantidadeEmail = emailCadastrado['count(`email`)'];
//   if(quantidadeEmail >0){
//     return res.status(409).send({mensagem: 'Email já cadastrado. Por favor digite outro!'});
//   }
// }



export default CategoriasController;