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
      const [usuario] = await db('usuarios').where('email', email);
      if(!usuario){
        return res.status(409).send({mensagem: 'Usuário inválido. Email não cadastrado.'}) ;
      }

      //validando senha
      const validaSenha = await bcrypt.compare(senha, usuario.senha);
      if(!validaSenha){
        return res.status(401).send({mensagem: 'Senha inválida.'});
      }

      //Criando token com id 
      const secret = process.env.SECRET;
      const token =  jwt.sign({
        id: usuario.id,
      },secret);

      
      return res.status(200).send({usuario: {id: usuario.id, nome: usuario.nome, email: usuario.email}, token: token});

    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }
}



export default UsuariosController;