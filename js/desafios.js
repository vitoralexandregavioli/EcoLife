// CRUD de desafios do usuário autenticado.
let usuarioDesafios = null;
let desafioEmEdicao = null;
let categoriasDisponiveis = [];
let carregandoSugeridos = false;

const formularioDesafio = document.getElementById('form-desafio');
const campoTituloDesafio = document.getElementById('titulo-desafio');
const campoDescricaoDesafio = document.getElementById('descricao-desafio');
const campoXpDesafio = document.getElementById('xp-desafio');
const campoDificuldadeDesafio = document.getElementById('dificuldade-desafio');
const campoCategoriaDesafio = document.getElementById('categoria-desafio');
const botaoSalvarDesafio = document.getElementById('botao-salvar-desafio');
const botaoCancelarEdicaoDesafio = document.getElementById('botao-cancelar-edicao');
const botaoAtualizarDesafios = document.getElementById('botao-atualizar');
const botaoCarregarSugeridos = document.getElementById('botao-sugeridos');
const estadoListaDesafios = document.getElementById('estado-lista');
const listaDesafios = document.getElementById('lista-desafios');
const avisoSemCategorias = document.getElementById('aviso-sem-categorias');

// Cinco exemplos definidos no planejamento do projeto.
const desafiosSugeridos = [
  { titulo: 'Economizar água', descricao: 'Reduza o tempo do banho e feche a torneira ao escovar os dentes.', nomeCategoria: 'Água', xp: 50, dificuldade: 'medio' },
  { titulo: 'Evitar sacolas plásticas', descricao: 'Leve uma sacola reutilizável nas compras.', nomeCategoria: 'Consumo consciente', xp: 30, dificuldade: 'facil' },
  { titulo: 'Separar recicláveis', descricao: 'Separe corretamente os materiais recicláveis para a coleta seletiva.', nomeCategoria: 'Reciclagem', xp: 40, dificuldade: 'facil' },
  { titulo: 'Usar transporte coletivo', descricao: 'Escolha o transporte coletivo em um trajeto que faria de carro.', nomeCategoria: 'Transporte', xp: 50, dificuldade: 'medio' },
  { titulo: 'Plantar uma muda', descricao: 'Plante e cuide de uma muda adequada à sua região.', nomeCategoria: 'Natureza', xp: 100, dificuldade: 'dificil' }
];

// Normaliza textos para comparar sugestões e categorias sem diferença de caixa.
function normalizarTexto(texto) {
  return texto.trim().toLocaleLowerCase('pt-BR');
}

// Exibe o estado da listagem sem interpretar conteúdo como HTML.
function definirEstadoListaDesafios(mensagem, mostrar = true) {
  estadoListaDesafios.textContent = mensagem;
  estadoListaDesafios.hidden = !mostrar;
}

// Carrega as categorias do usuário para preencher o campo de relacionamento.
async function carregarCategoriasDoUsuario() {
  const { data, error } = await supabaseClient
    .from('categorias')
    .select('id, nome')
    .order('nome', { ascending: true });
  if (error) throw error;

  categoriasDisponiveis = data || [];
  campoCategoriaDesafio.replaceChildren();

  const opcaoInicial = document.createElement('option');
  opcaoInicial.value = '';
  opcaoInicial.textContent = categoriasDisponiveis.length ? 'Selecione uma categoria' : 'Cadastre uma categoria primeiro';
  campoCategoriaDesafio.append(opcaoInicial);

  for (const categoria of categoriasDisponiveis) {
    const opcao = document.createElement('option');
    opcao.value = categoria.id;
    opcao.textContent = categoria.nome;
    campoCategoriaDesafio.append(opcao);
  }

  const semCategorias = categoriasDisponiveis.length === 0;
  campoCategoriaDesafio.disabled = semCategorias;
  botaoSalvarDesafio.disabled = semCategorias;
  avisoSemCategorias.classList.toggle('hidden', !semCategorias);

  if (semCategorias) {
    const resultado = await Swal.fire({
      title: 'Você ainda não tem categorias',
      text: 'Crie uma categoria antes de cadastrar desafios, ou carregue os desafios sugeridos para criar as categorias necessárias.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Criar categoria',
      cancelButtonText: 'Agora não',
      confirmButtonColor: '#174D36'
    });
    if (resultado.isConfirmed) window.location.href = 'categorias.html';
  }
}

// Retorna o nome da categoria vinculada, aceitando a forma singular do PostgREST.
function nomeCategoriaRelacionada(desafio) {
  const relacao = desafio.categorias;
  const categoria = Array.isArray(relacao) ? relacao[0] : relacao;
  return categoria?.nome || 'Categoria indisponível';
}

// Cria o cartão usando elementos e textContent para evitar XSS.
function criarCartaoDesafio(desafio) {
  const cartao = document.createElement('article');
  cartao.className = 'cartao-base flex flex-col';

  const topo = document.createElement('div');
  topo.className = 'flex items-start gap-3';
  const icone = document.createElement('i');
  icone.dataset.lucide = 'sprout';
  icone.className = 'mt-1 h-5 w-5 shrink-0 text-natureza';
  icone.setAttribute('aria-hidden', 'true');

  const conteudo = document.createElement('div');
  conteudo.className = 'min-w-0 flex-1';
  const titulo = document.createElement('h3');
  titulo.className = 'break-words font-titulo text-lg font-semibold text-floresta';
  titulo.textContent = desafio.titulo;

  const categoria = document.createElement('p');
  categoria.className = 'mt-1 text-sm font-medium text-slate-600';
  categoria.textContent = `Categoria: ${nomeCategoriaRelacionada(desafio)}`;

  const descricao = document.createElement('p');
  descricao.className = 'mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600';
  descricao.textContent = desafio.descricao || 'Sem descrição.';

  const detalhes = document.createElement('div');
  detalhes.className = 'mt-3 flex flex-wrap gap-2';
  const xp = document.createElement('span');
  xp.className = 'rounded-full bg-suave px-3 py-1 text-xs font-bold text-floresta';
  xp.textContent = `${desafio.xp} XP`;
  const dificuldade = document.createElement('span');
  dificuldade.className = 'rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700';
  dificuldade.textContent = {
    facil: 'Fácil',
    medio: 'Médio',
    dificil: 'Difícil'
  }[desafio.dificuldade] || desafio.dificuldade;

  conteudo.append(titulo, categoria, descricao);
  detalhes.append(xp, dificuldade);
  topo.append(icone, conteudo);

  const acoes = document.createElement('div');
  acoes.className = 'mt-5 flex gap-2 border-t border-floresta/10 pt-4';
  const botaoEditar = document.createElement('button');
  botaoEditar.type = 'button';
  botaoEditar.className = 'inline-flex items-center gap-2 rounded-lg border border-floresta/20 px-3 py-2 text-sm font-semibold text-floresta hover:bg-suave';
  botaoEditar.setAttribute('aria-label', `Editar desafio ${desafio.titulo}`);
  botaoEditar.addEventListener('click', () => iniciarEdicaoDesafio(desafio));
  const iconeEditar = document.createElement('i');
  iconeEditar.dataset.lucide = 'pencil';
  iconeEditar.className = 'h-4 w-4';
  iconeEditar.setAttribute('aria-hidden', 'true');
  botaoEditar.append(iconeEditar, document.createTextNode('Editar'));

  const botaoExcluir = document.createElement('button');
  botaoExcluir.type = 'button';
  botaoExcluir.className = 'inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50';
  botaoExcluir.setAttribute('aria-label', `Excluir desafio ${desafio.titulo}`);
  botaoExcluir.addEventListener('click', () => excluirDesafio(desafio));
  const iconeExcluir = document.createElement('i');
  iconeExcluir.dataset.lucide = 'trash-2';
  iconeExcluir.className = 'h-4 w-4';
  iconeExcluir.setAttribute('aria-hidden', 'true');
  botaoExcluir.append(iconeExcluir, document.createTextNode('Excluir'));

  acoes.append(botaoEditar, botaoExcluir);
  cartao.append(topo, detalhes, acoes);
  return cartao;
}

// Busca os desafios e o nome de cada categoria pela relação definida no schema.
async function carregarDesafios() {
  definirEstadoListaDesafios('Carregando desafios...');
  listaDesafios.replaceChildren();
  botaoAtualizarDesafios.disabled = true;

  try {
    const { data, error } = await supabaseClient
      .from('desafios')
      .select('id, titulo, descricao, xp, dificuldade, categoria_id, categorias!desafios_categoria_do_mesmo_usuario_fk(nome)')
      .order('titulo', { ascending: true });
    if (error) throw error;

    if (!data || data.length === 0) {
      definirEstadoListaDesafios('Você ainda não cadastrou desafios. Crie um pelo formulário ou carregue as sugestões.');
      return;
    }

    listaDesafios.replaceChildren(...data.map(criarCartaoDesafio));
    definirEstadoListaDesafios('', false);
    EcoUI.atualizarIcones();
  } catch (erro) {
    console.error('Erro ao carregar desafios:', erro);
    definirEstadoListaDesafios('Não foi possível carregar os desafios. Verifique sua conexão e tente novamente.');
    await EcoUI.avisar('Erro ao carregar desafios', 'Não foi possível buscar seus desafios no Supabase.', 'error');
  } finally {
    botaoAtualizarDesafios.disabled = false;
  }
}

// Atualiza as categorias do select e a listagem de desafios.
async function atualizarDadosDesafios() {
  try {
    await carregarCategoriasDoUsuario();
    await carregarDesafios();
  } catch (erro) {
    console.error('Erro ao atualizar os dados de desafios:', erro);
    definirEstadoListaDesafios('Não foi possível carregar os dados. Verifique sua conexão e tente novamente.');
    botaoSalvarDesafio.disabled = true;
    await EcoUI.avisar('Erro ao carregar dados', 'Não foi possível buscar categorias ou desafios no Supabase.', 'error');
  } finally {
    botaoCarregarSugeridos.disabled = carregandoSugeridos;
    botaoAtualizarDesafios.disabled = false;
  }
}

// Preenche o formulário com os valores do desafio escolhido.
function iniciarEdicaoDesafio(desafio) {
  desafioEmEdicao = desafio.id;
  campoTituloDesafio.value = desafio.titulo;
  campoDescricaoDesafio.value = desafio.descricao || '';
  campoXpDesafio.value = desafio.xp;
  campoDificuldadeDesafio.value = desafio.dificuldade;
  campoCategoriaDesafio.value = String(desafio.categoria_id);
  document.getElementById('titulo-formulario').textContent = 'Editar desafio';
  botaoSalvarDesafio.querySelector('span').textContent = 'Salvar alterações';
  botaoCancelarEdicaoDesafio.classList.remove('hidden');
  campoTituloDesafio.focus();
}

// Limpa o formulário e encerra o modo de edição.
function cancelarEdicaoDesafio() {
  desafioEmEdicao = null;
  formularioDesafio.reset();
  document.getElementById('titulo-formulario').textContent = 'Novo desafio';
  botaoSalvarDesafio.querySelector('span').textContent = 'Salvar desafio';
  botaoCancelarEdicaoDesafio.classList.add('hidden');
}

// Valida campos e cria ou atualiza o desafio selecionado.
async function salvarDesafio(evento) {
  evento.preventDefault();
  if (!usuarioDesafios) return;
  const titulo = campoTituloDesafio.value.trim();
  const descricao = campoDescricaoDesafio.value.trim();
  const xp = Number(campoXpDesafio.value);
  const dificuldade = campoDificuldadeDesafio.value;
  const categoriaId = campoCategoriaDesafio.value;

  if (!titulo || !categoriaId || !campoXpDesafio.value) {
    await EcoUI.avisar('Campos obrigatórios', 'Preencha título, XP e categoria.', 'warning');
    return;
  }
  if (!Number.isInteger(xp) || xp <= 0) {
    await EcoUI.avisar('XP inválido', 'Informe um número inteiro maior que zero.', 'warning');
    campoXpDesafio.focus();
    return;
  }
  if (!['facil', 'medio', 'dificil'].includes(dificuldade)) {
    await EcoUI.avisar('Dificuldade inválida', 'Selecione fácil, médio ou difícil.', 'warning');
    return;
  }
  if (!categoriasDisponiveis.some((categoria) => String(categoria.id) === categoriaId)) {
    await EcoUI.avisar('Categoria inválida', 'Selecione uma categoria cadastrada na sua conta.', 'warning');
    return;
  }

  botaoSalvarDesafio.disabled = true;
  botaoSalvarDesafio.querySelector('span').textContent = 'Salvando...';
  const valores = {
    titulo,
    descricao: descricao || null,
    xp,
    dificuldade,
    categoria_id: categoriaId,
    user_id: usuarioDesafios.id
  };

  try {
    let resultado;
    if (desafioEmEdicao) {
      resultado = await supabaseClient
        .from('desafios')
        .update(valores)
        .eq('id', desafioEmEdicao)
        .eq('user_id', usuarioDesafios.id);
    } else {
      resultado = await supabaseClient.from('desafios').insert(valores);
    }
    if (resultado.error) throw resultado.error;

    const estavaEditando = Boolean(desafioEmEdicao);
    cancelarEdicaoDesafio();
    await EcoUI.avisar(
      estavaEditando ? 'Desafio atualizado' : 'Desafio criado',
      estavaEditando ? 'As alterações foram salvas.' : 'O desafio foi cadastrado com sucesso.',
      'success'
    );
    await carregarDesafios();
  } catch (erro) {
    console.error('Erro ao salvar desafio:', erro);
    await EcoUI.avisar('Erro ao salvar desafio', 'Não foi possível salvar. Verifique os dados e tente novamente.', 'error');
  } finally {
    botaoSalvarDesafio.disabled = categoriasDisponiveis.length === 0;
    botaoSalvarDesafio.querySelector('span').textContent = desafioEmEdicao
      ? 'Salvar alterações'
      : 'Salvar desafio';
  }
}

// Confirma antes da exclusão; os registros vinculados serão removidos pelo banco.
async function excluirDesafio(desafio) {
  const confirmacao = await Swal.fire({
    title: 'Excluir desafio?',
    text: `O desafio "${desafio.titulo}" e os registros de ações relacionados serão removidos.`,
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
      .from('desafios')
      .delete()
      .eq('id', desafio.id)
      .eq('user_id', usuarioDesafios.id);
    if (error) throw error;

    if (desafioEmEdicao === desafio.id) cancelarEdicaoDesafio();
    await EcoUI.avisar('Desafio excluído', 'O desafio foi removido com sucesso.', 'success');
    await carregarDesafios();
  } catch (erro) {
    console.error('Erro ao excluir desafio:', erro);
    await EcoUI.avisar('Erro ao excluir desafio', 'Não foi possível excluir o desafio. Tente novamente.', 'error');
  }
}

// Cria categorias necessárias e insere somente sugestões ainda inexistentes.
async function carregarDesafiosSugeridos() {
  if (!usuarioDesafios || carregandoSugeridos) return;
  carregandoSugeridos = true;
  botaoCarregarSugeridos.disabled = true;
  botaoCarregarSugeridos.querySelector('span').textContent = 'Carregando sugestões...';

  try {
    const { data: categoriasAtuais, error: erroCategorias } = await supabaseClient
      .from('categorias')
      .select('id, nome');
    if (erroCategorias) throw erroCategorias;

    const mapaCategorias = new Map(
      (categoriasAtuais || []).map((categoria) => [normalizarTexto(categoria.nome), categoria])
    );
    const categoriasNovas = [];
    for (const sugestao of desafiosSugeridos) {
      const chave = normalizarTexto(sugestao.nomeCategoria);
      if (!mapaCategorias.has(chave) && !categoriasNovas.some((categoria) => normalizarTexto(categoria.nome) === chave)) {
        categoriasNovas.push({ nome: sugestao.nomeCategoria, descricao: `Categoria para desafios de ${sugestao.nomeCategoria.toLocaleLowerCase('pt-BR')}.`, user_id: usuarioDesafios.id });
      }
    }

    if (categoriasNovas.length) {
      const { error } = await supabaseClient.from('categorias').insert(categoriasNovas);
      if (error) throw error;
    }

    const { data: categoriasAtualizadas, error: erroAtualizacao } = await supabaseClient
      .from('categorias')
      .select('id, nome');
    if (erroAtualizacao) throw erroAtualizacao;
    const categoriasPorNome = new Map(
      (categoriasAtualizadas || []).map((categoria) => [normalizarTexto(categoria.nome), categoria])
    );

    const { data: desafiosAtuais, error: erroDesafios } = await supabaseClient
      .from('desafios')
      .select('titulo, categoria_id');
    if (erroDesafios) throw erroDesafios;
    const desafiosExistentes = new Set(
      (desafiosAtuais || []).map((desafio) => `${desafio.categoria_id}:${normalizarTexto(desafio.titulo)}`)
    );

    const novosDesafios = desafiosSugeridos
      .map((sugestao) => {
        const categoria = categoriasPorNome.get(normalizarTexto(sugestao.nomeCategoria));
        if (!categoria) throw new Error(`A categoria ${sugestao.nomeCategoria} não foi encontrada.`);
        return { ...sugestao, categoria_id: categoria.id };
      })
      .filter((sugestao) => !desafiosExistentes.has(`${sugestao.categoria_id}:${normalizarTexto(sugestao.titulo)}`))
      .map((sugestao) => ({
        titulo: sugestao.titulo,
        descricao: sugestao.descricao,
        xp: sugestao.xp,
        dificuldade: sugestao.dificuldade,
        categoria_id: sugestao.categoria_id,
        user_id: usuarioDesafios.id
      }));

    if (novosDesafios.length) {
      const { error } = await supabaseClient.from('desafios').insert(novosDesafios);
      if (error) throw error;
    }

    await atualizarDadosDesafios();
    await EcoUI.avisar(
      novosDesafios.length ? 'Sugestões carregadas' : 'Sugestões já cadastradas',
      novosDesafios.length
        ? `${novosDesafios.length} desafio(s) novo(s) foram adicionados. Categorias necessárias também foram criadas.`
        : 'Os cinco desafios sugeridos já existem na sua conta; nenhum item foi duplicado.',
      'success'
    );
  } catch (erro) {
    console.error('Erro ao carregar desafios sugeridos:', erro);
    await EcoUI.avisar('Erro ao carregar sugestões', 'Não foi possível inserir os desafios sugeridos. Tente novamente.', 'error');
  } finally {
    carregandoSugeridos = false;
    botaoCarregarSugeridos.disabled = false;
    botaoCarregarSugeridos.querySelector('span').textContent = 'Carregar desafios sugeridos';
  }
}

// A proteção acontece antes de consultar categorias ou desafios.
document.addEventListener('DOMContentLoaded', async () => {
  formularioDesafio.addEventListener('submit', salvarDesafio);
  botaoCancelarEdicaoDesafio.addEventListener('click', cancelarEdicaoDesafio);
  botaoAtualizarDesafios.addEventListener('click', atualizarDadosDesafios);
  botaoCarregarSugeridos.addEventListener('click', carregarDesafiosSugeridos);

  const sessao = await exigirLogin();
  if (!sessao) return;
  usuarioDesafios = sessao.user;
  await atualizarDadosDesafios();
  EcoUI.atualizarIcones();
});
