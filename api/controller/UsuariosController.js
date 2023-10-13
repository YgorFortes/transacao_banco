import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import 'dotenv/config';
import utilitarios from '../helpers/utilitarios.js';
const {verificaCamposEmBranco, resgatarIdUsuarioPorToken} = utilitarios;

import UsuariosServices from '../services/index.js';
const usuariosServices = new UsuariosServices();

class UsuariosController{
    
  static async cadastrarUsuario(req, res){
    const {nome, email, senha} = req.body;

    try {

      //Verificando os  campos obrigátorios
      const erroCampos = verificaCamposEmBranco(req.body, 'nome', 'email', 'senha');
      if(erroCampos){
        return res.status(409).send({mensagem: erroCampos}) ;
      }
      
      // Verificando se existe usuário cadastrado com o email
      const [usuarioExiste] = await usuariosServices.listarRegistro('email', email);
      if(usuarioExiste){
        return res.status(409).send({mensagem: 'Email já cadastrado'}) ;
      }

      //Criptografando a senha 
      const senhaCriptografada = await criptografandoSenha(senha);

      // //Persistindo o novo usuário no banco
      const [id] = await usuariosServices.cadastrarRegistro({nome, email, senha: senhaCriptografada});
      const [novoUsuario] = await usuariosServices.listarRegistro('id', id) ;

      // //Escondendo a senha do usuário
      const usuarioSemSenha =   escondendoSenhaUsuario(novoUsuario);

      return res.status(201).send(usuarioSemSenha); 

    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async login(req, res){
    const {email, senha} = req.body;

    try {
      //Verificando os  campos obrigátorios
      const  erroCampos = verificaCamposEmBranco(req.body, 'email', 'senha');
      if(erroCampos){
        return res.status(409).send({mensagem: erroCampos}) ;
      }

      //Verificando se existe usuário cadastrado com email fornecedo
      const [usuarioEncontrado] = await usuariosServices.listarRegistro('email', email); 
      if(!usuarioEncontrado){
        return res.status(409).send({mensagem: 'Usuário inválido. Email não cadastrado.'}) ;
      }


      //validando senha
      await validandoSenha(res,senha, usuarioEncontrado);

      
      //Criando token com id 
      const token =  await criarToken(usuarioEncontrado);

      //criando um objeto de usuário sem a senha
      const usuarioSemSenha =   escondendoSenhaUsuario(usuarioEncontrado);
      
      return res.status(200).send({usuario: usuarioSemSenha, token: token});

    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async detalharUsuario(req, res){

    //Buscando token e resgatando o id de usuário
    const idUsuario = await resgatarIdUsuarioPorToken(req);

    try {
      
      //Verificando se usuário existe
      const [usuarioEncontrado] = await usuariosServices.listarRegistro('id', idUsuario);

      if(!usuarioEncontrado){
        return res.status(404).send({mensagem: 'Usuário não encontrado'});
      }

      //criando um objeto de usuário sem a senha
      const usuarioSemSenha = escondendoSenhaUsuario(usuarioEncontrado);

      return res.status(200).send(usuarioSemSenha);

    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }

  }

  static async atualizarUsuario(req, res){
    const {nome, email, senha} = req.body;


    //Buscando token e resgatando o id de usuário
    const idUsuario = await resgatarIdUsuarioPorToken(req);

    try {

      //Verificando os  campos obrigátorios
      const erroCampos = verificaCamposEmBranco(req.body, 'nome','email', 'senha');
      if(erroCampos){
        return res.status(409).send({mensagem: erroCampos}) ;
      }

      //Verificando se email já foi cadastrado no banco
      await verificandoSeEmailJaCadastrado(res, email);

      //Criptografando senha
      const senhaCriptografada = await criptografandoSenha(senha);
      
      //Atualizando Usuário
      const resultado = await usuariosServices.atualizarDadosRegistros({nome, email, senha: senhaCriptografada}, 'id', idUsuario);
      if(!resultado){
        return res.status(400).send({mensagem: 'Erro ao atualizar'});
      }

      //Mudar quando for colocado no final
      return res.status(201).send({mensagem: 'Usuário atualizado'})
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }
}



async function verificandoSeEmailJaCadastrado(res, email){
  const [emailCadastrado] = await usuariosServices.verificaEmailCadastrado('email', email);
  const quantidadeEmail = emailCadastrado['count(`email`)'];

  if(quantidadeEmail >0){
    return res.status(409).send({mensagem: 'Email já cadastrado. Por favor digite outro!'});
  }
  
}

async function criptografandoSenha(senha){
  const salt = await bcrypt.genSalt(12);
  const senhaHash = await bcrypt.hash(senha, salt);
  return senhaHash;
}

async function validandoSenha(res, senha, usuario){
  const validaSenha = await bcrypt.compare(senha, usuario.senha);
  if(!validaSenha){
    return res.status(401).send({mensagem: 'Senha inválida.'});
  }
}

 function escondendoSenhaUsuario(usuario){
  const usuarioSemSenha = {
    id: usuario.id, 
    nome: usuario.nome, 
    email: usuario.email
  }
  return usuarioSemSenha;
}

async function criarToken(usuario){
  const secret = process.env.SECRET;
  const token =  jwt.sign({
    id: usuario.id,
  },secret);

  return token;
}



export default UsuariosController;