// Funções pequenas compartilhadas pela interface.
const EcoUI = {
  // Atualiza os ícones Lucide, inclusive os adicionados dinamicamente.
  atualizarIcones() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  // Exibe mensagens padronizadas usando SweetAlert2.
  avisar(titulo, texto, tipo = 'info') {
    if (window.Swal) {
      return window.Swal.fire({
        title: titulo,
        text: texto,
        icon: tipo,
        confirmButtonColor: '#174D36'
      });
    }

    // Mantém a mensagem visível caso a CDN não esteja disponível.
    console.warn(`${titulo}: ${texto}`);
    return Promise.resolve();
  }
};
