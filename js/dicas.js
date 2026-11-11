// Conteúdo educativo local, filtrado no navegador e sem persistência.
const dicasSustentaveis = [
  { categoria: 'Água', titulo: 'Reduza o tempo do banho', texto: 'Um banho mais curto reduz o tempo de água e energia usados. Experimente diminuir alguns minutos de cada vez.', icone: 'droplets' },
  { categoria: 'Água', titulo: 'Feche a torneira ao escovar os dentes', texto: 'Deixe a torneira fechada enquanto escova e abra apenas para enxaguar.', icone: 'droplets' },
  { categoria: 'Água', titulo: 'Observe vazamentos', texto: 'Verifique torneiras, descargas e tubulações. Um vazamento merece reparo para evitar desperdício contínuo.', icone: 'wrench' },
  { categoria: 'Energia', titulo: 'Apague as luzes ao sair', texto: 'Aproveite a luz natural e desligue a iluminação de ambientes vazios.', icone: 'lightbulb' },
  { categoria: 'Energia', titulo: 'Desligue aparelhos sem uso', texto: 'Desligue equipamentos quando não forem necessários e evite deixá-los ligados por hábito.', icone: 'plug-zap' },
  { categoria: 'Energia', titulo: 'Use a máquina com carga adequada', texto: 'Junte roupas para usar a máquina de lavar com uma carga apropriada às orientações do fabricante.', icone: 'washing-machine' },
  { categoria: 'Consumo consciente', titulo: 'Planeje as compras', texto: 'Faça uma lista e pense se realmente precisa do item antes de comprar.', icone: 'list-checks' },
  { categoria: 'Consumo consciente', titulo: 'Prefira itens reutilizáveis', texto: 'Leve sacola, garrafa ou copo reutilizável quando isso for prático para você.', icone: 'shopping-bag' },
  { categoria: 'Consumo consciente', titulo: 'Repare antes de substituir', texto: 'Quando possível e seguro, conserte roupas e objetos para prolongar seu uso.', icone: 'hammer' },
  { categoria: 'Alimentação sustentável', titulo: 'Planeje as refeições', texto: 'Organize refeições e compras para aproveitar melhor os alimentos e reduzir sobras esquecidas.', icone: 'calendar-check' },
  { categoria: 'Alimentação sustentável', titulo: 'Aproveite os alimentos por inteiro', texto: 'Use partes comestíveis que costuma descartar, desde que estejam próprias e sejam seguras para consumo.', icone: 'carrot' },
  { categoria: 'Alimentação sustentável', titulo: 'Escolha alimentos da estação', texto: 'Procure opções da estação e produzidas perto de você quando estiverem disponíveis.', icone: 'apple' },
  { categoria: 'Redução de resíduos', titulo: 'Separe os recicláveis limpos', texto: 'Esvazie embalagens e mantenha materiais secos, seguindo as regras da coleta local.', icone: 'recycle' },
  { categoria: 'Redução de resíduos', titulo: 'Faça compostagem de orgânicos', texto: 'Se houver espaço ou serviço disponível, destine restos vegetais à compostagem.', icone: 'sprout' },
  { categoria: 'Redução de resíduos', titulo: 'Recuse descartáveis quando puder', texto: 'Em situações práticas, escolha alternativas reutilizáveis para reduzir resíduos de uso único.', icone: 'cup-soda' }
];

let categoriaDicasAtual = 'todas';
const campoBuscaDicas = document.getElementById('busca-dicas');
const listaDicas = document.getElementById('lista-dicas');
const estadoDicas = document.getElementById('estado-dicas');

// Remove acentos para que buscas como "agua" também encontrem "água".
function normalizarBuscaDica(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

// Cria um cartão seguro com texto inserido por textContent.
function criarCartaoDica(dica) {
  const cartao = document.createElement('article');
  cartao.className = 'cartao-base';
  const icone = document.createElement('i');
  icone.dataset.lucide = dica.icone;
  icone.className = 'mb-4 h-7 w-7 text-natureza';
  icone.setAttribute('aria-hidden', 'true');
  const categoria = document.createElement('p');
  categoria.className = 'text-xs font-semibold uppercase tracking-wide text-natureza';
  categoria.textContent = dica.categoria;
  const titulo = document.createElement('h3');
  titulo.className = 'mt-2 font-titulo text-lg font-semibold text-floresta';
  titulo.textContent = dica.titulo;
  const texto = document.createElement('p');
  texto.className = 'mt-2 text-sm leading-6 text-slate-600';
  texto.textContent = dica.texto;
  cartao.append(icone, categoria, titulo, texto);
  return cartao;
}

// Filtra pelo texto da dica e pela categoria selecionada.
function filtrarDicas() {
  const busca = normalizarBuscaDica(campoBuscaDicas.value.trim());
  const resultados = dicasSustentaveis.filter((dica) => {
    const textoCompleto = normalizarBuscaDica(`${dica.categoria} ${dica.titulo} ${dica.texto}`);
    const correspondeTexto = textoCompleto.includes(busca);
    const correspondeCategoria = categoriaDicasAtual === 'todas' || dica.categoria === categoriaDicasAtual;
    return correspondeTexto && correspondeCategoria;
  });

  listaDicas.replaceChildren(...resultados.map(criarCartaoDica));
  estadoDicas.textContent = resultados.length
    ? `${resultados.length} dica(s) encontrada(s).`
    : 'Nenhuma dica encontrada. Tente outro termo ou escolha outra categoria.';
  if (window.lucide) window.lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  campoBuscaDicas.addEventListener('input', filtrarDicas);
  document.getElementById('filtros-dicas').addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-categoria]');
    if (!botao) return;
    categoriaDicasAtual = botao.dataset.categoria;
    document.querySelectorAll('.filtro-dica').forEach((filtro) => {
      const ativo = filtro === botao;
      filtro.setAttribute('aria-pressed', String(ativo));
      filtro.className = ativo
        ? 'filtro-dica rounded-full bg-floresta px-4 py-2 text-sm font-semibold text-white'
        : 'filtro-dica rounded-full border border-floresta/20 bg-white px-4 py-2 text-sm font-semibold text-floresta';
    });
    filtrarDicas();
  });
  filtrarDicas();
});
