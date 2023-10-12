import db from '../database/conecaoDb.js';
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import 'dotenv/config';
import verificaCamposEmBranco from '../helpers/utilitarios.js'

class UsuariosController{
    
  static async cadastrarUsuario(req, res){
    const {nome, email, senha} = req.body;

    try {

      //Verificando os  campos obrigátorios
      verificaCamposEmBranco(req.body, res, 'nome', 'email', 'senha');
      
      //Verificando se existe usuário cadastrado com o email
      const [usuarioExiste] = await db('usuarios').where('email',email);
      if(usuarioExiste){
        return res.status(409).send({mensagem: 'Email já cadastrado'}) ;
      }

      //Criptografando a senha 
      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(senha, salt);

      //Persistindo o novo usuário no banco
      const [id] = await db('usuarios').insert({nome, email, senha: senhaHash});
      const [novoUsuario] = await db('usuarios').where('id', id);
  
      return res.status(201).send({id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email});
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async login(req, res){
    const {email, senha} = req.body;

    try {
      //Verificando os  campos obrigátorios
      verificaCamposEmBranco(req.body, res, 'email', 'senha');

      //Verificando se existe usuário cadastrado com email fornecedo
      const [usuarioEncontrado] = await db('usuarios').where('email', email);
      if(!usuarioEncontrado){
        return res.status(409).send({mensagem: 'Usuário inválido. Email não cadastrado.'}) ;
      }

       

      //validando senha
      const validaSenha = await bcrypt.compare(senha, usuarioEncontrado.senha);
      if(!validaSenha){
        return res.status(401).send({mensagem: 'Senha inválida.'});
      }
console.log(usuarioEncontrado.id)
      //Criando token com id 
      const secret = process.env.SECRET;
      const token =  jwt.sign({
        id: usuarioEncontrado.id,
      },secret);

      //criando um objeto de usuário sem a senha
      const usuario = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email
      }
      
      return res.status(200).send({usuario: usuario, token: token});

    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async detalharUsuario(req, res){

    //Buscando token e resgatando o id de usuário
    const secret = process.env.SECRET;
    const token = req.get('authorization').split(' ')[1];
    const idUsario = await jwt.verify(token, secret).id;

    try {

      //Verificando se usuário existe
      const [usuarioEncontrado] = await db('usuarios').where('id', idUsario);
      if(!usuarioEncontrado){
        return res.status(404).send({mensagem: 'Usuário não encontrado'});
      }

      //criando um objeto de usuário sem a senha
      const usuario = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email
      }

      return res.status(200).send(usuario)
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }

  }

  static async atualizarUsuario(req, res){
    console.log('HEHEHEHHEHEHE SHOW HEHEHEHHE');
  }
}



export default UsuariosController;