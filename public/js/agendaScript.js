const mesAno = document.getElementById('mes-ano');
const diasTabela = document.getElementById('dias');
const dias = diasTabela ? diasTabela.getElementsByTagName('tbody')[0] : null;
const anterior = document.getElementById('anterior');
const proximo = document.getElementById('proximo');
const calendario = document.getElementById('calendario');
const sobreposicao = document.getElementById('sobreposicao');
const fecharSobreposicao = document.querySelector('.fechar-sobreposicao');
const dataAgendamento = document.getElementById('data');
const diasFuncionamento = [1, 2, 3, 4, 5]; // segunda a sexta

let dataAtual = new Date();
let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();

function mostrarCalendario(mes, ano) {
  if (!mesAno || !dias) return;

  const primeiroDia = new Date(ano, mes).getDay();
  const diasNoMes = 32 - new Date(ano, mes, 32).getDate();
  const diasNoMesAnterior = 32 - new Date(ano, mes - 1, 32).getDate();

  mesAno.textContent = `${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(ano, mes))} ${ano}`;
  dias.innerHTML = '';

  let data = 1;
  let linha = document.createElement('tr');
  for (let i = 0; i < 42; i++) {
    if (i < primeiroDia) {
      const diaAnterior = diasNoMesAnterior - primeiroDia + i + 1;
      linha.innerHTML += `<td class="mes-anterior">${diaAnterior}</td>`;
    } else if (data > diasNoMes) {
      const diaPosterior = data - diasNoMes;
      linha.innerHTML += `<td class="mes-posterior">${diaPosterior}</td>`;
      data++;
    } else {
      const diaSemana = new Date(ano, mes, data).getDay();
      const classeDiaFechado = diasFuncionamento.includes(diaSemana) ? '' : 'dia-fechado';
      linha.innerHTML += `<td class="${classeDiaFechado}">${data}</td>`;
      data++;
    }

    if ((i + 1) % 7 === 0) {
      dias.appendChild(linha);
      linha = document.createElement('tr');
    }
  }
}

if (mesAno && dias && anterior && proximo) {
  mostrarCalendario(mesAtual, anoAtual);

  anterior.addEventListener('click', () => {
    mesAtual--;
    if (mesAtual < 0) {
      mesAtual = 11;
      anoAtual--;
    }
    mostrarCalendario(mesAtual, anoAtual);
  });

  proximo.addEventListener('click', () => {
    mesAtual++;
    if (mesAtual > 11) {
      mesAtual = 0;
      anoAtual++;
    }
    mostrarCalendario(mesAtual, anoAtual);
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const selectHora = document.getElementById('hora');
    if (selectHora) {
        const horaMin = 8;
        const horaMax = 18;
        const step = 30; // minutos

        // Defina aqui o intervalo de almoço (exemplo: das 12:00 às 13:00,para esconder 12 e 12:30)
        const almocoInicio = "12:00";
        const almocoFim = "13:00";

        function estaNoIntervaloAlmoco(hora, min) {
            const horario = `${String(hora).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
            return horario >= almocoInicio && horario < almocoFim;
        }

        for (let h = horaMin; h <= horaMax; h++) {
            for (let m = 0; m < 60; m += step) {
                // Não adicionar 18:30, 18:30+ etc, só até 18:00
                if (h === horaMax && m > 0) continue;
                // Valida Horario de almoço
                if (estaNoIntervaloAlmoco(h, m)) continue;

                const horaStr = String(h).padStart(2, '0');
                const minStr = String(m).padStart(2, '0');
                const value = `${horaStr}:${minStr}`;
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                selectHora.appendChild(option);
            }
        }
    }
});

// calendario.addEventListener('click', (evento) => {

//     if (evento.target.tagName === 'TD' && evento.target.textContent !== '') {
//         sobreposicao.style.display = 'flex';
//     }
    
// });

if (calendario && sobreposicao) {
  calendario.addEventListener('click', (evento) => {
      if (
          evento.target.tagName === 'TD' &&
          evento.target.textContent !== '' &&
          !evento.target.classList.contains('mes-anterior') &&
          !evento.target.classList.contains('mes-posterior') &&
          !evento.target.classList.contains('dia-fechado')
      ) {
          sobreposicao.style.display = 'flex';
          const diaClicado = evento.target.textContent.padStart(2, '0');
          const dataFormatada = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${diaClicado}`;
          if (dataAgendamento) {
              dataAgendamento.value = dataFormatada;
          }
        }
  });
}

if (fecharSobreposicao && sobreposicao) {
  fecharSobreposicao.addEventListener('click', () => {
      sobreposicao.style.display = 'none';
  });
}
