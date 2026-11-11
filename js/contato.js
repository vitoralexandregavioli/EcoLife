// Valida o formulário demonstrativo e pede confirmação pelo SweetAlert2.
const formularioContato = document.getElementById('form-contato');
const botaoEnviarContato = document.getElementById('botao-enviar-contato');

async function validarContato(evento) {
  evento.preventDefault();
  const nome = document.getElementById('nome-contato').value.trim();
  const campoEmail = document.getElementById('email-contato');
  const email = campoEmail.value.trim();
  const mensagem = document.getElementById('mensagem-contato').value.trim();

  if (!nome || !email || !mensagem) {
    await EcoUI.avisar('Campos obrigatórios', 'Preencha nome, e-mail e mensagem.', 'warning');
    return;
  }
  if (nome.length < 2 || nome.length > 100) {
    await EcoUI.avisar('Nome inválido', 'Informe um nome com pelo menos 2 caracteres.', 'warning');
    return;
  }
  if (!campoEmail.validity.valid) {
    await EcoUI.avisar('E-mail inválido', 'Digite um endereço de e-mail válido.', 'warning');
    return;
  }
  if (mensagem.length < 10 || mensagem.length > 2000) {
    await EcoUI.avisar('Mensagem inválida', 'A mensagem deve ter entre 10 e 2000 caracteres.', 'warning');
    return;
  }

  botaoEnviarContato.disabled = true;
  botaoEnviarContato.querySelector('span').textContent = 'Aguardando confirmação...';
  try {
    const confirmacao = await Swal.fire({
      title: 'Confirmar mensagem?',
      text: 'Este formulário é demonstrativo e não transmite nem armazena mensagens.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Revisar',
      confirmButtonColor: '#174D36'
    });

    if (confirmacao.isConfirmed) {
      await EcoUI.avisar('Mensagem validada', 'Obrigado pelo contato. Neste protótipo, a mensagem não é enviada para um servidor.', 'success');
      formularioContato.reset();
    }
  } catch (erro) {
    console.error('Erro ao confirmar o formulário de contato:', erro);
    await EcoUI.avisar('Não foi possível confirmar', 'Tente novamente.', 'error');
  } finally {
    botaoEnviarContato.disabled = false;
    botaoEnviarContato.querySelector('span').textContent = 'Revisar mensagem';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  formularioContato.addEventListener('submit', validarContato);
});
