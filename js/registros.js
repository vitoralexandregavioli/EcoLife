// CRUD dos registros de ações do usuário autenticado.
let usuarioRegistros = null;
let registroEmEdicao = null;
let desafiosDisponiveis = [];

const formularioRegistro = document.getElementById('form-registro');
const campoDesafioRegistro = document.getElementById('desafio-registro');
const campoDataRegistro = document.getElementById('data-registro');
const campoObservacaoRegistro = document.getElementById('observacao-registro');
const campoStatusRegistro = document.getElementById('status-registro');
const botaoSalvarRegistro = document.getElementById('botao-salvar-registro');
const botaoCancelarEdicaoRegistro = document.getElementById('botao-cancelar-edicao');
const botaoAtualizarRegistros = document.getElementById('botao-atualizar');
const estadoListaRegistros = document.getElementById('estado-lista');
const listaRegistros = document.getElementById('lista-registros');
const avisoSemDesafios = document.getElementById('aviso-sem-desafios');

// Define a data local de hoje sem deslocamento de fuso horário.
function dataLocalHoje() {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  return agora.toISOString().slice(0, 10);
}

// Mostra estados da lista usando texto simples, sem interpretar HTML.
function definirEstadoListaRegistros(mensagem, mostrar = true) {
  estadoListaRegistros.textContent = mensagem;
  estadoListaRegistros.hidden = !mostrar;
}

// Lê o nome da categoria relacionada ao desafio (objeto ou lista).
function obterCategoriaDoDesafio(desafio) {
  const relacao = desafio?.categorias;
  return Array.isArray(relacao) ? relacao[0] : relacao;
}

// Busca desafios próprios e preenche o select com título, categoria e XP.
async function carregarDesafiosDoUsuario() {
  const { data, error } = await supabaseClient
    .from('desafios')
    .select('id, titulo, xp, categorias!desafios_categoria_do_mesmo_usuario_fk(nome)')
    .order('titulo', { ascending: true });
  if (error) throw error;

  desafiosDisponiveis = data || [];
  campoDesafioRegistro.replaceChildren();

  const opcaoInicial = document.createElement('option');
  opcaoInicial.value = '';
  opcaoInicial.textContent = desafiosDisponiveis.length ? 'Selecione um desafio' : 'Cadastre um desafio primeiro';
  campoDesafioRegistro.append(opcaoInicial);

  for (const desafio of desafiosDisponiveis) {
    const categoria = obterCategoriaDoDesafio(desafio);
    const opcao = document.createElement('option');
    opcao.value = desafio.id;
    opcao.textContent = `${desafio.titulo} · ${categoria?.nome || 'Sem categoria'} · ${desafio.xp} XP`;
    campoDesafioRegistro.append(opcao);
  }

  const semDesafios = desafiosDisponiveis.length === 0;
  campoDesafioRegistro.disabled = semDesafios;
  botaoSalvarRegistro.disabled = semDesafios;
  avisoSemDesafios.classList.toggle('hidden', !semDesafios);

  if (semDesafios) {
    const resultado = await Swal.fire({
      title: 'Você ainda não tem desafios',
      text: 'Cadastre um desafio antes de registrar uma ação.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ir para Desafios',
      cancelButtonText: 'Agora não',
      confirmButtonColor: '#174D36'
    });
    if (resultado.isConfirmed) window.location.href = 'desafios.html';
  }
}

// Formata a data de banco para exibição em português.
function formatarDataRegistro(data) {
  if (!data) return 'Data indisponível';
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR').format(new Date(ano, mes - 1, dia));
}

// Monta um cartão do histórico usando DOM e textContent para evitar XSS.
function criarCartaoRegistro(registro) {
  const cartao = document.createElement('article');
  cartao.className = 'cartao-base flex flex-col';

  const desafio = Array.isArray(registro.desafios) ? registro.desafios[0] : registro.desafios;
  const categoria = obterCategoriaDoDesafio(desafio);

  const topo = document.createElement('div');
  topo.className = 'flex items-start gap-3';
  const icone = document.createElement('i');
  icone.dataset.lucide = registro.status === 'concluido' ? 'circle-check' : 'circle-ellipsis';
  icone.className = 'mt-1 h-5 w-5 shrink-0 text-natureza';
  icone.setAttribute('aria-hidden', 'true');

  const conteudo = document.createElement('div');
  conteudo.className = 'min-w-0 flex-1';
  const titulo = document.createElement('h3');
  titulo.className = 'break-words font-titulo text-lg font-semibold text-floresta';
  titulo.textContent = desafio?.titulo || 'Desafio indisponível';

  const categoriaTexto = document.createElement('p');
  categoriaTexto.className = 'mt-1 text-sm text-slate-600';
  categoriaTexto.textContent = `Categoria: ${categoria?.nome || 'indisponível'}`;

  const detalhes = document.createElement('div');
  detalhes.className = 'mt-3 flex flex-wrap gap-2';
  const xp = document.createElement('span');
  xp.className = 'rounded-full bg-suave px-3 py-1 text-xs font-bold text-floresta';
  xp.textContent = `${desafio?.xp ?? 0} XP`;
  const data = document.createElement('span');
  data.className = 'rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700';
  data.textContent = formatarDataRegistro(registro.data_realizacao);
  const status = document.createElement('span');
  status.className = registro.status === 'concluido'
    ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800'
    : 'rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900';
  status.textContent = registro.status === 'concluido' ? 'Concluído' : 'Pendente';

  const observacao = document.createElement('p');
  observacao.className = 'mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600';
  observacao.textContent = registro.observacao || 'Sem observação.';

  conteudo.append(titulo, categoriaTexto);
  detalhes.append(xp, data, status);
  topo.append(icone, conteudo);

  const acoes = document.createElement('div');
  acoes.className = 'mt-5 flex gap-2 border-t border-floresta/10 pt-4';

  const botaoEditar = document.createElement('button');
  botaoEditar.type = 'button';
  botaoEditar.className = 'inline-flex items-center gap-2 rounded-lg border border-floresta/20 px-3 py-2 text-sm font-semibold text-floresta hover:bg-suave';
  botaoEditar.setAttribute('aria-label', `Editar registro de ${desafio?.titulo || 'desafio'}`);
  botaoEditar.addEventListener('click', () => iniciarEdicaoRegistro(registro));
  const iconeEditar = document.createElement('i');
  iconeEditar.dataset.lucide = 'pencil';
  iconeEditar.className = 'h-4 w-4';
  iconeEditar.setAttribute('aria-hidden', 'true');
  botaoEditar.append(iconeEditar, document.createTextNode('Editar'));

  const botaoExcluir = document.createElement('button');
  botaoExcluir.type = 'button';
  botaoExcluir.className = 'inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50';
  botaoExcluir.setAttribute('aria-label', `Excluir registro de ${desafio?.titulo || 'desafio'}`);
  botaoExcluir.addEventListener('click', () => excluirRegistro(registro));
  const iconeExcluir = document.createElement('i');
  iconeExcluir.dataset.lucide = 'trash-2';
  iconeExcluir.className = 'h-4 w-4';
  iconeExcluir.setAttribute('aria-hidden', 'true');
  botaoExcluir.append(iconeExcluir, document.createTextNode('Excluir'));

  acoes.append(botaoEditar, botaoExcluir);
  cartao.append(topo, detalhes, observacao, acoes);
  return cartao;
}

// Busca registros próprios junto com desafio e categoria, do mais recente para trás.
async function carregarRegistros() {
  definirEstadoListaRegistros('Carregando registros...');
  listaRegistros.replaceChildren();
  botaoAtualizarRegistros.disabled = true;

  try {
    const { data, error } = await supabaseClient
      .from('registros')
      .select('id, desafio_id, data_realizacao, observacao, status, created_at, desafios!registros_desafio_do_mesmo_usuario_fk(titulo, xp, categorias!desafios_categoria_do_mesmo_usuario_fk(nome))')
      .order('data_realizacao', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;

    if (!data || data.length === 0) {
      definirEstadoListaRegistros('Você ainda não registrou ações. Use o formulário para adicionar a primeira.');
      return;
    }

    listaRegistros.replaceChildren(...data.map(criarCartaoRegistro));
    definirEstadoListaRegistros('', false);
    EcoUI.atualizarIcones();
  } catch (erro) {
    console.error('Erro ao carregar registros:', erro);
    definirEstadoListaRegistros('Não foi possível carregar os registros. Verifique sua conexão e tente novamente.');
    await EcoUI.avisar('Erro ao carregar registros', 'Não foi possível buscar seu histórico no Supabase.', 'error');
  } finally {
    botaoAtualizarRegistros.disabled = false;
  }
}

// Atualiza o select de desafios e o histórico.
async function atualizarDadosRegistros() {
  try {
    await carregarDesafiosDoUsuario();
    await carregarRegistros();
  } catch (erro) {
    console.error('Erro ao atualizar registros:', erro);
    definirEstadoListaRegistros('Não foi possível carregar os dados. Verifique sua conexão e tente novamente.');
    botaoSalvarRegistro.disabled = true;
    await EcoUI.avisar('Erro ao carregar dados', 'Não foi possível buscar desafios ou registros no Supabase.', 'error');
  } finally {
    botaoAtualizarRegistros.disabled = false;
  }
}

// Carrega um registro selecionado no formulário de edição.
function iniciarEdicaoRegistro(registro) {
  registroEmEdicao = registro.id;
  campoDesafioRegistro.value = String(registro.desafio_id);
  campoDataRegistro.value = registro.data_realizacao || dataLocalHoje();
  campoObservacaoRegistro.value = registro.observacao || '';
  campoStatusRegistro.value = registro.status;
  document.getElementById('titulo-formulario').textContent = 'Editar registro';
  botaoSalvarRegistro.querySelector('span').textContent = 'Salvar alterações';
  botaoCancelarEdicaoRegistro.classList.remove('hidden');
  campoDesafioRegistro.focus();
}

// Retorna o formulário ao estado inicial e usa hoje como nova data padrão.
function cancelarEdicaoRegistro() {
  registroEmEdicao = null;
  formularioRegistro.reset();
  campoDataRegistro.value = dataLocalHoje();
  document.getElementById('titulo-formulario').textContent = 'Novo registro';
  botaoSalvarRegistro.querySelector('span').textContent = 'Salvar registro';
  botaoCancelarEdicaoRegistro.classList.add('hidden');
}

// Valida e cria ou atualiza um registro de ação.
async function salvarRegistro(evento) {
  evento.preventDefault();
  if (!usuarioRegistros) return;

  const desafioId = campoDesafioRegistro.value;
  const dataRealizacao = campoDataRegistro.value;
  const observacao = campoObservacaoRegistro.value.trim();
  const status = campoStatusRegistro.value;

  if (!desafioId || !dataRealizacao) {
    await EcoUI.avisar('Campos obrigatórios', 'Selecione um desafio e informe a data de realização.', 'warning');
    return;
  }
  if (!desafiosDisponiveis.some((desafio) => String(desafio.id) === desafioId)) {
    await EcoUI.avisar('Desafio inválido', 'Selecione um desafio cadastrado na sua conta.', 'warning');
    return;
  }
  if (!['pendente', 'concluido'].includes(status)) {
    await EcoUI.avisar('Status inválido', 'Selecione pendente ou concluído.', 'warning');
    return;
  }
  if (observacao.length > 1000) {
    await EcoUI.avisar('Observação muito longa', 'A observação aceita até 1000 caracteres.', 'warning');
    return;
  }

  botaoSalvarRegistro.disabled = true;
  botaoSalvarRegistro.querySelector('span').textContent = 'Salvando...';
  const valores = {
    desafio_id: desafioId,
    data_realizacao: dataRealizacao,
    observacao: observacao || null,
    status,
    user_id: usuarioRegistros.id
  };

  try {
    let resultado;
    if (registroEmEdicao) {
      resultado = await supabaseClient
        .from('registros')
        .update(valores)
        .eq('id', registroEmEdicao)
        .eq('user_id', usuarioRegistros.id);
    } else {
      resultado = await supabaseClient.from('registros').insert(valores);
    }
    if (resultado.error) throw resultado.error;

    const estavaEditando = Boolean(registroEmEdicao);
    cancelarEdicaoRegistro();
    await EcoUI.avisar(
      estavaEditando ? 'Registro atualizado' : 'Ação registrada',
      estavaEditando ? 'As alterações foram salvas.' : 'Sua ação foi registrada com sucesso.',
      'success'
    );
    await carregarRegistros();
  } catch (erro) {
    console.error('Erro ao salvar registro:', erro);
    await EcoUI.avisar('Erro ao salvar registro', 'Não foi possível salvar. Verifique os dados e tente novamente.', 'error');
  } finally {
    botaoSalvarRegistro.disabled = desafiosDisponiveis.length === 0;
    botaoSalvarRegistro.querySelector('span').textContent = registroEmEdicao
      ? 'Salvar alterações'
      : 'Salvar registro';
  }
}

// Confirma a exclusão antes de remover o registro no Supabase.
async function excluirRegistro(registro) {
  const confirmacao = await Swal.fire({
    title: 'Excluir registro?',
    text: 'Esta ação será removida do seu histórico.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#475569'
  });
  if (!confirmacao.isConfirmed) return;

  try {
    const { error } = await supabaseClient
      .from('registros')
      .delete()
      .eq('id', registro.id)
      .eq('user_id', usuarioRegistros.id);
    if (error) throw error;

    if (registroEmEdicao === registro.id) cancelarEdicaoRegistro();
    await EcoUI.avisar('Registro excluído', 'O registro foi removido com sucesso.', 'success');
    await carregarRegistros();
  } catch (erro) {
    console.error('Erro ao excluir registro:', erro);
    await EcoUI.avisar('Erro ao excluir registro', 'Não foi possível excluir o registro. Tente novamente.', 'error');
  }
}

// Protege a página antes de buscar desafios ou registros.
document.addEventListener('DOMContentLoaded', async () => {
  campoDataRegistro.value = dataLocalHoje();
  formularioRegistro.addEventListener('submit', salvarRegistro);
  botaoCancelarEdicaoRegistro.addEventListener('click', cancelarEdicaoRegistro);
  botaoAtualizarRegistros.addEventListener('click', atualizarDadosRegistros);

  const sessao = await exigirLogin();
  if (!sessao) return;
  usuarioRegistros = sessao.user;
  await atualizarDadosRegistros();
  EcoUI.atualizarIcones();
});
