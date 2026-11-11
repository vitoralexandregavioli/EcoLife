// Guia básico de resíduos. As orientações podem variar conforme a coleta local.
const coresColeta = [
  { cor: 'Azul', representa: 'Papel e papelão', codigo: '#2563eb' },
  { cor: 'Vermelho', representa: 'Plástico', codigo: '#dc2626' },
  { cor: 'Verde', representa: 'Vidro', codigo: '#16a34a' },
  { cor: 'Amarelo', representa: 'Metal', codigo: '#eab308' },
  { cor: 'Preto', representa: 'Madeira', codigo: '#27272a' },
  { cor: 'Laranja', representa: 'Resíduos perigosos', codigo: '#f97316' },
  { cor: 'Branco', representa: 'Resíduos de serviços de saúde', codigo: '#f8fafc' },
  { cor: 'Roxo', representa: 'Resíduos radioativos', codigo: '#7e22ce' },
  { cor: 'Marrom', representa: 'Resíduos orgânicos', codigo: '#92400e' },
  { cor: 'Cinza', representa: 'Resíduo geral não reciclável ou misturado', codigo: '#64748b' }
];

// Exemplos para a busca e os filtros da página.
const guiaResiduos = [
  { nome: 'Jornal limpo e seco', grupo: 'Papel e papelão', cor: 'Azul', destino: 'reciclavel', orientacao: 'Mantenha seco e sem restos de comida.' },
  { nome: 'Papelão limpo', grupo: 'Papel e papelão', cor: 'Azul', destino: 'reciclavel', orientacao: 'Achate as caixas para ocupar menos espaço.' },
  { nome: 'Papel toalha ou guardanapo usado', grupo: 'Papel e papelão', cor: 'Cinza', destino: 'nao-reciclavel', orientacao: 'Papel engordurado ou sujo geralmente não segue para reciclagem de papel.' },
  { nome: 'Garrafa PET vazia', grupo: 'Plástico', cor: 'Vermelho', destino: 'reciclavel', orientacao: 'Esvazie a embalagem; confira se a coleta local recebe esse material.' },
  { nome: 'Embalagem plástica limpa', grupo: 'Plástico', cor: 'Vermelho', destino: 'reciclavel', orientacao: 'Esvazie e, se necessário, enxágue rapidamente.' },
  { nome: 'Fralda descartável', grupo: 'Rejeito', cor: 'Cinza', destino: 'nao-reciclavel', orientacao: 'Descarte como rejeito, conforme as orientações locais.' },
  { nome: 'Garrafa de vidro', grupo: 'Vidro', cor: 'Verde', destino: 'reciclavel', orientacao: 'Esvazie e proteja bordas quebradas para evitar acidentes.' },
  { nome: 'Pote de conserva de vidro', grupo: 'Vidro', cor: 'Verde', destino: 'reciclavel', orientacao: 'Retire restos de alimento; a tampa pode ser separada por material.' },
  { nome: 'Espelho, louça ou cerâmica', grupo: 'Vidro e rejeitos', cor: 'Cinza', destino: 'nao-reciclavel', orientacao: 'Não coloque junto com garrafas e potes de vidro; procure orientação local.' },
  { nome: 'Lata de alumínio limpa', grupo: 'Metal', cor: 'Amarelo', destino: 'reciclavel', orientacao: 'Esvazie a lata e evite deixar líquidos ou alimentos.' },
  { nome: 'Lata de aço limpa', grupo: 'Metal', cor: 'Amarelo', destino: 'reciclavel', orientacao: 'Esvazie e enxágue se houver restos de alimento.' },
  { nome: 'Restos de frutas e verduras', grupo: 'Orgânico', cor: 'Marrom', destino: 'compostavel', orientacao: 'Podem ser destinados à compostagem quando houver essa opção.' },
  { nome: 'Pilhas e baterias', grupo: 'Resíduo perigoso', cor: 'Laranja', destino: 'especial', orientacao: 'Leve a um ponto de coleta específico; não descarte no lixo comum.' },
  { nome: 'Aparelho eletrônico pequeno', grupo: 'Resíduo perigoso', cor: 'Laranja', destino: 'especial', orientacao: 'Procure ponto de recebimento de eletroeletrônicos.' },
  { nome: 'Medicamentos vencidos', grupo: 'Resíduo especial', cor: 'Laranja', destino: 'especial', orientacao: 'Consulte farmácias ou pontos municipais de coleta; não descarte no vaso sanitário.' },
  { nome: 'Madeira sem tratamento químico', grupo: 'Madeira', cor: 'Preto', destino: 'especial', orientacao: 'Verifique a existência de coleta ou reaproveitamento específico.' }
];

const perguntasQuiz = [
  { pergunta: 'Qual é a cor de referência para papel e papelão?', opcoes: ['Azul', 'Amarela', 'Verde'], correta: 0 },
  { pergunta: 'Onde deve ser separado um frasco PET vazio, se a coleta local o aceitar?', opcoes: ['Lixeira vermelha', 'Lixeira marrom', 'Lixeira roxa'], correta: 0 },
  { pergunta: 'Qual é o destino indicado para pilhas e baterias usadas?', opcoes: ['Lixo orgânico', 'Ponto de coleta específico', 'Papel reciclável'], correta: 1 },
  { pergunta: 'Restos de frutas e verduras podem ser destinados a quê?', opcoes: ['Compostagem', 'Lixeira de vidro', 'Coleta de resíduos radioativos'], correta: 0 },
  { pergunta: 'Qual item não deve ser misturado com garrafas e potes de vidro?', opcoes: ['Pote de conserva', 'Garrafa de vidro', 'Espelho ou cerâmica'], correta: 2 }
];

let filtroResiduoAtual = 'todos';
let indicePerguntaQuiz = 0;
let pontosQuiz = 0;
let quizRespondido = false;

const entradaBuscaResiduo = document.getElementById('busca-residuo');
const listaCores = document.getElementById('lista-cores');
const listaResiduos = document.getElementById('lista-residuos');
const estadoResiduos = document.getElementById('estado-residuos');

// Cria cartões de cores com os nomes e usos padronizados.
function renderizarCoresColeta() {
  const cartoes = coresColeta.map((item) => {
    const cartao = document.createElement('article');
    cartao.className = 'rounded-xl border border-slate-200 bg-white p-4';
    const amostra = document.createElement('span');
    amostra.className = 'mb-3 block h-3 rounded-full';
    amostra.style.backgroundColor = item.codigo;
    amostra.setAttribute('aria-label', `Cor ${item.cor}`);
    const nome = document.createElement('h3');
    nome.className = 'font-titulo text-sm font-semibold text-floresta';
    nome.textContent = item.cor;
    const representa = document.createElement('p');
    representa.className = 'mt-1 text-xs leading-5 text-slate-600';
    representa.textContent = item.representa;
    cartao.append(amostra, nome, representa);
    return cartao;
  });
  listaCores.replaceChildren(...cartoes);
}

// Monta os resultados sem usar innerHTML para proteger a página de XSS.
function criarCartaoResiduo(item) {
  const cartao = document.createElement('article');
  cartao.className = 'cartao-base';
  const titulo = document.createElement('h3');
  titulo.className = 'font-titulo font-semibold text-floresta';
  titulo.textContent = item.nome;

  const metadados = document.createElement('p');
  metadados.className = 'mt-2 text-sm text-slate-600';
  metadados.textContent = `${item.grupo} · lixeira ${item.cor.toLowerCase()}`;

  const destino = document.createElement('span');
  const rótulos = {
    reciclavel: ['Reciclável', 'bg-green-100 text-green-800'],
    'nao-reciclavel': ['Não reciclável', 'bg-slate-100 text-slate-700'],
    compostavel: ['Compostável', 'bg-amber-100 text-amber-900'],
    especial: ['Descarte especial', 'bg-orange-100 text-orange-900']
  };
  const [textoDestino, classesDestino] = rótulos[item.destino];
  destino.className = `mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classesDestino}`;
  destino.textContent = textoDestino;

  const orientacao = document.createElement('p');
  orientacao.className = 'mt-3 text-sm leading-6 text-slate-600';
  orientacao.textContent = item.orientacao;
  cartao.append(titulo, metadados, destino, orientacao);
  return cartao;
}

// Aplica simultaneamente busca por texto e filtro de destino.
function filtrarResiduos() {
  const busca = entradaBuscaResiduo.value.trim().toLocaleLowerCase('pt-BR');
  const resultados = guiaResiduos.filter((item) => {
    const correspondeTexto = `${item.nome} ${item.grupo} ${item.cor} ${item.orientacao}`.toLocaleLowerCase('pt-BR').includes(busca);
    const correspondeFiltro = filtroResiduoAtual === 'todos' || item.destino === filtroResiduoAtual;
    return correspondeTexto && correspondeFiltro;
  });

  listaResiduos.replaceChildren(...resultados.map(criarCartaoResiduo));
  estadoResiduos.textContent = resultados.length
    ? `${resultados.length} resultado(s) encontrado(s).`
    : 'Nenhum resíduo encontrado. Tente outra busca ou filtro.';
  if (window.lucide) window.lucide.createIcons();
}

// Apresenta a pergunta atual e monta as opções como botões seguros.
function mostrarPerguntaQuiz() {
  const dados = perguntasQuiz[indicePerguntaQuiz];
  document.getElementById('quiz-progresso').textContent = `Pergunta ${indicePerguntaQuiz + 1} de ${perguntasQuiz.length}`;
  document.getElementById('quiz-pontos').textContent = `Pontos: ${pontosQuiz}`;
  document.getElementById('quiz-pergunta').textContent = dados.pergunta;
  document.getElementById('quiz-feedback').textContent = '';
  const opcoes = document.getElementById('quiz-opcoes');
  opcoes.replaceChildren();

  dados.opcoes.forEach((texto, indice) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'rounded-lg border border-floresta/20 px-4 py-3 text-left text-sm font-medium text-floresta transition hover:bg-suave focus:outline-none focus:ring-2 focus:ring-natureza';
    botao.textContent = texto;
    botao.addEventListener('click', () => responderPergunta(indice));
    opcoes.append(botao);
  });

  const botaoProxima = document.getElementById('quiz-proxima');
  botaoProxima.classList.add('hidden');
  botaoProxima.textContent = indicePerguntaQuiz === perguntasQuiz.length - 1 ? 'Ver resultado' : 'Próxima pergunta';
  if (window.lucide) window.lucide.createIcons();
}

// Marca a resposta, atualiza a pontuação e impede responder duas vezes.
function responderPergunta(indiceEscolhido) {
  if (quizRespondido) return;
  quizRespondido = true;
  const dados = perguntasQuiz[indicePerguntaQuiz];
  const acertou = indiceEscolhido === dados.correta;
  if (acertou) pontosQuiz += 20;

  document.querySelectorAll('#quiz-opcoes button').forEach((botao) => { botao.disabled = true; });
  document.getElementById('quiz-pontos').textContent = `Pontos: ${pontosQuiz}`;
  const feedback = document.getElementById('quiz-feedback');
  feedback.className = acertou ? 'mt-4 min-h-6 text-sm font-semibold text-green-700' : 'mt-4 min-h-6 text-sm font-semibold text-amber-800';
  feedback.textContent = acertou
    ? 'Resposta correta! Você ganhou 20 pontos.'
    : `Não foi dessa vez. A resposta correta é: ${dados.opcoes[dados.correta]}.`;
  document.getElementById('quiz-proxima').classList.remove('hidden');
}

// Avança pelo quiz ou exibe o resultado final no SweetAlert2.
async function avancarQuiz() {
  if (!quizRespondido) return;
  if (indicePerguntaQuiz < perguntasQuiz.length - 1) {
    indicePerguntaQuiz += 1;
    quizRespondido = false;
    mostrarPerguntaQuiz();
    return;
  }

  const acertos = pontosQuiz / 20;
  let mensagem = 'Continue praticando: pequenas escolhas ajudam a separar melhor os resíduos.';
  if (acertos === perguntasQuiz.length) mensagem = 'Perfeito! Você acertou todas as perguntas.';
  else if (acertos >= 3) mensagem = 'Muito bem! Você já conhece várias boas práticas de reciclagem.';

  await Swal.fire({
    title: `Você fez ${pontosQuiz} de 100 pontos`,
    text: mensagem,
    icon: acertos >= 3 ? 'success' : 'info',
    confirmButtonText: 'Jogar novamente',
    confirmButtonColor: '#174D36'
  });
  iniciarQuiz();
}

// Inicia ou reinicia as cinco perguntas.
function iniciarQuiz() {
  indicePerguntaQuiz = 0;
  pontosQuiz = 0;
  quizRespondido = false;
  document.getElementById('quiz-area').classList.remove('hidden');
  document.getElementById('quiz-iniciar').textContent = 'Reiniciar quiz';
  mostrarPerguntaQuiz();
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarCoresColeta();
  filtrarResiduos();
  entradaBuscaResiduo.addEventListener('input', filtrarResiduos);
  document.getElementById('filtros-residuos').addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-filtro]');
    if (!botao) return;
    filtroResiduoAtual = botao.dataset.filtro;
    document.querySelectorAll('.filtro-residuo').forEach((filtro) => {
      const ativo = filtro === botao;
      filtro.setAttribute('aria-pressed', String(ativo));
      filtro.className = ativo
        ? 'filtro-residuo rounded-full bg-floresta px-4 py-2 text-sm font-semibold text-white'
        : 'filtro-residuo rounded-full border border-floresta/20 bg-white px-4 py-2 text-sm font-semibold text-floresta';
    });
    filtrarResiduos();
  });
  document.getElementById('quiz-iniciar').addEventListener('click', iniciarQuiz);
  document.getElementById('quiz-proxima').addEventListener('click', avancarQuiz);
  EcoUI.atualizarIcones();
});
