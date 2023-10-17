import db from '../database/conecaoDb.js';
import utilitarios from '../helpers/utilitarios.js';
const {verificaCamposEmBranco, resgatarIdUsuarioPorToken} = utilitarios;

import Services from '../services/index.js'
const {TransacoesServices, CategoriasServices} =  Services;
const transacaoServices = new TransacoesServices();
const categoriasServices = new CategoriasServices();

class TransacoesController{

  static async listarTransacoes(req, res){
    const {filtro} = req.query;
    try {
      //Resgatando id de usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);
  
      if(filtro){
        const transacao =  await transacaoServices.listarRegistroPorFiltro('categorias.descricao', filtro, idUsuario)
        return res.status(200).send(transacao);
      }

      //Buscando transações do usuário
      const transacoes = await transacaoServices.listarTodosOsRegistros(idUsuario);

  
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
      const [transacoes] = await transacaoServices.listarRegistro('transacoes.id',id, idUsuario);

      //Verifica se existe trnsação pelo id de usuário
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
      const [categoriaExiste] = await categoriasServices.listarRegistro(categoria_id, idUsuario);

      //Verificando se categoria existe
      if(!categoriaExiste){
        return res.status(404).send({mensagem: 'Categoria informada não existe, ou não estar associada ao usuário'});
      }
      
      //Cadastando transação
      const [idNovaTransacao] = await transacaoServices.cadastrarRegistro({descricao, valor, data, categoria_id, usuario_id: idUsuario, tipo});

      //Buscando transação  recente cadastratada
      const [novaTransacao] = await transacaoServices.listarRegistro('transacoes.id',idNovaTransacao, idUsuario);

      return res.status(201).send(novaTransacao);
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
      const [transacao] = await transacaoServices.listarRegistro('transacoes.id',id, idUsuario);

      //Verificando se transação é de usuário 
      if(!transacao){
        return res.status(404).send({mensagem: 'Transação informada não existe, ou não estar associada ao usuário'});
      }

      //Verificando se existe categoria cadastrada
      const [categoriaExiste] = await categoriasServices.listarRegistro(categoria_id, idUsuario);

      //Verificando se categoria existe
      if(!categoriaExiste){
        return res.status(404).send({mensagem: 'Categoria informada não existe, ou não estar associada ao usuário'});
      }
      
      //Atualizando transação
      const resultadoAtualizacao = await transacaoServices.atualizarDadosRegistros({descricao, valor, data, categoria_id, usuario_id: idUsuario, tipo}, 'id', id);

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

    try {

      //Resgatando id de Usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);

      //Verificando se existe transação cadastrada pelo usuário
      const [transacao] = await transacaoServices.listarRegistro('transacoes.id',id, idUsuario);

      //Verificando se transação é de usuário 
      if(!transacao){
        return res.status(404).send({mensagem: 'Transação informada não existe, ou não estar associada ao usuário'});
      }
      
      //Excluindo transação por id
      const resultadoExclusao = await transacaoServices.excluirRegistro('id', id);

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

  static async extratoTransacao(req, res){
   
    try {

      //Resgatando id de Usuário pelo token
      const idUsuario = await resgatarIdUsuarioPorToken(req);
      
      //Valor total das transações de entrada
      const [valorTransacaoEntrada] = await transacaoServices.gerarValorTotalEntrada(idUsuario);

      //valor total das tansações de saída
      const [valorTransacaoSaida] = await transacaoServices.gerarValorTotalSaida(idUsuario);

      //Gerando o extrato com valores de entrada e saida das transações
      const extrato = calcularTotalTransacoes(valorTransacaoEntrada, valorTransacaoSaida);  
      
      return res.status(200).send(extrato)
  
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

function calcularTotalTransacoes(entrada, saida){
  let valorEntrada = entrada.valorTotal;
  let valoSaida = saida.valorTotal;     
  if((valorEntrada === null) ) {
    valorEntrada = 0;
  }else if ((valoSaida === null) ) {
    valoSaida = 0;
  }
  const extrato = {
    entrada: Number(valorEntrada),
    saida: Number(valoSaida)
  }
  return extrato;
}


export default TransacoesController;