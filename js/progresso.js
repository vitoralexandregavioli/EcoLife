// Calcula o progresso e as conquistas usando somente dados vindos do Supabase.
const estadoProgresso = document.getElementById('estado-progresso');
const avisoSemRegistros = document.getElementById('aviso-sem-registros');
const listaConquistas = document.getElementById('lista-conquistas');
const estadoHistorico = document.getElementById('estado-historico');
const listaHistorico = document.getElementById('lista-historico');
const botaoAtualizarProgresso = document.getElementById('botao-atualizar-progresso');

// Converte o resultado da relação do Supabase para um objeto de desafio.
function obterDesafioRelacionado(registro) {
  const relacao = registro.desafios;
  return Array.isArray(relacao) ? relacao[0] : relacao;
}

// A relação de categoria pode chegar como objeto ou como lista.
function obterCategoriaRelacionado(desafio) {
  const relacao = desafio?.categorias;
  return Array.isArray(relacao) ? relacao[0] : relacao;
}

// Padroniza nomes de categoria para comparar Água e Reciclagem sem diferença de acento.
function normalizarCategoria(nome) {
  return (nome || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('pt-BR');
}

// Define os limites de XP e o progresso dentro do nível atual.
function calcularNivel(xpTotal) {
  if (xpTotal < 100) {
    return { nivel: 1, inicio: 0, proximo: 100, progresso: (xpTotal / 100) * 100 };
  }
  if (xpTotal < 250) {
    return { nivel: 2, inicio: 100, proximo: 250, progresso: ((xpTotal - 100) / 150) * 100 };
  }
  if (xpTotal < 500) {
    return { nivel: 3, inicio: 250, proximo: 500, progresso: ((xpTotal - 250) / 250) * 100 };
  }
  return { nivel: 4, inicio: 500, proximo: null, progresso: 100 };
}

// Atualiza os números, o nível e a barra de progresso.
function renderizarResumo(registros, concluidos, pendentes, xpTotal) {
  document.getElementById('xp-total').textContent = `${xpTotal} XP`;
  document.getElementById('total-concluidos').textContent = String(concluidos.length);
  document.getElementById('total-pendentes').textContent = String(pendentes.length);

  const dadosNivel = calcularNivel(xpTotal);
  document.getElementById('titulo-nivel').textContent = `Nível ${dadosNivel.nivel}`;
  document.getElementById('xp-inicio-nivel').textContent = `${dadosNivel.inicio} XP`;
  document.getElementById('xp-fim-nivel').textContent = dadosNivel.proximo === null ? 'Nível máximo' : `${dadosNivel.proximo} XP`;

  const barra = document.getElementById('barra-nivel');
  const preenchimento = document.getElementById('preenchimento-nivel');
  const porcentagem = Math.max(0, Math.min(100, dadosNivel.progresso));
  preenchimento.style.width = `${porcentagem}%`;
  barra.setAttribute('aria-valuenow', String(Math.round(porcentagem)));

  const textoProximoNivel = document.getElementById('texto-proximo-nivel');
  if (dadosNivel.proximo === null) {
    textoProximoNivel.textContent = 'Nível máximo alcançado';
  } else {
    const faltam = dadosNivel.proximo - xpTotal;
    textoProximoNivel.textContent = `Faltam ${faltam} XP para o nível ${dadosNivel.nivel + 1}`;
  }

  avisoSemRegistros.classList.toggle('hidden', registros.length > 0);
}

// Cria um cartão de conquista com aparência diferente conforme o estado.
function criarCartaoConquista(conquista) {
  const cartao = document.createElement('article');
  cartao.className = conquista.desbloqueada
    ? 'cartao-base border-natureza bg-suave/60'
    : 'cartao-base opacity-60 grayscale';

  const cabecalho = document.createElement('div');
  cabecalho.className = 'flex items-center justify-between gap-2';
  const icone = document.createElement('i');
  icone.dataset.lucide = conquista.icone;
  icone.className = conquista.desbloqueada ? 'h-7 w-7 text-natureza' : 'h-7 w-7 text-slate-400';
  icone.setAttribute('aria-hidden', 'true');
  const estado = document.createElement('span');
  estado.className = conquista.desbloqueada
    ? 'rounded-full bg-white px-2 py-1 text-xs font-semibold text-floresta'
    : 'rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500';
  estado.textContent = conquista.desbloqueada ? 'Desbloqueada' : 'Bloqueada';
  cabecalho.append(icone, estado);

  const titulo = document.createElement('h3');
  titulo.className = 'mt-4 font-titulo font-semibold text-floresta';
  titulo.textContent = conquista.nome;
  const descricao = document.createElement('p');
  descricao.className = 'mt-1 text-sm leading-5 text-slate-600';
  descricao.textContent = conquista.descricao;

  cartao.append(cabecalho, titulo, descricao);
  return cartao;
}

// Calcula as quatro conquistas a partir dos registros concluídos e do XP.
function renderizarConquistas(concluidos, xpTotal) {
  const concluiuAgua = concluidos.some((registro) => {
    const categoria = obterCategoriaRelacionado(obterDesafioRelacionado(registro));
    return normalizarCategoria(categoria?.nome) === 'agua';
  });
  const concluiuReciclagem = concluidos.some((registro) => {
    const categoria = obterCategoriaRelacionado(obterDesafioRelacionado(registro));
    return normalizarCategoria(categoria?.nome) === 'reciclagem';
  });

  const conquistas = [
    { nome: 'Eco iniciante', descricao: 'Conclua seu primeiro desafio.', icone: 'sprout', desbloqueada: concluidos.length > 0 },
    { nome: 'Amigo da água', descricao: 'Conclua um desafio da categoria Água.', icone: 'droplets', desbloqueada: concluiuAgua },
    { nome: 'Reciclador', descricao: 'Conclua um desafio da categoria Reciclagem.', icone: 'recycle', desbloqueada: concluiuReciclagem },
    { nome: 'Guardião da natureza', descricao: 'Alcance 500 XP ou mais.', icone: 'trees', desbloqueada: xpTotal >= 500 }
  ];

  listaConquistas.replaceChildren(...conquistas.map(criarCartaoConquista));
  EcoUI.atualizarIcones();
}

// Formata datas sem deslocar o dia por causa do fuso horário local.
function formatarDataProgresso(data) {
  if (!data) return 'Data indisponível';
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR').format(new Date(ano, mes - 1, dia));
}

// Cria uma linha/cartão de histórico com dados do desafio concluído.
function criarItemHistorico(registro) {
  const desafio = obterDesafioRelacionado(registro);
  const categoria = obterCategoriaRelacionado(desafio);
  const item = document.createElement('article');
  item.className = 'cartao-base';

  const topo = document.createElement('div');
  topo.className = 'flex items-start gap-3';
  const icone = document.createElement('i');
  icone.dataset.lucide = 'circle-check';
  icone.className = 'mt-1 h-5 w-5 shrink-0 text-natureza';
  icone.setAttribute('aria-hidden', 'true');

  const conteudo = document.createElement('div');
  conteudo.className = 'min-w-0 flex-1';
  const titulo = document.createElement('h3');
  titulo.className = 'break-words font-titulo font-semibold text-floresta';
  titulo.textContent = desafio?.titulo || 'Desafio indisponível';
  const categoriaTexto = document.createElement('p');
  categoriaTexto.className = 'mt-1 text-sm text-slate-600';
  categoriaTexto.textContent = categoria?.nome || 'Categoria indisponível';
  conteudo.append(titulo, categoriaTexto);
  topo.append(icone, conteudo);

  const detalhes = document.createElement('p');
  detalhes.className = 'mt-3 text-sm font-medium text-slate-600';
  detalhes.textContent = `${formatarDataProgresso(registro.data_realizacao)} · ${desafio?.xp ?? 0} XP`;

  const observacao = document.createElement('p');
  observacao.className = 'mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600';
  observacao.textContent = registro.observacao || 'Sem observação.';

  item.append(topo, detalhes, observacao);
  return item;
}

// Exibe até cinco ações concluídas mais recentes.
function renderizarHistorico(concluidos) {
  listaHistorico.replaceChildren();
  if (concluidos.length === 0) {
    estadoHistorico.textContent = 'Ainda não há ações concluídas. Registre uma ação como concluída para vê-la aqui.';
    estadoHistorico.hidden = false;
    return;
  }

  const recentes = concluidos.slice(0, 5);
  listaHistorico.replaceChildren(...recentes.map(criarItemHistorico));
  estadoHistorico.hidden = true;
  EcoUI.atualizarIcones();
}

// Carrega registros e relações; o RLS limita os dados ao usuário autenticado.
async function carregarProgresso() {
  botaoAtualizarProgresso.disabled = true;
  estadoProgresso.hidden = false;
  estadoProgresso.textContent = 'Carregando seu progresso...';

  try {
    const { data, error } = await supabaseClient
      .from('registros')
      .select('id, data_realizacao, observacao, status, created_at, desafios!registros_desafio_do_mesmo_usuario_fk(titulo, xp, categorias!desafios_categoria_do_mesmo_usuario_fk(nome))')
      .order('data_realizacao', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;

    const registros = data || [];
    const concluidos = registros.filter((registro) => registro.status === 'concluido');
    const pendentes = registros.filter((registro) => registro.status === 'pendente');
    const xpTotal = concluidos.reduce((total, registro) => {
      const desafio = obterDesafioRelacionado(registro);
      return total + (Number(desafio?.xp) || 0);
    }, 0);

    renderizarResumo(registros, concluidos, pendentes, xpTotal);
    renderizarConquistas(concluidos, xpTotal);
    renderizarHistorico(concluidos);
    estadoProgresso.hidden = true;
  } catch (erro) {
    console.error('Erro ao carregar progresso:', erro);
    estadoProgresso.textContent = 'Não foi possível carregar seu progresso. Verifique sua conexão e tente novamente.';
    await EcoUI.avisar('Erro ao carregar progresso', 'Não foi possível consultar seus registros no Supabase.', 'error');
  } finally {
    botaoAtualizarProgresso.disabled = false;
  }
}

// Protege a página e só consulta o banco depois de confirmar a sessão.
document.addEventListener('DOMContentLoaded', async () => {
  botaoAtualizarProgresso.addEventListener('click', carregarProgresso);
  const sessao = await exigirLogin();
  if (!sessao) return;
  await carregarProgresso();
  EcoUI.atualizarIcones();
});
