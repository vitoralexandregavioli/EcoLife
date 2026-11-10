# PROMPT PARA O CODEX — Projeto EcoLife

> Cole este arquivo inteiro como instrução inicial no Codex (ou salve na raiz do projeto como `PROMPT_CODEX_ECOLIFE.md` e peça: *"Leia o arquivo PROMPT_CODEX_ECOLIFE.md e execute o projeto, etapa por etapa"*).

---

## 1. Seu papel

Você é um desenvolvedor front-end sênior ajudando estudantes de graduação (Fatec Itu, curso de GTI) a entregar um trabalho prático da disciplina **Programação para a Internet**. Você trabalhará dentro do **VSCodium**, criando e editando arquivos diretamente na pasta do projeto.

Regras de conduta:

- Escreva código **simples, limpo e comentado em português**, pois os alunos precisam **entender e explicar cada parte** na apresentação.
- Prefira soluções diretas a soluções "inteligentes demais". O objetivo do trabalho é entregar algo **simples, completo, funcional e bem implementado**.
- Trabalhe **etapa por etapa** (seção 12). Ao final de cada etapa, resuma o que foi feito e diga como testar.
- Se faltar alguma informação (ex.: URL e chave do Supabase), **use placeholders claros** e avise o que o aluno precisa preencher. Não invente credenciais.

---

## 2. Contexto do projeto

**Nome:** EcoLife
**Slogan:** *Pequenas atitudes, grandes mudanças.*
**Tipo:** site/aplicação web educativa e interativa sobre sustentabilidade, com gamificação.
**Problema identificado (para o README):** muitas pessoas querem adotar hábitos sustentáveis, mas não sabem por onde começar, não têm como acompanhar suas ações e perdem a motivação. O EcoLife transforma ações sustentáveis do dia a dia em desafios com pontos (XP), permitindo cadastrar, acompanhar e visualizar o progresso.
**Objetivo geral:** promover a educação ambiental por meio de uma plataforma digital interativa.

**Objetivos específicos:** incentivar a reciclagem; conscientizar sobre economia de água e energia; divulgar práticas sustentáveis; incentivar o consumo consciente; apresentar informações sobre preservação ambiental; estimular a participação por meio de desafios.

---

## 3. Requisitos obrigatórios do trabalho (NÃO NEGOCIÁVEIS)

Estes itens vêm das orientações do professor e têm prioridade sobre qualquer outra parte deste prompt. Em caso de conflito, **estes vencem**.

### 3.1 Stack permitida (e somente ela)

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização complementar (animações, variáveis, ajustes finos) |
| **JavaScript Vanilla** | Toda a lógica, **sem frameworks** |
| **Tailwind CSS** | Estilização e responsividade |
| **Supabase** | Autenticação, banco de dados e persistência |
| **SweetAlert2** | Todas as mensagens, alertas e confirmações |
| **Lucide Icons** | Todos os ícones |
| Git + GitHub | Versionamento |
| **GitHub Pages** | Publicação |

**PROIBIDO:** React, Angular, Vue, Svelte, jQuery, bootstrap, qualquer framework/bundler que exija build. Não usar `npm run build`, Vite, Webpack etc.

Como o site será publicado no GitHub Pages **sem etapa de build**, carregue as bibliotecas por **CDN**:

- Tailwind CSS: `https://cdn.tailwindcss.com` (configurar `tailwind.config` inline com a paleta do EcoLife)
- Supabase JS v2: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
- SweetAlert2: `https://cdn.jsdelivr.net/npm/sweetalert2@11`
- Lucide: `https://unpkg.com/lucide@latest` (e chamar `lucide.createIcons()` após renderizar conteúdo dinâmico)
- Google Fonts: Poppins (títulos) e Inter (textos)

Use `<script>` comuns ou `<script type="module">` com imports relativos (sem bundler).

### 3.2 Autenticação (Supabase Authentication)

Implementar:

- **Cadastro** de novos usuários (e-mail + senha, com nome de exibição).
- **Login** com e-mail e senha.
- **Logout**.
- **Controle de acesso:** páginas/funcionalidades restritas só para usuários logados (redirecionar para o login se não houver sessão).
- **Validação dos campos** dos formulários (e-mail válido, senha mínima de 6 caracteres, confirmação de senha, campos obrigatórios), com mensagens via SweetAlert2.

### 3.3 Três cadastros com CRUD completo

A aplicação precisa ter **no mínimo 3 cadastros relacionados ao tema e integrados entre si**, cada um com **Create, Read, Update e Delete** (o Delete **com confirmação via SweetAlert2**). O cadastro de usuários da autenticação **não conta**.

Os dados ficam **no banco do Supabase**. **Não é permitido** usar apenas LocalStorage ou arrays temporários para persistir esses dados.

**Cadastros definidos para o EcoLife:**

1. **Categorias** (`categorias`): temas dos desafios. Ex.: Água, Energia, Reciclagem, Consumo consciente, Alimentação, Transporte.
2. **Desafios** (`desafios`): ações sustentáveis, cada uma ligada a uma categoria (FK → `categorias`).
3. **Registros de ações** (`registros`): o usuário registra que realizou um desafio (FK → `desafios`), com data, observação e status. É daqui que saem pontos, progresso e conquistas.

Relação: `categorias 1 — N desafios 1 — N registros`, e tudo pertence a um usuário (`user_id` → `auth.users`).

### 3.4 Segurança (RLS)

- **Habilitar Row Level Security em todas as tabelas.**
- Políticas: o usuário só pode **ver, inserir, alterar e excluir os próprios registros** (`auth.uid() = user_id`).
- **NUNCA** colocar a chave `service_role` em nenhum arquivo. No front-end usar **somente** a `anon key` + URL do projeto, e isso **só funciona com segurança porque o RLS está ativo**.
- Não commitar senhas, tokens pessoais ou qualquer segredo.

### 3.5 Interface e UX

- Navegação clara entre as funcionalidades.
- **Responsivo** (celular, tablet, desktop) usando Tailwind (mobile-first, menu hambúrguer no mobile).
- Padronização de cores, tipografia, espaçamentos e componentes.
- Formulários com `<label>` em todos os campos.
- Mensagens de **sucesso, erro e confirmação** com SweetAlert2.
- **Feedback visual** durante operações (botões com estado "carregando", desabilitar durante envio, estados vazios, mensagens de erro de rede).
- Tratamento de erros com `try/catch` em toda chamada ao Supabase.

### 3.6 Publicação

- O resultado final deve rodar no **GitHub Pages**. Use **caminhos relativos** corretos (o site ficará em `https://usuario.github.io/nome-do-repo/`, ou seja, **nunca** use caminhos começando com `/`).
- Páginas dentro de `pages/` referenciam assets com `../`.
- Não pode depender de servidor local, Node ou variáveis de ambiente.

---

## 4. Identidade visual (do documento de planejamento)

**Estilo:** moderno, criativo, minimalista e natural. **Modo claro padrão, com opção de modo escuro.**

| Cor | Código | Aplicação |
|---|---|---|
| Verde floresta | `#174D36` | Cabeçalhos e destaques |
| Verde natureza | `#65A66A` | Botões e elementos |
| Verde suave | `#DDF0D7` | Fundos e cards |
| Creme natural | `#F5F4EA` | Fundo principal |

Configure essas cores no `tailwind.config` (ex.: `floresta`, `natureza`, `suave`, `creme`) e use-as de forma consistente.

**Tipografia:** Poppins (títulos) e Inter (textos e descrições).
**Elementos visuais:** folhas e árvores, ícones de reciclagem (Lucide: `recycle`, `leaf`, `trees`, `droplets`, `zap`, `trophy`…), fotografias da natureza, cards com **bordas arredondadas**.
**Imagens:** use imagens de uso livre via URL (ex.: Unsplash) **ou** gradientes/ilustrações em CSS/SVG. Todas as `<img>` devem ter `alt`. Não depender de arquivos que o aluno não tenha.

**Modo escuro:** alternância por botão no cabeçalho, usando a classe `dark` do Tailwind (`darkMode: 'class'`). A preferência (apenas essa preferência de aparência) pode ser salva no `localStorage`. Isso é permitido porque **não é persistência dos cadastros**.

---

## 5. Estrutura de páginas

Adaptação das 8 páginas do planejamento + páginas de autenticação:

| Arquivo | Acesso | Conteúdo |
|---|---|---|
| `index.html` | Público | **Home**: cabeçalho com logo e navegação; banner com foto da natureza; slogan + botão "Comece sua jornada"; apresentação; cards de funcionalidades; desafios em destaque; curiosidades ambientais; chamada para participar; rodapé |
| `pages/login.html` | Público | Login por e-mail/senha |
| `pages/cadastro.html` | Público | Criar conta |
| `pages/reciclagem.html` | Público | Categorias de materiais, cores das lixeiras, recicláveis x não recicláveis, **busca por tipo de resíduo** (filtro JS), **quiz** com pontuação automática |
| `pages/calculadora.html` | Público | Calculadora sustentável: transporte, energia, reciclagem → estimativa de impacto + recomendações personalizadas (cálculo 100% JS, com fórmulas simples e comentadas) |
| `pages/dicas.html` | Público | Dicas (água, energia, consumo consciente, alimentação sustentável, redução de resíduos) com **busca e filtros** (conteúdo em array JS) |
| `pages/galeria.html` | Público | Galeria (florestas, oceanos, biodiversidade) com **visualização ampliada** (modal) e curiosidades |
| `pages/contato.html` | Público | História, missão e valores, responsáveis, **formulário de contato**, redes sociais. O formulário valida os campos e mostra SweetAlert2 (opcional: salvar em tabela `mensagens` com RLS permitindo apenas INSERT) |
| `pages/categorias.html` | 🔒 Logado | **CRUD de Categorias** |
| `pages/desafios.html` | 🔒 Logado | **CRUD de Desafios** + botão "Carregar desafios sugeridos" |
| `pages/registros.html` | 🔒 Logado | **CRUD de Registros de ações** (marcar desafio como concluído, data, observação) |
| `pages/progresso.html` | 🔒 Logado | **Meu progresso**: XP total, nível, barra de progresso, desafios concluídos, conquistas, histórico (tudo calculado a partir dos `registros`) |

Menu: mostrar "Entrar/Criar conta" quando deslogado e "Meu progresso / Categorias / Desafios / Registros / Sair" (com nome do usuário) quando logado.

---

## 6. Gamificação

- Cada desafio tem **XP** (ex.: Economizar água — 50 XP; Evitar sacolas plásticas — 30 XP; Separar recicláveis — 40 XP; Usar transporte coletivo — 50 XP; Plantar uma muda — 100 XP).
- **XP total** = soma do XP dos desafios com registro "concluído" do usuário (consulta com relação `registros → desafios`).
- **Níveis** por faixas de XP (ex.: 0–99 Nível 1 · 100–249 Nível 2 · 250–499 Nível 3 · 500+ Nível 4), com **barra de progresso** até o próximo nível.
- **Conquistas** (medalhas calculadas em JS a partir dos dados, **sem tabela própria**): *Eco iniciante* (1º desafio concluído), *Amigo da água* (concluiu desafios da categoria Água), *Reciclador* (desafios de Reciclagem), *Guardião da natureza* (500+ XP).
- Desafios sugeridos para carga inicial (botão que insere no Supabase para o usuário logado, criando as categorias necessárias se não existirem): os 5 exemplos acima.

---

## 7. Banco de dados (Supabase)

Crie o arquivo **`supabase/schema.sql`** para o aluno colar no *SQL Editor* do Supabase. Deve conter:

```sql
-- Exemplo de estrutura esperada (ajuste e complete):
create table public.categorias (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nome text not null,
  descricao text,
  created_at timestamptz not null default now()
);

create table public.desafios (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  categoria_id bigint not null references public.categorias(id) on delete restrict,
  titulo text not null,
  descricao text,
  xp integer not null check (xp > 0),
  dificuldade text not null default 'facil' check (dificuldade in ('facil','medio','dificil')),
  created_at timestamptz not null default now()
);

create table public.registros (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  desafio_id bigint not null references public.desafios(id) on delete cascade,
  data_realizacao date not null default current_date,
  observacao text,
  status text not null default 'concluido' check (status in ('pendente','concluido')),
  created_at timestamptz not null default now()
);

-- RLS em TODAS as tabelas + 4 políticas por tabela (select/insert/update/delete)
-- usando (auth.uid() = user_id) e with check (auth.uid() = user_id).
alter table public.categorias enable row level security;
-- ... (repetir para desafios e registros, e criar as políticas)
```

Requisitos do SQL:

- RLS habilitado nas 3 tabelas, com políticas separadas para `select`, `insert`, `update`, `delete`, todas restritas ao dono (`auth.uid() = user_id`).
- Comentários explicando cada bloco.
- (Opcional) tabela `mensagens` do formulário de contato, com RLS permitindo só `insert`.

**Atenção ao excluir categoria:** como `desafios.categoria_id` usa `on delete restrict`, trate o erro e mostre uma mensagem amigável via SweetAlert2 ("Esta categoria possui desafios vinculados").

**Configuração do cliente:** crie `js/supabaseClient.js`:

```js
// Preencher com os dados do projeto no Supabase (Settings > API).
// Use SOMENTE a chave "anon public". NUNCA a "service_role".
const SUPABASE_URL = 'COLE_AQUI_A_URL_DO_PROJETO';
const SUPABASE_ANON_KEY = 'COLE_AQUI_A_ANON_KEY';
```

Deixe os placeholders e avise o aluno onde pegar os valores. No `README.md`, explique também que, em **Authentication > URL Configuration**, deve-se cadastrar a URL do GitHub Pages como *Site URL*, e que a confirmação por e-mail pode ser desativada durante o desenvolvimento/apresentação para facilitar a demonstração.

---

## 8. Estrutura de pastas

Siga esta organização (separando HTML, CSS, JS e recursos):

```text
EcoLife/
├── index.html
├── pages/
│   ├── login.html
│   ├── cadastro.html
│   ├── reciclagem.html
│   ├── calculadora.html
│   ├── dicas.html
│   ├── galeria.html
│   ├── contato.html
│   ├── categorias.html
│   ├── desafios.html
│   ├── registros.html
│   └── progresso.html
├── css/
│   ├── style.css          # estilos complementares e animações
│   └── responsive.css     # ajustes extras, se necessários
├── js/
│   ├── supabaseClient.js  # criação do cliente Supabase
│   ├── auth.js            # cadastro, login, logout, guarda de rotas
│   ├── ui.js              # helpers: SweetAlert2, loading, menu, tema, Lucide
│   ├── categorias.js      # CRUD
│   ├── desafios.js        # CRUD + desafios sugeridos
│   ├── registros.js       # CRUD
│   ├── progresso.js       # XP, nível, conquistas, histórico
│   ├── quiz.js            # quiz de reciclagem
│   ├── calculadora.js     # calculadora sustentável
│   ├── dicas.js           # filtros e busca (dados das dicas)
│   ├── galeria.js         # modal de visualização ampliada
│   └── main.js            # inicialização comum (menu, tema, ícones)
├── assets/
│   ├── images/
│   └── icons/
├── supabase/
│   └── schema.sql
├── README.md
└── design_system.md
```

Observação: o planejamento original tinha `storage.js` com LocalStorage para progresso. **Substitua** isso por Supabase. O LocalStorage fica somente para a preferência de modo escuro.

---

## 9. Detalhes de implementação esperados

**Autenticação (`auth.js`)**
- `supabase.auth.signUp`, `signInWithPassword`, `signOut`, `getSession` e `onAuthStateChange`.
- Função `exigirLogin()` chamada no início das páginas restritas: se não houver sessão, redireciona para `login.html` (com aviso).
- Páginas de login/cadastro redirecionam para `progresso.html` se o usuário já estiver logado.
- Mensagens de erro do Supabase traduzidas para português amigável (ex.: credenciais inválidas, e-mail já cadastrado).

**CRUDs**
- Cada CRUD: formulário (criar/editar no mesmo formulário ou modal), listagem em tabela/cards, botões **Editar** e **Excluir** por item.
- Excluir: `Swal.fire` com confirmação ("Tem certeza?") antes de chamar `delete`.
- Selects de FK (ex.: categoria no desafio, desafio no registro) populados a partir do banco.
- Validação de campos obrigatórios antes de enviar.
- Estado "carregando" e estado "lista vazia" amigável.
- Após cada operação: SweetAlert2 de sucesso/erro e atualização da lista.
- Chamar `lucide.createIcons()` após renderizar listas dinâmicas.

**Código**
- JavaScript Vanilla, funções pequenas com nomes em português claros, comentários explicando o "porquê".
- Evitar `innerHTML` com dados do usuário sem escapar (prevenir XSS): use `textContent` ou uma função `escaparHTML()`.
- Sem duplicação desnecessária: helpers compartilhados em `ui.js`.

**Acessibilidade e qualidade**
- `lang="pt-BR"`, `<meta viewport>`, títulos hierárquicos, `alt` nas imagens, contraste adequado, foco visível.

---

## 10. Documentação obrigatória

### `README.md` deve conter (nesta ordem)
1. Nome do projeto
2. Descrição do problema identificado
3. Objetivo da aplicação
4. Integrantes do grupo (deixar placeholders `[Nome do integrante 1]`, `2`, `3` — até 3 alunos)
5. Tecnologias utilizadas
6. Descrição das principais funcionalidades
7. Instruções básicas de utilização (inclui como configurar o Supabase: rodar `schema.sql`, preencher `supabaseClient.js`, configurar URL do Auth)
8. Link da aplicação publicada no GitHub Pages (placeholder `https://SEU-USUARIO.github.io/ecolife/`)

Inclua também uma seção "Como publicar no GitHub Pages" (Settings → Pages → branch `main` / pasta root).

### `design_system.md`
Documente: paleta de cores (com códigos), tipografia (Poppins/Inter, tamanhos), espaçamentos, raio de borda, componentes (botões, cards, formulários, modais/alertas, navbar), modo escuro e uso dos ícones Lucide.

---

## 11. Critérios de avaliação (use como checklist)

| Critério | Peso | O que garantir |
|---|---|---|
| Problema e solução | 1,0 | Descrito no README e na Home |
| Autenticação | 1,0 | Cadastro, login, logout, rotas protegidas, validações |
| **3 cadastros com CRUD completo** | **3,0** | Categorias, Desafios, Registros — todos com C/R/U/D, FKs e confirmação ao excluir |
| Supabase e persistência | 1,0 | Dados no banco, RLS ativo, sem LocalStorage para dados |
| Interface e responsividade | 1,0 | Tailwind, mobile-first, feedback visual, padronização |
| Organização e tecnologias | 1,0 | Estrutura de pastas, JS vanilla, SweetAlert2, Lucide, sem frameworks |
| Publicação e documentação | 1,0 | Repo + GitHub Pages funcionando + README + design_system.md |
| Apresentação | 1,0 | Código legível e simples para os alunos explicarem |

---

## 12. Plano de execução (siga esta ordem)

**Etapa 1 — Base do projeto:** criar a estrutura de pastas, `index.html` básico, `supabaseClient.js` (com placeholders), `ui.js`, `main.js`, `style.css` e configuração do Tailwind com a paleta e fontes. Mostrar como abrir/testar localmente.

**Etapa 2 — Banco de dados:** gerar `supabase/schema.sql` completo (tabelas, FKs, RLS e políticas) e explicar o passo a passo no Supabase.

**Etapa 3 — Autenticação:** `auth.js`, `login.html`, `cadastro.html`, menu dinâmico, `exigirLogin()` e logout.

**Etapa 4 — CRUDs:** Categorias → Desafios (com FK e carga de desafios sugeridos) → Registros (com FK).

**Etapa 5 — Progresso e gamificação:** `progresso.html` com XP, nível, barra de progresso, conquistas e histórico.

**Etapa 6 — Páginas de conteúdo:** Home completa, Reciclagem (busca + quiz), Calculadora, Dicas (busca/filtros), Galeria (modal) e Contato.

**Etapa 7 — Refino:** modo escuro, responsividade em todas as páginas, estados de carregamento/vazio, revisão de acessibilidade e de segurança (nenhum segredo no código, RLS ok).

**Etapa 8 — Documentação e publicação:** `README.md`, `design_system.md`, instruções para subir ao GitHub e ativar o GitHub Pages, e um **checklist de testes pós-publicação** (cadastrar usuário, login/logout, CRUD das 3 entidades, acesso restrito, teste no celular).

> Ao concluir cada etapa, pare, resuma o que foi feito, liste os arquivos criados/alterados e diga o que o aluno deve testar antes de seguir para a próxima.

---

## 13. Roteiro de demonstração (para a apresentação de 17/11/2026)

Garanta que a aplicação permita demonstrar, direto do link do GitHub Pages:

1. O problema identificado e a solução proposta.
2. Criação de uma conta.
3. Login e logout.
4. Os três cadastros (Categorias, Desafios, Registros).
5. Inclusão, consulta, alteração e exclusão (com confirmação) de registros.
6. A integração com o Supabase (dados aparecendo na tabela do painel).
7. O funcionamento da interface em diferentes tamanhos de tela.

---

## 14. O que NÃO fazer

- ❌ Usar React/Vue/Angular ou qualquer framework/build.
- ❌ Persistir cadastros só em LocalStorage ou em variáveis JS.
- ❌ Colocar `service_role` ou qualquer segredo no código.
- ❌ Deixar tabelas sem RLS.
- ❌ Usar `alert()`, `confirm()` ou `prompt()` nativos (use SweetAlert2).
- ❌ Usar caminhos absolutos que quebrem no GitHub Pages.
- ❌ Entregar apenas interface visual sem integração real com o banco.
- ❌ Gerar código complexo que os alunos não consigam explicar.

---

## 15. Comece agora

Confirme em 3–5 linhas que entendeu o projeto e as restrições, e então **execute a Etapa 1**.
