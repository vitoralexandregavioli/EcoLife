// Faz uma estimativa educativa com contas simples no próprio navegador.
const formularioCalculadora = document.getElementById('form-calculadora');
const botaoCalcular = document.getElementById('botao-calcular');
const resultadoCalculadora = document.getElementById('resultado-calculadora');
const estadoCalculadora = document.getElementById('estado-calculadora');

// Valores aproximados usados apenas para ilustrar as fórmulas.
const FATOR_CARRO_KG_CO2_POR_KM = 0.12;
const FATOR_ENERGIA_KG_CO2_POR_KWH = 0.4;
const SEMANAS_POR_MES = 4;

// Formata números com vírgula decimal no padrão brasileiro.
function formatarNumero(valor) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(valor);
}

// Cria uma recomendação em uma lista sem inserir conteúdo como HTML.
function adicionarRecomendacao(lista, mensagem) {
  const item = document.createElement('li');
  item.className = 'flex items-start gap-2 text-sm leading-6 text-slate-700';
  const icone = document.createElement('i');
  icone.dataset.lucide = 'leaf';
  icone.className = 'mt-1 h-4 w-4 shrink-0 text-natureza';
  icone.setAttribute('aria-hidden', 'true');
  const texto = document.createElement('span');
  texto.textContent = mensagem;
  item.append(icone, texto);
  lista.append(item);
}

// Gera recomendações de acordo com os valores informados pela pessoa.
function gerarRecomendacoes(kmCarroSemana, kwhPoupados, kgReciclados) {
  const recomendacoes = [];
  if (kmCarroSemana > 0) {
    recomendacoes.push('Continue substituindo trajetos curtos de carro por caminhada, bicicleta ou transporte coletivo quando for viável.');
  } else {
    recomendacoes.push('Experimente escolher um trajeto curto para fazer a pé, de bicicleta ou em transporte coletivo.');
  }

  if (kwhPoupados >= 10) {
    recomendacoes.push('Você já estima uma boa economia de energia. Mantenha o acompanhamento mensal para perceber mudanças.');
  } else {
    recomendacoes.push('Apague luzes em ambientes vazios e evite deixar aparelhos ligados sem necessidade.');
  }

  if (kgReciclados > 0) {
    recomendacoes.push('Continue separando materiais limpos e secos e confirme quais itens a coleta da sua região recebe.');
  } else {
    recomendacoes.push('Comece separando papel, plástico, vidro e metal limpos, seguindo a coleta seletiva local.');
  }
  return recomendacoes;
}

// Valida os valores, calcula a estimativa e atualiza os resultados na tela.
async function calcularImpacto(evento) {
  evento.preventDefault();
  estadoCalculadora.classList.add('hidden');

  const kmCarroSemana = Number(document.getElementById('km-carro').value);
  const kwhPoupados = Number(document.getElementById('kwh-poupados').value);
  const kgReciclados = Number(document.getElementById('kg-reciclados').value);
  const camposTexto = [
    document.getElementById('km-carro').value,
    document.getElementById('kwh-poupados').value,
    document.getElementById('kg-reciclados').value
  ];
  const campos = [kmCarroSemana, kwhPoupados, kgReciclados];

  if (
    camposTexto.some((valor) => valor === '') ||
    campos.some((valor) => !Number.isFinite(valor) || valor < 0) ||
    kmCarroSemana > 1000 || kwhPoupados > 10000 || kgReciclados > 10000
  ) {
    await EcoUI.avisar('Valores inválidos', 'Preencha os três campos com valores dentro dos limites indicados.', 'warning');
    return;
  }

  botaoCalcular.disabled = true;
  botaoCalcular.querySelector('span').textContent = 'Calculando...';

  try {
    // Converte os quilômetros semanais em estimativa mensal usando quatro semanas.
    const co2Transporte = kmCarroSemana * SEMANAS_POR_MES * FATOR_CARRO_KG_CO2_POR_KM;
    // Multiplica a energia economizada pelo fator didático por kWh.
    const co2Energia = kwhPoupados * FATOR_ENERGIA_KG_CO2_POR_KWH;
    // A reciclagem é mostrada como massa separada, sem converter para CO2.
    const totalCo2 = co2Transporte + co2Energia;

    document.getElementById('resultado-transporte').textContent = `${formatarNumero(co2Transporte)} kg CO₂/mês`;
    document.getElementById('resultado-energia').textContent = `${formatarNumero(co2Energia)} kg CO₂/mês`;
    document.getElementById('resultado-reciclagem').textContent = `${formatarNumero(kgReciclados)} kg/mês`;
    document.getElementById('resultado-total').textContent = `${formatarNumero(totalCo2)} kg CO₂/mês`;

    const listaRecomendacoes = document.getElementById('lista-recomendacoes');
    listaRecomendacoes.replaceChildren();
    for (const recomendacao of gerarRecomendacoes(kmCarroSemana, kwhPoupados, kgReciclados)) {
      adicionarRecomendacao(listaRecomendacoes, recomendacao);
    }

    resultadoCalculadora.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
    await EcoUI.avisar('Estimativa calculada', 'Veja os resultados e as recomendações personalizadas na página.', 'success');
  } catch (erro) {
    console.error('Erro ao calcular o impacto:', erro);
    await EcoUI.avisar('Não foi possível calcular', 'Revise os valores e tente novamente.', 'error');
  } finally {
    botaoCalcular.disabled = false;
    botaoCalcular.querySelector('span').textContent = 'Calcular impacto';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  formularioCalculadora.addEventListener('submit', calcularImpacto);
});
