const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Regras alinhadas com public/js/agendaScript.js
const HORA_MIN = 8;
const HORA_MAX = 18;
const PASSO_MINUTOS = 30;
const ALMOCO_INICIO = "12:00";
const ALMOCO_FIM = "13:00";
const DIAS_FUNCIONAMENTO = [1, 2, 3, 4, 5]; // 0 = domingo ... 6 = sabado

function gerarHorariosFuncionamento() {
  const horarios = [];

  for (let h = HORA_MIN; h <= HORA_MAX; h += 1) {
    for (let m = 0; m < 60; m += PASSO_MINUTOS) {
      if (h === HORA_MAX && m > 0) continue;

      const horario = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      if (horario >= ALMOCO_INICIO && horario < ALMOCO_FIM) continue;

      horarios.push(horario);
    }
  }

  return horarios;
}

function formatarDataISO(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function isoDateToUTCDate(isoDate) {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function buildAgendaSeed() {
  const nomes = [
    "Ana Paula",
    "Beatriz",
    "Carla",
    "Daniela",
    "Eduarda",
    "Fernanda",
    "Gabriela",
    "Helena",
    "Isabela",
    "Juliana",
  ];
  const procedimentos = [
    { nome: "Limpeza de Pele", preco: 120 },
    { nome: "Design de Sobrancelha", preco: 55 },
    { nome: "Extensao de Cilios", preco: 180 },
    { nome: "Micropigmentacao", preco: 350 },
    { nome: "Peeling Facial", preco: 220 },
    { nome: "Massagem Relaxante", preco: 140 },
  ];
  const horarios = gerarHorariosFuncionamento();
  const hoje = new Date();
  const agenda = [];

  // Gera muitos registros para facilitar teste visual de layout e scroll.
  for (let dia = 0; dia < 30; dia += 1) {
    const dataAtual = new Date(hoje);
    dataAtual.setDate(hoje.getDate() + dia);
    if (!DIAS_FUNCIONAMENTO.includes(dataAtual.getDay())) continue;

    const data = formatarDataISO(dataAtual);

    // Mantem volume alto de dados, mas sem preencher todos os horarios do dia.
    const slotsDoDia = 8;
    for (let slot = 0; slot < slotsDoDia; slot += 1) {
      const nome = nomes[(dia + slot) % nomes.length];
      const proc = procedimentos[(dia * 2 + slot) % procedimentos.length];
      const hora = horarios[(dia * slotsDoDia + slot) % horarios.length];

      agenda.push({
        nome,
        data: isoDateToUTCDate(data),
        hora,
        preco: proc.preco,
        procedimento: proc.nome,
      });
    }
  }

  return agenda;
}

async function main() {
  const agendaSeed = buildAgendaSeed();

  await prisma.agenda.deleteMany();
  await prisma.agenda.createMany({
    data: agendaSeed,
  });

  // Produtos e Servicos deixados comentados para uso futuro.
  // const produtosSeed = [
  //   { nome: "Produto Exemplo", valor: 10, descricao: "Desc", data: "2026-01-01", estoque: 10, vendedor: "Equipe" },
  // ];
  //
  // const servicosSeed = [
  //   { imagem: "sem-imagem.jpg", nome: "Servico Exemplo", valor: 99, produto: ["Produto Exemplo"], descricao: "Desc" },
  // ];
  //
  // await prisma.produtos.deleteMany();
  // await prisma.produtos.createMany({ data: produtosSeed });
  //
  // for (const servico of servicosSeed) {
  //   await prisma.servicos.create({ data: servico });
  // }

  console.log(`Seed concluido: ${agendaSeed.length} registros em Agenda.`);
}

main()
  .catch((e) => {
    console.error("Erro ao rodar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
