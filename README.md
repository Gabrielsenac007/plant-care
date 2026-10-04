# PlantCare Frontend — Documentação

## 1. Sobre o projeto

O **PlantCare** é uma aplicação para gerenciamento e acompanhamento de plantas. Este repositório contém o **frontend**, que consome a API REST do backend (Java 21, Spring Boot 4 e MySQL).

Com ele é possível:

- cadastrar, editar e excluir **plantas** e **categorias**;
- pesquisar plantas por nome e filtrar por categoria;
- acompanhar a rega: próxima data e status (em dia, hoje, atrasada, sem data);
- visualizar um **painel** com totais e as plantas que precisam de atenção;
- registrar uma rega com um clique ("Reguei").

O projeto atende a um desafio de frontend com **CRUD de pelo menos duas entidades** (plantas e categorias, relação 1:N).

---

## 2. Tecnologias

| Tecnologia | Utilização |
|---|---|
| React | Construção da interface em componentes |
| TypeScript | Tipagem estática, alinhada aos DTOs do backend |
| Vite | Servidor de desenvolvimento e build |
| Tailwind CSS v4 | Estilização utilitária e design tokens via `@theme` |
| React Router | Rotas e layout compartilhado com rotas aninhadas |
| Axios | Cliente HTTP |
| Lucide React | Ícones SVG |
| React Hot Toast | Notificações de sucesso e erro |

### Por que não usar MUI ou Chakra UI?

O escopo é pequeno (cards, modais, formulários) e a identidade visual é própria, com paleta verde definida. O Tailwind resolve a interface com menos dependências e sem precisar sobrescrever o tema de uma biblioteca de componentes.

### Por que não usar Redux, Zustand ou React Query?

Há duas entidades e telas independentes. `useState`, `useEffect` e `useCallback` são suficientes: cada tela busca seus dados e os recarrega após criar, editar ou excluir. Em um projeto maior, o React Query seria um bom próximo passo para cache e sincronização.

---

## 3. Rotas

| Rota | Tela | Descrição |
|---|---|---|
| `/` | Introduction | Página informativa sobre o projeto e a parte técnica |
| `/center` | Dashboard | Totais, plantas para regar hoje e atrasadas |
| `/center/plants` | Plantas | Lista, busca, filtro, criação, edição e exclusão |
| `/center/categories` | Categorias | CRUD de categorias |

As rotas `/center/*` são rotas **aninhadas**: o componente `Center` renderiza a navbar e um `<Outlet />`, e cada tela é renderizada dentro dele.

---

## 4. Estrutura do projeto

```text
src
├── components
│   ├── ConfirmModal.tsx
│   ├── Logo.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
│   ├── PlantCard.tsx
│   ├── PlantForm.tsx
│   ├── StatCard.tsx
│   └── StatusBadge.tsx
│
├── pages
│   ├── Categories.tsx
│   ├── Center.tsx
│   ├── Dashboard.tsx
│   ├── Introduction.tsx
│   └── Plants.tsx
│
├── services
│   ├── api.ts
│   ├── categoryService.ts
│   └── plantService.ts
│
├── types
│   └── index.ts
│
├── utils
│   ├── date.ts
│   ├── plant.ts
│   └── ui.ts
│
├── App.tsx
├── Routes.tsx
└── index.css
```

### Responsabilidade de cada pasta

- **pages:** telas, ligadas a uma rota. Orquestram estado e chamadas aos services.
- **components:** peças reutilizáveis, sem conhecimento de rotas ou de API.
- **services:** toda a comunicação HTTP. As telas nunca usam `axios` diretamente.
- **types:** interfaces TypeScript que espelham os DTOs do backend.
- **utils:** funções auxiliares (datas, configuração de status, classes de UI).

---

## 5. Fluxo de dados

```text
Página  →  Service  →  Axios  →  API Spring Boot
  ▲                                    │
  └────────── resposta tipada ─────────┘
```

Exemplo, ao salvar uma planta:

1. `PlantForm` valida os campos e monta um `PlantRequest`.
2. `Plants` chama `plantService.create(data)` ou `plantService.update(id, data)`.
3. O service usa a instância do Axios (`api.ts`), que já conhece a `baseURL`.
4. Em caso de sucesso, a tela exibe um toast e recarrega a lista.
5. Em caso de erro, `getErrorMessage` extrai a `message` do `ApiError` do backend e exibe no toast.

---

## 6. Padrões e decisões de projeto

### Camada de serviços

Cada entidade possui um service com as operações da API (`list`, `create`, `update`, `remove`). Isso isola a URL e o formato das requisições da interface e facilita trocar ou testar a comunicação.

### Tipagem espelhando o backend

```ts
export type PlantRequest = Omit<Plant, 'id' | 'nextWatering' | 'wateringStatus' | 'categoryName'>;
```

`PlantRequest` é derivado de `Plant`, evitando duplicar campos. O envio usa `categoryId`, e a resposta traz `categoryId` e `categoryName`, como no backend.

### Regras de negócio ficam no backend

O frontend **não calcula** a próxima rega nem o status. Ele apenas exibe `nextWatering` e `wateringStatus` recebidos da API, mantendo uma única fonte de verdade.

### Design tokens com Tailwind v4

As cores são declaradas em `index.css` e viram classes utilitárias automaticamente:

```css
@theme {
  --color-primary-background: #F1F8EA;
  --color-secundary-background: #DDEEC9;
  --color-bordas: #CFE3BC;
  --color-details: #6FAE3E;
  --color-primary-button: #3B7D1E;
  --color-titles: #27500A;
}
```

Uso: `bg-primary-button`, `text-titles`, `border-bordas`.

### Composição de componentes

`Modal` e `ConfirmModal` são genéricos. `PlantForm` serve para **criar e editar**, recebendo `initial` quando é uma edição. `StatusBadge` centraliza a aparência de cada status.

### Rotas aninhadas

`Center` define o layout (navbar + `Outlet`) uma única vez. O botão "Nova planta" da navbar navega para `/center/plants` com `state: { openForm: true }`, e a tela de plantas abre o modal ao receber esse estado.

### Busca com debounce

A pesquisa por nome aguarda 300 ms sem digitação antes de chamar `GET /api/plants?name=`, evitando uma requisição por tecla. O filtro por categoria usa o mesmo mecanismo e os dois parâmetros funcionam juntos.

### Datas no fuso local

```ts
export const todayISO = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local
```

Usar `toISOString()` retornaria a data em UTC e, à noite no fuso de Recife, enviaria "amanhã", que o backend recusa por causa do `@PastOrPresent`. As datas exibidas (`dd/mm`) também são formatadas sem passar por `Date`, evitando deslocamentos.

### Tratamento de erros e feedback

- Erros do backend (`404`, categoria duplicada, validações) são mostrados em toast com a `message` da API.
- Falha de conexão tem mensagem própria.
- Há estados de carregamento e de lista vazia.
- Exclusões pedem confirmação em modal.
- Categoria com plantas não pode ser excluída (regra 7 do backend), e a interface já sinaliza isso com a lixeira desabilitada visualmente.

### Imagens com fallback

Se `imageUrl` estiver vazio ou falhar ao carregar, o card exibe um ícone de broto no lugar da foto.

### Acessibilidade básica

- Modais com `role="dialog"`, `aria-modal` e fechamento pela tecla **Esc**.
- Botões só com ícone possuem `aria-label`.
- Campos com foco visível.

### Responsividade

Abordagem mobile-first com breakpoints do Tailwind: a grade de plantas passa de 1 para 2 e 3 colunas, e os cards do painel de 2 para 4.

---

## 7. Integração com a API

| Tela | Endpoint |
|---|---|
| Dashboard | `GET /api/plants/dashboard` |
| Dashboard, botão "Reguei" | `PUT /api/plants/{id}` com `lastWatering` de hoje |
| Plantas, listagem e filtros | `GET /api/plants?name=&categoryId=` |
| Plantas, criar | `POST /api/plants` |
| Plantas, editar | `PUT /api/plants/{id}` |
| Plantas, excluir | `DELETE /api/plants/{id}` |
| Categorias, listar | `GET /api/categories` |
| Categorias, criar | `POST /api/categories` |
| Categorias, editar | `PUT /api/categories/{id}` |
| Categorias, excluir | `DELETE /api/categories/{id}` |

O backend permite CORS para `http://localhost:5173` e `http://localhost:3000`.

---

## 8. Identidade visual

### Paleta

| Uso | Cor |
|---|---|
| Fundo geral e cards | `#FFFFFF` |
| Fundo suave (métricas, listas vazias) | `#F1F8EA` |
| Fundo de destaque (fotos, badges) | `#DDEEC9` |
| Bordas | `#CFE3BC` |
| Detalhes (ícones, aba ativa) | `#6FAE3E` |
| Botão principal | `#3B7D1E` |
| Títulos | `#27500A` |

### Status da rega

| Status do backend | Texto exibido | Cor |
|---|---|---|
| `UPCOMING` | Em dia | Verde |
| `DUE_TODAY` | Regar hoje | Âmbar |
| `OVERDUE` | Atrasada | Vermelho |
| `NOT_SET` | Sem data | Cinza |

### Tipografia e logo

- Fonte: **Nunito** (Google Fonts).
- Logo: um broto com duas folhas e uma gota de água, disponível em variações (principal, vertical, ícone, monocromática e reversa). O favicon fica em `public/favicon.svg`.

---

## 9. Como executar

### Pré-requisitos

- Node.js 20 ou superior
- Backend do PlantCare rodando em `http://localhost:8080`

### Instalação

```bash
npm install
```

### Variáveis de ambiente (opcional)

Crie um arquivo `.env` na raiz:

```text
VITE_API_URL=http://localhost:8080/api
```

Se não for definida, esse mesmo valor é usado por padrão.

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`.

### Build de produção

```bash
npm run build
npm run preview
```

---

## 10. Fluxo recomendado para testar

1. Inicie o backend e o frontend.
2. Acesse `/` e clique em **Acessar aplicação**.
3. Em **Categorias**, crie uma categoria (ex.: "Plantas de Interior").
4. Em **Plantas**, clique em **Nova planta** e cadastre uma, com uma data de última rega.
5. Volte ao **Início** e veja os totais. Para testar atraso, cadastre uma planta com última rega antiga e frequência curta.
6. Clique em **Reguei** e observe a planta sair da lista de atrasadas.
7. Tente excluir uma categoria que possui plantas e veja o aviso.

---

## 11. Possíveis melhorias futuras

- React Query para cache e revalidação de dados;
- paginação e ordenação na listagem;
- calendário de regas;
- testes de componentes (Vitest + Testing Library);
- tema escuro;
- upload real de imagens;
- autenticação e plantas por usuário (depende de evolução do backend).

---

## 12. Conclusão

O frontend do **PlantCare** demonstra uma aplicação React organizada em camadas, com tipagem forte, comunicação isolada em services, identidade visual consistente por design tokens e tratamento cuidadoso de erros e estados de interface, integrada a uma API REST com regras de negócio no backend.