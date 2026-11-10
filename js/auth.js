// Rotas relativas para manter o projeto compatível com o GitHub Pages.
function rotaPagina(nome) {
  const dentroDePages = window.location.pathname.includes('/pages/');
  return dentroDePages ? nome : `pages/${nome}`;
}

function rotaInicio() {
  return window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
}

// Traduz erros comuns retornados pelo Supabase para mensagens mais claras.
function traduzirErroAuth(erro) {
  const mensagem = (erro?.message || '').toLowerCase();

  if (mensagem.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (mensagem.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if (mensagem.includes('user already registered') || mensagem.includes('already registered')) return 'Este e-mail já possui uma conta.';
  if (mensagem.includes('password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (mensagem.includes('unable to validate email') || mensagem.includes('invalid email')) return 'Informe um endereço de e-mail válido.';
  if (mensagem.includes('network') || mensagem.includes('fetch')) return 'Não foi possível conectar. Verifique sua internet e tente novamente.';

  return 'Não foi possível concluir a operação. Confira os dados e tente novamente.';
}

// Controla visualmente o botão enquanto uma requisição está em andamento.
function definirCarregamento(botao, carregando, textoOriginal) {
  if (!botao) return;
  botao.disabled = carregando;
  botao.textContent = carregando ? 'Aguarde...' : textoOriginal;
}

// Monta os links de navegação de acordo com a sessão atual.
function atualizarMenuAuth(sessao) {
  const menu = document.getElementById('auth-menu');
  if (!menu) return;

  menu.replaceChildren();
  if (sessao?.user) {
    const nome = sessao.user.user_metadata?.display_name || sessao.user.email || 'Minha conta';
    const nomeUsuario = document.createElement('span');
    nomeUsuario.className = 'max-w-40 truncate font-semibold text-floresta';
    nomeUsuario.textContent = nome;

    const linkProgresso = document.createElement('a');
    linkProgresso.className = 'font-semibold text-floresta hover:underline';
    linkProgresso.href = rotaPagina('progresso.html');
    linkProgresso.textContent = 'Meu progresso';

    const botaoSair = document.createElement('button');
    botaoSair.type = 'button';
    botaoSair.className = 'rounded-lg border border-floresta px-3 py-2 font-semibold text-floresta hover:bg-suave';
    botaoSair.textContent = 'Sair';
    botaoSair.addEventListener('click', sair);

    menu.append(nomeUsuario, linkProgresso, botaoSair);
  } else {
    const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    const linkEntrar = document.createElement('a');
    linkEntrar.className = 'font-semibold text-floresta hover:underline';
    linkEntrar.href = `${base}login.html`;
    linkEntrar.textContent = 'Entrar';

    const linkCadastro = document.createElement('a');
    linkCadastro.className = 'rounded-lg bg-natureza px-3 py-2 font-semibold text-white hover:bg-floresta';
    linkCadastro.href = `${base}cadastro.html`;
    linkCadastro.textContent = 'Criar conta';

    menu.append(linkEntrar, linkCadastro);
  }
}

// Envia os dados de cadastro para Supabase Authentication.
async function cadastrar(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const botao = document.getElementById('botao-cadastro');
  const nome = formulario.elements.nome.value.trim();
  const email = formulario.elements.email.value.trim();
  const senha = formulario.elements.senha.value;
  const confirmarSenha = formulario.elements['confirmar-senha'].value;

  if (!nome || !email || !senha || !confirmarSenha) {
    await EcoUI.avisar('Campos obrigatórios', 'Preencha todos os campos para criar sua conta.', 'warning');
    return;
  }
  if (!formulario.elements.email.validity.valid) {
    await EcoUI.avisar('E-mail inválido', 'Digite um endereço de e-mail válido.', 'warning');
    return;
  }
  if (senha.length < 6) {
    await EcoUI.avisar('Senha muito curta', 'A senha precisa ter pelo menos 6 caracteres.', 'warning');
    return;
  }
  if (senha !== confirmarSenha) {
    await EcoUI.avisar('Senhas diferentes', 'Confira a senha e a confirmação.', 'warning');
    return;
  }

  definirCarregamento(botao, true, 'Criar minha conta');
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password: senha,
      options: { data: { display_name: nome } }
    });
    if (error) throw error;

    if (data.session) {
      await EcoUI.avisar('Conta criada', 'Sua conta foi criada com sucesso.', 'success');
      window.location.href = rotaPagina('progresso.html');
    } else {
      await EcoUI.avisar('Confira seu e-mail', 'Enviamos uma mensagem para confirmar o cadastro. Depois, entre com seu e-mail e senha.', 'success');
      window.location.href = rotaPagina('login.html');
    }
  } catch (erro) {
    await EcoUI.avisar('Não foi possível criar a conta', traduzirErroAuth(erro), 'error');
  } finally {
    definirCarregamento(botao, false, 'Criar minha conta');
  }
}

// Valida e autentica o usuário com e-mail e senha.
async function entrar(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const botao = document.getElementById('botao-login');
  const email = formulario.elements.email.value.trim();
  const senha = formulario.elements.senha.value;

  if (!email || !senha) {
    await EcoUI.avisar('Campos obrigatórios', 'Informe seu e-mail e sua senha.', 'warning');
    return;
  }
  if (!formulario.elements.email.validity.valid) {
    await EcoUI.avisar('E-mail inválido', 'Digite um endereço de e-mail válido.', 'warning');
    return;
  }
  if (senha.length < 6) {
    await EcoUI.avisar('Senha inválida', 'A senha precisa ter pelo menos 6 caracteres.', 'warning');
    return;
  }

  definirCarregamento(botao, true, 'Entrar');
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password: senha });
    if (error) throw error;
    await EcoUI.avisar('Login realizado', 'Você entrou na sua conta EcoLife.', 'success');
    window.location.href = rotaPagina('progresso.html');
  } catch (erro) {
    await EcoUI.avisar('Não foi possível entrar', traduzirErroAuth(erro), 'error');
  } finally {
    definirCarregamento(botao, false, 'Entrar');
  }
}

// Encerra a sessão e volta para a página inicial.
async function sair() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    await EcoUI.avisar('Sessão encerrada', 'Você saiu da sua conta.', 'success');
    window.location.href = rotaInicio();
  } catch (erro) {
    await EcoUI.avisar('Não foi possível sair', traduzirErroAuth(erro), 'error');
  }
}

// Use no início de cada página privada. Se não houver sessão, manda ao login.
async function exigirLogin() {
  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    if (!data.session) {
      await EcoUI.avisar('Entre para continuar', 'Esta área está disponível somente para usuários logados.', 'info');
      window.location.href = rotaPagina('login.html');
      return null;
    }
    return data.session;
  } catch (erro) {
    await EcoUI.avisar('Não foi possível verificar sua sessão', traduzirErroAuth(erro), 'error');
    window.location.href = rotaPagina('login.html');
    return null;
  }
}

// Inicializa os formulários, atualiza o menu e trata páginas públicas de acesso.
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('form-login')?.addEventListener('submit', entrar);
  document.getElementById('form-cadastro')?.addEventListener('submit', cadastrar);

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    await EcoUI.avisar('Sessão indisponível', traduzirErroAuth(error), 'error');
    return;
  }
  atualizarMenuAuth(data.session);

  const estaNaTelaAcesso = document.getElementById('form-login') || document.getElementById('form-cadastro');
  if (estaNaTelaAcesso && data.session) {
    window.location.href = rotaPagina('progresso.html');
  }

  supabaseClient.auth.onAuthStateChange((_evento, sessaoAtual) => {
    atualizarMenuAuth(sessaoAtual);
  });
});
