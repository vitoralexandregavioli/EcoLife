// CRUD de categorias do usuário conectado.
let usuarioCategoria = null;
let categoriaEmEdicao = null;

const formularioCategoria = document.getElementById('form-categoria');
const campoNomeCategoria = document.getElementById('nome-categoria');
const campoDescricaoCategoria = document.getElementById('descricao-categoria');
const botaoSalvarCategoria = document.getElementById('botao-salvar-categoria');
const botaoCancelarEdicao = document.getElementById('botao-cancelar-edicao');
const botaoAtualizarCategorias = document.getElementById('botao-atualizar');
const estadoListaCategorias = document.getElementById('estado-lista');
const listaCategorias = document.getElementById('lista-categorias');

// Mostra mensagens de estado sem inserir dados do banco como HTML.
function definirEstadoLista(mensagem, mostrar = true) {
  estadoListaCategorias.textContent = mensagem;
  estadoListaCategorias.hidden = !mostrar;
}

// Monta cada cartão com a API do DOM para impedir que dados virem HTML executável.
function criarCartaoCategoria(categoria) {
  const cartao = document.createElement('article');
  cartao.className = 'cartao-base flex flex-col';

  const cabecalho = document.createElement('div');
  cabecalho.className = 'flex items-start gap-3';
  const icone = document.createElement('i');
  icone.dataset.lucide = 'tag';
  icone.className = 'mt-1 h-5 w-5 shrink-0 text-natureza';
  icone.setAttribute('aria-hidden', 'true');

  const conteudo = document.createElement('div');
  conteudo.className = 'min-w-0 flex-1';
  const titulo = document.createElement('h3');
  titulo.className = 'break-words font-titulo text-lg font-semibold text-floresta';
  titulo.textContent = categoria.nome;

  const descricao = document.createElement('p');
  descricao.className = 'mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600';
  descricao.textContent = categoria.descricao || 'Sem descrição.';
  conteudo.append(titulo, descricao);
  cabecalho.append(icone, conteudo);

  const acoes = document.createElement('div');
  acoes.className = 'mt-5 flex gap-2 border-t border-floresta/10 pt-4';

  const botaoEditar = document.createElement('button');
  botaoEditar.type = 'button';
  botaoEditar.className = 'inline-flex items-center gap-2 rounded-lg border border-floresta/20 px-3 py-2 text-sm font-semibold text-floresta hover:bg-suave';
  botaoEditar.setAttribute('aria-label', `Editar categoria ${categoria.nome}`);
  botaoEditar.addEventListener('click', () => iniciarEdicao(categoria));
  const iconeEditar = document.createElement('i');
  iconeEditar.dataset.lucide = 'pencil';
  iconeEditar.className = 'h-4 w-4';
  iconeEditar.setAttribute('aria-hidden', 'true');
  botaoEditar.append(iconeEditar, document.createTextNode('Editar'));

  const botaoExcluir = document.createElement('button');
  botaoExcluir.type = 'button';
  botaoExcluir.className = 'inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50';
  botaoExcluir.setAttribute('aria-label', `Excluir categoria ${categoria.nome}`);
  botaoExcluir.addEventListener('click', () => excluirCategoria(categoria));
  const iconeExcluir = document.createElement('i');
  iconeExcluir.dataset.lucide = 'trash-2';
  iconeExcluir.className = 'h-4 w-4';
  iconeExcluir.setAttribute('aria-hidden', 'true');
  botaoExcluir.append(iconeExcluir, document.createTextNode('Excluir'));

  acoes.append(botaoEditar, botaoExcluir);
  cartao.append(cabecalho, acoes);
  return cartao;
}

// Busca apenas as categorias liberadas pela política RLS do usuário.
async function carregarCategorias() {
  definirEstadoLista('Carregando categorias...');
  listaCategorias.replaceChildren();
  botaoAtualizarCategorias.disabled = true;

  try {
    const { data, error } = await supabaseClient
      .from('categorias')
      .select('id, nome, descricao, created_at')
      .order('nome', { ascending: true });
    if (error) throw error;

    if (!data || data.length === 0) {
      definirEstadoLista('Você ainda não cadastrou categorias. Use o formulário para criar a primeira.');
      return;
    }

    const cartoes = data.map(criarCartaoCategoria);
    listaCategorias.replaceChildren(...cartoes);
    definirEstadoLista('', false);
    EcoUI.atualizarIcones();
  } catch (erro) {
    console.error('Erro ao carregar categorias:', erro);
    definirEstadoLista('Não foi possível carregar as categorias. Verifique sua conexão e tente novamente.');
    await EcoUI.avisar('Erro ao carregar categorias', 'Não foi possível buscar suas categorias no Supabase.', 'error');
  } finally {
    botaoAtualizarCategorias.disabled = false;
  }
}

// Coloca os dados escolhidos no formulário e muda o botão para modo de edição.
function iniciarEdicao(categoria) {
  categoriaEmEdicao = categoria.id;
  campoNomeCategoria.value = categoria.nome;
  campoDescricaoCategoria.value = categoria.descricao || '';
  document.getElementById('titulo-formulario').textContent = 'Editar categoria';
  botaoSalvarCategoria.querySelector('span').textContent = 'Salvar alterações';
  botaoCancelarEdicao.classList.remove('hidden');
  campoNomeCategoria.focus();
}

// Limpa o formulário e retorna ao modo de criação.
function cancelarEdicao() {
  categoriaEmEdicao = null;
  formularioCategoria.reset();
  document.getElementById('titulo-formulario').textContent = 'Nova categoria';
  botaoSalvarCategoria.querySelector('span').textContent = 'Salvar categoria';
  botaoCancelarEdicao.classList.add('hidden');
}

// Valida e cria uma nova categoria ou atualiza a selecionada.
async function salvarCategoria(evento) {
  evento.preventDefault();
  const nome = campoNomeCategoria.value.trim();
  const descricao = campoDescricaoCategoria.value.trim();

  if (!nome) {
    await EcoUI.avisar('Nome obrigatório', 'Informe um nome para a categoria.', 'warning');
    campoNomeCategoria.focus();
    return;
  }
  if (nome.length > 80 || descricao.length > 500) {
    await EcoUI.avisar('Texto muito longo', 'O nome aceita até 80 caracteres e a descrição até 500.', 'warning');
    return;
  }

  botaoSalvarCategoria.disabled = true;
  botaoSalvarCategoria.querySelector('span').textContent = 'Salvando...';
  const valores = { nome, descricao: descricao || null };

  try {
    let resultado;
    if (categoriaEmEdicao) {
      resultado = await supabaseClient
        .from('categorias')
        .update(valores)
        .eq('id', categoriaEmEdicao)
        .eq('user_id', usuarioCategoria.id);
    } else {
      resultado = await supabaseClient
        .from('categorias')
        .insert({ ...valores, user_id: usuarioCategoria.id });
    }

    if (resultado.error) throw resultado.error;
    const estavaEditando = Boolean(categoriaEmEdicao);
    cancelarEdicao();
    await EcoUI.avisar(
      estavaEditando ? 'Categoria atualizada' : 'Categoria criada',
      estavaEditando ? 'As alterações foram salvas.' : 'A categoria foi cadastrada com sucesso.',
      'success'
    );
    await carregarCategorias();
  } catch (erro) {
    console.error('Erro ao salvar categoria:', erro);
    await EcoUI.avisar('Erro ao salvar categoria', 'Não foi possível salvar. Verifique os dados e tente novamente.', 'error');
  } finally {
    botaoSalvarCategoria.disabled = false;
    botaoSalvarCategoria.querySelector('span').textContent = categoriaEmEdicao
      ? 'Salvar alterações'
      : 'Salvar categoria';
  }
}

// Confirma a exclusão antes de chamar o banco e identifica violação da FK.
async function excluirCategoria(categoria) {
  const confirmacao = await Swal.fire({
    title: 'Excluir categoria?',
    text: `A categoria "${categoria.nome}" será removida. Esta ação não pode ser desfeita.`,
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
      .from('categorias')
      .delete()
      .eq('id', categoria.id)
      .eq('user_id', usuarioCategoria.id);
    if (error) throw error;

    if (categoriaEmEdicao === categoria.id) cancelarEdicao();
    await EcoUI.avisar('Categoria excluída', 'A categoria foi removida com sucesso.', 'success');
    await carregarCategorias();
  } catch (erro) {
    console.error('Erro ao excluir categoria:', erro);
    if (erro.code === '23503') {
      await EcoUI.avisar(
        'Categoria vinculada',
        'Esta categoria possui desafios vinculados e não pode ser excluída. Remova ou altere os desafios relacionados primeiro.',
        'warning'
      );
      return;
    }
    await EcoUI.avisar('Erro ao excluir categoria', 'Não foi possível excluir a categoria. Tente novamente.', 'error');
  }
}

// A proteção ocorre antes de qualquer consulta ao cadastro.
document.addEventListener('DOMContentLoaded', async () => {
  formularioCategoria.addEventListener('submit', salvarCategoria);
  botaoCancelarEdicao.addEventListener('click', cancelarEdicao);
  botaoAtualizarCategorias.addEventListener('click', carregarCategorias);

  const sessao = await exigirLogin();
  if (!sessao) return;
  usuarioCategoria = sessao.user;
  await carregarCategorias();
});
