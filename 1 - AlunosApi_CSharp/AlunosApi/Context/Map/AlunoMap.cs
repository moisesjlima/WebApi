using AlunosApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AlunosApi.Context.Map
{
    public class AlunoMap : IEntityTypeConfiguration<Aluno>
    {

        public void Configure(EntityTypeBuilder<Aluno> builder)
        {
            builder.HasData(
                new Aluno
                {
                    AlunoId = 1,
                    Nome = "Maria",
                    Email = "maria@gmail.com",
                    Idade = 23
                },
                new Aluno   
                {
                    AlunoId = 2,
                    Nome = "Manuel",
                    Email = "manoel@gmail.com",
                    Idade = 24
                });

            builder.HasKey(x => x.AlunoId);
        }
    }
}