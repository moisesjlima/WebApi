using AlunosApi.Models;
using AlunosApi.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace AlunosApi.Controllers
{
    [EnableCors]
    [Route("api/alunos")]
    [ApiController]
    //[Produces("application/json")]
    public class AlunosController : ControllerBase
    {
        private IAlunoService _service;

        public AlunosController(IAlunoService service)
        {
            _service = service;
        }

        [HttpGet]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IAsyncEnumerable<Aluno>>> GetAlunos()
        {
            try
            {
                var alunos = await _service.GetAlunos();
                return Ok(alunos);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Erro ao obter alunos");
            }
        }

        [HttpGet("nome")]
        public async Task<ActionResult<IAsyncEnumerable<Aluno>>> GetAlunosByNome([FromQuery] string nome)
        {
            try
            {
                var alunos = await _service.GetAlunosByNome(nome);
                if (alunos.Count() <= 0)
                    return NotFound($"Não foi encontrado aluno com nome {nome}");

                return Ok(alunos);
            }
            catch
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Requisição inválida");
            }
        }

        [HttpGet("{alunoId}", Name = "GetAlunoById")]
        public async Task<ActionResult<IAsyncEnumerable<Aluno>>> GetAlunoById([FromRoute] int alunoId)
        {
            try
            {
                var aluno = await _service.GetAlunoById(alunoId);
                if (aluno is not Aluno)
                    return NotFound($"Não foi encontrado aluno com Id {alunoId}");

                return Ok(aluno);
            }
            catch
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Requisição inválida");
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateAluno([FromBody] Aluno aluno)
        {
            try
            {
                await _service.CreateAluno(aluno);

                return Created(nameof(GetAlunoById), aluno);
            }
            catch
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Requisição inválida");
            }
        }

        [HttpPut("{alunoId:int}")]
        public async Task<ActionResult> UpdateAluno([FromRoute] int alunoId, [FromBody] Aluno aluno)
        {
            try
            {
                if (aluno.AlunoId != alunoId)
                    BadRequest("id diferente");

                await _service.UpdateAluno(aluno);

                return Ok($"Aluno {aluno.AlunoId} foi atualizado!");
            }
            catch
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Requisição inválida");
            }
        }

        [HttpDelete("{alunoId}")]
        public async Task<ActionResult> DeleteAluno([FromRoute] int alunoId)
        {
            try
            {
                var aluno = await _service.GetAlunoById(alunoId);
                if (aluno == null)
                    return NotFound($"Não foi encontrado aluno com Id {alunoId} para deletar");

                await _service.DeleteAluno(alunoId);

                return NoContent();
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro ao excluir!");
            }
        }
    }
}