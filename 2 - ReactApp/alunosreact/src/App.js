import React, { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import logoCadastro from './assets/cadastro.png'


function App() {

  const baseUrl = "https://localhost:7077/api/alunos"

  const [data, setData]=useState([])
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [updateData, setUpdateData] = useState(true);
  const [modalExcluir, setModalExcluir] = useState(false);

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  }

  //GET
  const pedidoGet = async() => {
    await axios.get(baseUrl)
    .then(response => {
      setData(response.data)
    }).catch(error => {
      console.log(error)
    })
  }

  //POST
  const pedidoPost = async() => {
    delete alunoSelecionado.alunoId
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade)
    await axios.post(baseUrl, alunoSelecionado)
      .then(response => {
        setData(data.concat(response.data))
        setUpdateData(true);
        abrirFecharModalIncluir()
      }).catch(error => {
        console.log(error)
      })
  }

  //PUT
  const pedidoPut = async () => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios.put(baseUrl + "/" + alunoSelecionado.alunoId, alunoSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(aluno => {
          if (aluno.alunoId === alunoSelecionado.alunoId) {
            aluno.nome = resposta.nome;
            aluno.email = resposta.email;
            aluno.idade = resposta.idade;
          }
        });
        setUpdateData(true);
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  //DELETE
  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + alunoSelecionado.alunoId)
      .then(response => {
        setData(data.filter(aluno => aluno.alunoId !== response.data));
        setUpdateData(true);
        abrirFecharModalExcluir();
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    if(updateData) {
      pedidoGet()
      setUpdateData(false)
    }
  }, [updateData])


  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    idade: ''
  })

  const selecionarAluno = (aluno, opcao) => {
    setAlunoSelecionado(aluno);
    (opcao === "Editar") ?
      abrirFecharModalEditar() : abrirFecharModalExcluir();
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado,
      [name]: value
    });
    console.log(alunoSelecionado);
  }

  return (
    <div className="aluno-container">
      <h3>Cadastro de Alunos</h3>
      <header className="App-header">
        <img src={logoCadastro} alt="imagem logo de cadastro"></img>
        <button className="btn btn-success" onClick={() => abrirFecharModalIncluir()}>Incluir novo Aluno</button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(aluno=>(
            <tr key={aluno.alunoId}>
              <td>{aluno.alunoId}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button className="btn btn-primary" onClick={() => selecionarAluno(aluno, "Editar")}>Editar</button> {" "}
                <button className="btn btn-danger" onClick={() => selecionarAluno(aluno, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Alunos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br/>
            <input type="text" className="form-control" name="nome" onChange={handleChange}/>
              <br/>
              <label>email: </label>
            <br />
              <input type="email" className="form-control" name="email" onChange={handleChange}></input>
            <br/>
              <label>Idade: </label>
            <br/>
              <input type="text" className="form-control" name="idade" onChange={handleChange}></input>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button> {"  "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Aluno</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input type="text" className="form-control" readOnly
              value={alunoSelecionado && alunoSelecionado.alunoId} />
            <br />
            <label>Nome: </label><br />
            <input type="text" className="form-control" name="nome" onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.nome} /><br />
            <label>Email: </label><br />
            <input type="text" className="form-control" name="email" onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.email} /><br />
            <label>Idade: </label><br />
            <input type="text" className="form-control" name="idade" onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.idade} /><br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>Editar</button>{"  "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste(a) aluno(a) : {alunoSelecionado && alunoSelecionado.nome} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => pedidoDelete()} > Sim </button>
          <button className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()} > Não </button>
        </ModalFooter>
      </Modal>

    </div>
    
  );
}

export default App;