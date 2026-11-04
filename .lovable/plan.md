# CleanFlow UK — Análise do protótipo (sem alterações)

## 0. Ponto crítico encontrado
- O projeto Lovable atual está **vazio** (só o template inicial: página `/` é um placeholder, sem componentes, sem banco).
- Todo o CleanFlow UK existe apenas no arquivo enviado `Versao-Dono_00.html`: um **build compilado** de um único componente React (`pa()`), Tailwind já processado, ícones Lucide embutidos. Não há código-fonte editável, rotas reais nem backend.
- O arquivo é só a **versão do Dono (Admin)**. Não existe app do Cleaner/Supervisor — só referências ("cleaners submit checklists via mobile").
- Consequência: "não reconstruir do zero" na prática significa **portar** o protótipo para o projeto, tela por tela, mantendo exatamente o mesmo visual (cores, Inter, cards, raio 12px, sombras). Nenhuma biblioteca nova é necessária além do que o template já tem (React, Tailwind, Lucide, shadcn).

## 1. Estrutura atual de páginas (abas internas, sem URL)
Navegação por `useState("overview")` numa sidebar fixa de 260px:

```text
OPERATIONS : Overview, Scheduling, Check-in
CRM        : Customers, Employees, Cleaning Plans, Client Portal
COMPLIANCE : Safety & Compliance, Reports
FINANCE    : Wages, Invoicing, Payments
RESOURCES  : Keys, Materials & Replenishment
ADMIN      : Company Structure, Send Message, Work Hours, Event Log, Settings
```
Extras: seletor de idioma (10 idiomas, nenhum implementado), planos Starter/Growth/Scale com bloqueio de módulos, toasts de 3s, um modal.

## 2. Componentes reutilizáveis (a extrair)
- AppShell: Sidebar agrupada + Topbar (busca, idioma, perfil "admin@cleanflow.uk", logout) + drawer mobile.
- StatCard / KPI card (Overview, Company Snapshot).
- SectionCard com header e abas em pílulas (Daily tasks / Photo documentation / Check-ins / Active alarms / NFC).
- DataTable com filtros, "Sort by", "Select all" (Customers, Employees, Storage, Wages, Reports).
- StatusBadge / PriorityBadge (cores emerald / amber / red / primary).
- Avatar de iniciais; linha de check-in (nome, local, hora, GPS).
- Kanban de tarefas (To do / In progress / Done) do Scheduling.
- EmptyState ("No completed reports in this period").
- Modal, Toast, FilterChecklist (excluded, periodic, overtime…), PlanGate (bloqueio por plano).
- Tokens visuais: `--bg #F8FAFC`, `--primary #2563EB`, emerald/amber/red + versões "soft", radius 12px → serão mapeados para os tokens do `styles.css`.

## 3. Dados fictícios e estado local a substituir
- Customers (5: Kaufman/Bazar, Whitmore & Sons, Royal Kensington Clinic…).
- Employees (4: Aisha Khan, David Okafor, Elena Ruiz, Thomas Clarke).
- Jobs/tarefas (9, status todo/progress, prioridade, horas).
- Inventário (7 produtos com mínimo/quantidade).
- Check-ins do dia (5 com GPS hardcoded), tipos de limpeza (10).
- Textos fixos: data "Monday 2/11/2026 • Week 45", valores £, receita 7 dias.
- Estados locais: aba ativa, plano, idioma, filtros, abas de cada tela, modal, busca de estoque.

## 4. Funcionalidades apenas simuladas
Tudo que tem botão só dispara um toast: Add customer/employee, New shift, Start check-in, Export report, Download template, Save structure/settings, Product request, Open map ("Mapbox integration"), suporte, idioma, troca de plano.
GPS, fotos, NFC, QR, checklists, alarmes, mapa ao vivo: apenas visual.
Payments/Stripe/PayPal/QR, Wages "Pay team £312", Invoicing: simulados e **fora de escopo** (regras: sem pagamentos, salários, contabilidade).

## 5. Admin vs Funcionário hoje
- Admin: existe completo (desktop, sidebar, tabelas).
- Funcionário/Cleaner: **não existe**. Só aparece como dado (lista de check-ins, tarefas atribuídas). Não há login, nem visão "meus serviços", nem envio de prova.
- Supervisor: aparece só como cargo (David Okafor), sem permissões próprias.

## 6. Arquitetura proposta (perfis)
```text
/login
/admin/*        (desktop-first, AppShell atual)
   overview, scheduling, checkin, customers, employees, plans,
   client-portal, safety, reports, keys, storage, structure,
   messages, workhours, eventlog, settings
/supervisor/*   (mesmo AppShell, menu reduzido)
   overview da equipe, scheduling, check-ins, reports (aprovar), alerts
/cleaner/*      (mobile-first, bottom nav, botões grandes)
   today (jobs do dia) -> job/:id (check-in, checklist, fotos antes/depois,
   observações, check-out) -> history, profile
```
- Permissões: Admin = tudo; Supervisor = equipe/sites atribuídos, aprova relatórios, sem configurações da empresa; Cleaner = só os próprios jobs e envio de comprovação.
- "Comprovação de serviço" = Report por job (horário check-in/out, GPS, checklist, fotos), visível para Admin/Supervisor e no Client Portal.
- Nesta fase (sem banco): camada `src/lib/data` com os mocks atuais + seletor de perfil de demonstração; depois troca por Lovable Cloud sem mexer nas telas.
- Módulos Wages/Invoicing/Payments: ocultados do menu (preservados para o futuro, não implementados).
- Todo texto da interface em inglês (UK).

## 7. Arquivos a alterar / criar
Alterar:
- `src/styles.css` — tokens de cor/raio/sombra do protótipo, fonte Inter.
- `src/routes/__root.tsx` — link da fonte, metadados CleanFlow, Toaster.
- `src/routes/index.tsx` — remover placeholder, redirecionar para login/perfil.
- `AGENTS.md` — regras de estrutura (perfis, camada de dados).

Criar:
- `src/components/layout/` AppShell, Sidebar, Topbar, MobileShell, BottomNav.
- `src/components/cf/` StatCard, SectionCard, PillTabs, DataTable, StatusBadge, Avatar, CheckinRow, TaskBoard, EmptyState, FilterChecklist, PlanGate.
- `src/lib/data/` mocks (customers, employees, jobs, inventory, checkins) + tipos; `src/lib/roles.ts` (perfis e permissões).
- `src/routes/login.tsx`, `src/routes/admin.*.tsx` (uma por tela), `src/routes/supervisor.*.tsx`, `src/routes/cleaner.*.tsx`.

## 8. Responsividade
- Cleaner: layout de smartphone (coluna única, bottom nav, alvos de toque grandes, câmera/fotos).
- Admin/Supervisor: desktop (sidebar fixa, tabelas densas), com drawer em telas pequenas como no protótipo.

## Próximo passo
Aguardar sua instrução. Sugestão de primeira etapa: portar o AppShell + tokens visuais + Overview do Admin, idênticos ao protótipo.
