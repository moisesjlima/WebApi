using AlunosApi.Context;
using AlunosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AlunosApi.Services
{
    public class AlunosService : IAlunoService
    {
        private readonly AppDbContext _context;

        public AlunosService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Aluno>> GetAlunos()
        {
            return await _context.Alunos.AsNoTracking().ToListAsync();
        }

        public async Task<Aluno> GetAlunoById(int alunoId)
        {
            var aluno = await _context.Alunos.FindAsync(alunoId);
            return aluno!; //forcing that the value won't be null or empty
        }

        public async Task<IEnumerable<Aluno>> GetAlunosByNome(string nome)
        {
            IEnumerable<Aluno> alunos;
            if (!string.IsNullOrWhiteSpace(nome))
                alunos = await _context.Alunos.Where(x => x.Nome.Contains(nome)).ToListAsync();
            else
                alunos = await GetAlunos();

            return alunos;
        }

        public async Task CreateAluno(Aluno aluno)
        {
            _context.Alunos.Add(aluno);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAluno(Aluno aluno)
        {
            _context.Entry(aluno).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAluno(int alunoId)
        {
            var aluno = await GetAlunoById(alunoId);

            _context.Entry(aluno).State = EntityState.Deleted;
            _context.Remove(aluno);
            await _context.SaveChangesAsync();
        }
    }
}