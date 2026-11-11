// Imagens ilustrativas da natureza; textos alternativos descrevem cada cena.
const imagensGaleria = [
  { titulo: 'Floresta iluminada', categoria: 'Florestas', arquivo: 'photo-1448375240586-882707db888b', alt: 'Luz atravessando árvores altas em uma floresta verde', curiosidade: 'Florestas oferecem habitat para muitas espécies.' },
  { titulo: 'Caminho entre árvores', categoria: 'Florestas', arquivo: 'photo-1511497584788-876760111969', alt: 'Troncos e copas de árvores em uma área florestal', curiosidade: 'Áreas naturais conectadas ajudam espécies a circular entre habitats.' },
  { titulo: 'Oceano azul', categoria: 'Oceanos', arquivo: 'photo-1518837695005-2083093ee35b', alt: 'Ondas azuis do oceano chegando à costa', curiosidade: 'Os oceanos conectam continentes e diferentes ecossistemas.' },
  { titulo: 'Ondas e costa', categoria: 'Oceanos', arquivo: 'photo-1500375592092-40eb2168fd21', alt: 'Vista ampla de ondas e água do mar', curiosidade: 'Costas e recifes abrigam comunidades diversas de organismos.' },
  { titulo: 'Veado em ambiente natural', categoria: 'Animais', arquivo: 'photo-1472396961693-142e6e269027', alt: 'Veado em meio à vegetação de uma floresta', curiosidade: 'Cada espécie tem um papel nas relações do ecossistema.' },
  { titulo: 'Elefante na savana', categoria: 'Animais', arquivo: 'photo-1564760055775-d63b17a55c44', alt: 'Elefante caminhando em uma paisagem de savana', curiosidade: 'A proteção dos habitats também contribui para a conservação da fauna.' },
  { titulo: 'Montanhas e vale', categoria: 'Biodiversidade', arquivo: 'photo-1470071459604-3b5ec3a7fe05', alt: 'Vale verde entre montanhas cobertas por névoa', curiosidade: 'Biodiversidade inclui variedade de genes, espécies e ecossistemas.' },
  { titulo: 'Paisagem natural', categoria: 'Biodiversidade', arquivo: 'photo-1500530855697-b586d89ba3ee', alt: 'Paisagem ampla de montanhas, campo e céu', curiosidade: 'A diversidade de ambientes sustenta diferentes formas de vida.' }
];

const gradeGaleria = document.getElementById('grade-galeria');
const modalGaleria = document.getElementById('modal-galeria');
const botaoFecharGaleria = document.getElementById('fechar-modal-galeria');

// Monta cartões de imagem com atributos de acessibilidade e sem HTML dinâmico.
function renderizarGaleria() {
  const cartoes = imagensGaleria.map((item) => {
    const cartao = document.createElement('article');
    cartao.className = 'overflow-hidden rounded-2xl border border-floresta/10 bg-white shadow-sm';

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'group block w-full text-left focus:outline-none focus:ring-4 focus:ring-inset focus:ring-natureza';
    botao.setAttribute('aria-label', `Ampliar imagem: ${item.titulo}`);
    botao.addEventListener('click', () => abrirImagem(item));

    const imagem = document.createElement('img');
    imagem.src = `https://images.unsplash.com/${item.arquivo}?auto=format&fit=crop&w=900&q=80`;
    imagem.alt = item.alt;
    imagem.loading = 'lazy';
    imagem.decoding = 'async';
    imagem.className = 'h-60 w-full object-cover transition duration-300 group-hover:scale-[1.03]';

    const legenda = document.createElement('div');
    legenda.className = 'flex items-center justify-between gap-3 p-4';
    const texto = document.createElement('div');
    const titulo = document.createElement('h3');
    titulo.className = 'font-titulo font-semibold text-floresta';
    titulo.textContent = item.titulo;
    const categoria = document.createElement('p');
    categoria.className = 'mt-1 text-xs font-medium text-natureza';
    categoria.textContent = item.categoria;
    texto.append(titulo, categoria);

    const icone = document.createElement('i');
    icone.dataset.lucide = 'maximize-2';
    icone.className = 'h-5 w-5 shrink-0 text-floresta';
    icone.setAttribute('aria-hidden', 'true');
    legenda.append(texto, icone);
    botao.append(imagem, legenda);
    cartao.append(botao);
    return cartao;
  });
  gradeGaleria.replaceChildren(...cartoes);
  if (window.lucide) window.lucide.createIcons();
}

// Abre o modal e transfere a descrição acessível da imagem selecionada.
function abrirImagem(item) {
  const imagem = document.getElementById('imagem-ampliada');
  document.getElementById('modal-titulo').textContent = item.titulo;
  document.getElementById('modal-descricao').textContent = `${item.categoria} · ${item.curiosidade}`;
  imagem.src = `https://images.unsplash.com/${item.arquivo}?auto=format&fit=crop&w=1800&q=90`;
  imagem.alt = item.alt;
  modalGaleria.showModal();
  botaoFecharGaleria.focus();
}

function fecharGaleria() {
  if (modalGaleria.open) modalGaleria.close();
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarGaleria();
  botaoFecharGaleria.addEventListener('click', fecharGaleria);

  // O evento cancel é disparado pelo navegador quando a pessoa pressiona Escape.
  modalGaleria.addEventListener('cancel', (evento) => {
    evento.preventDefault();
    fecharGaleria();
  });

  // Clicar no fundo do dialog (fora do conteúdo) fecha a visualização ampliada.
  modalGaleria.addEventListener('click', (evento) => {
    if (evento.target === modalGaleria) fecharGaleria();
  });
});
