import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, LayoutDashboard, Search, Tags } from 'lucide-react';
import { Logo } from '../components/Logo';
import { btnPrimary } from '../utils/ui';

const features = [
  { icon: <LayoutDashboard size={18} />, title: 'Painel', text: 'Totais e listas de plantas para regar hoje e atrasadas.' },
  { icon: <Droplets size={18} />, title: 'Controle de rega', text: 'Próxima rega e status calculados automaticamente pelo backend.' },
  { icon: <Search size={18} />, title: 'Busca e filtro', text: 'Pesquisa por nome combinada com filtro por categoria.' },
  { icon: <Tags size={18} />, title: 'Categorias', text: 'CRUD completo, com bloqueio de exclusão quando há plantas.' },
];

const stack = [
  { name: 'React + TypeScript', role: 'Interface em componentes, com tipagem alinhada aos DTOs da API.' },
  { name: 'Tailwind CSS v4', role: 'Estilização utilitária com design tokens definidos em @theme.' },
  { name: 'React Router', role: 'Rotas aninhadas com layout compartilhado (Outlet).' },
  { name: 'Axios', role: 'Cliente HTTP único, com baseURL e tratamento de erro centralizados.' },
  { name: 'Lucide React', role: 'Ícones SVG leves, importados um a um.' },
  { name: 'React Hot Toast', role: 'Feedback de sucesso e erro sem bloquear a tela.' },
  { name: 'Vite', role: 'Servidor de desenvolvimento e build.' },
];

const patterns = [
  { title: 'Camada de serviços', text: 'As páginas não conhecem URLs nem axios. Toda chamada HTTP fica em services/, e a UI só consome funções como plantService.list().' },
  { title: 'Tipos espelhando o backend', text: 'Plant, Category e Dashboard seguem os DTOs da API. PlantRequest é derivado de Plant com Omit, sem duplicar campos.' },
  { title: 'Regras de negócio no backend', text: 'O front não calcula a próxima rega nem o status. Ele só exibe nextWatering e wateringStatus, mantendo uma única fonte de verdade.' },
  { title: 'Design tokens', text: 'As cores da marca vivem no @theme do Tailwind e viram classes como bg-primary-button e text-titles, sem hex solto nos componentes.' },
  { title: 'Composição de componentes', text: 'Peças pequenas e reutilizáveis (Modal, ConfirmModal, StatusBadge, StatCard) montam as telas. O mesmo PlantForm cria e edita.' },
  { title: 'Rotas aninhadas', text: 'O Center renderiza a navbar e um Outlet. Dashboard, Plantas e Categorias são rotas filhas, sem repetir o layout.' },
  { title: 'Estado local, sem biblioteca global', text: 'Com duas entidades e telas independentes, useState, useEffect e useCallback bastam. Cada tela recarrega seus dados após uma mutação.' },
  { title: 'Busca com debounce', text: 'A pesquisa por nome espera 300 ms de pausa na digitação antes de chamar a API, evitando requisições a cada tecla.' },
  { title: 'Erros e estados vazios tratados', text: 'A mensagem do ApiError do backend vira toast. Há estados de carregamento, listas vazias e confirmação antes de excluir.' },
  { title: 'Datas locais', text: 'A data de hoje é gerada no fuso local, e não em UTC, para não enviar "amanhã" à noite e ser recusada pelo @PastOrPresent.' },
  { title: 'Acessibilidade básica', text: 'Modais com role="dialog" e fechamento por Esc, botões de ícone com aria-label e foco visível nos campos.' },
  { title: 'Responsivo e configurável', text: 'Layout mobile-first com breakpoints do Tailwind. A URL da API vem de VITE_API_URL.' },
];

const tree = `src/
├── components/   Navbar, Modal, PlantCard, PlantForm, StatCard...
├── pages/        Introduction, Center, Dashboard, Plants, Categories
├── services/     api.ts, plantService.ts, categoryService.ts
├── types/        interfaces espelhando os DTOs
├── utils/        datas, status da rega, classes de UI
├── Routes.tsx    definição das rotas
└── App.tsx       rotas + Toaster`;

const flow = ['Página', 'Service', 'Axios', 'API Spring Boot'];

const Heading = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-4 text-xl font-bold text-titles">{children}</h2>
);

export const Introduction = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <header className="border-b border-bordas">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Logo size={120} />
        <Link to="/center" className={btnPrimary}>
          Acessar aplicação <ArrowRight size={16} />
        </Link>
      </div>
    </header>

    <main className="mx-auto max-w-5xl space-y-14 px-4 py-12">
      <section className="max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-titles sm:text-4xl">
          Cuide das suas plantas sem esquecer nenhuma rega
        </h1>
        <p className="text-gray-600">
          O PlantCare é uma aplicação para cadastrar plantas, organizá-las por categoria e acompanhar
          quando cada uma precisa de água. Este projeto foi desenvolvido como um desafio de front-end
          com CRUD de duas entidades (plantas e categorias), consumindo uma API REST em Java com Spring Boot.
        </p>
        <Link to="/center" className={`${btnPrimary} px-5 py-2.5 text-base`}>
          Acessar aplicação <ArrowRight size={18} />
        </Link>
      </section>

      <section>
        <Heading>O que a aplicação faz</Heading>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-bordas bg-primary-background p-4">
              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-secundary-background text-primary-button">
                {f.icon}
              </span>
              <h3 className="font-bold text-titles">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Heading>Tecnologias do front-end</Heading>
        <ul className="grid gap-3 sm:grid-cols-2">
          {stack.map((s) => (
            <li key={s.name} className="rounded-xl border border-bordas p-4">
              <p className="font-bold text-primary-button">{s.name}</p>
              <p className="mt-1 text-sm text-gray-600">{s.role}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-gray-600">
          Não foi usada biblioteca de componentes (MUI, Chakra) nem de estado global: o escopo é enxuto e
          o Tailwind com a paleta própria da marca resolve a interface com menos dependências.
        </p>
      </section>

      <section>
        <Heading>Estratégias e padrões adotados</Heading>
        <div className="grid gap-3 md:grid-cols-2">
          {patterns.map((p) => (
            <div key={p.title} className="rounded-xl border border-bordas bg-white p-4">
              <h3 className="font-bold text-titles">{p.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div>
          <Heading>Organização do código</Heading>
          <pre className="overflow-x-auto rounded-xl border border-bordas bg-primary-background p-4 text-xs leading-relaxed text-titles">
            {tree}
          </pre>
        </div>
        <div>
          <Heading>Fluxo de dados</Heading>
          <ol className="flex flex-wrap items-center gap-2 text-sm">
            {flow.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-lg bg-secundary-background px-3 py-1.5 font-semibold text-titles">{step}</span>
                {i < flow.length - 1 && <ArrowRight size={14} className="text-details" />}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-gray-600">
            A página dispara uma ação, o service monta a requisição, o Axios envia para o backend e a
            resposta tipada volta para atualizar a tela.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-primary-background p-8 text-center">
        <h2 className="text-xl font-bold text-titles">Pronto para ver funcionando?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          Entre na aplicação, cadastre uma categoria e sua primeira planta.
        </p>
        <Link to="/center" className={`${btnPrimary} mt-5 px-5 py-2.5 text-base`}>
          Acessar aplicação <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  </div>
);