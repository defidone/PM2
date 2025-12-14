# PM Webapp (Trello + PMO + Time Blocks) – Product Requirements

## Ziel & Kontext
Eine leichte, aber strukturierte PM-Webapp für AUX Immo (Sales/Marketing/Ops). Fokus auf schnelles Daily-Shipment, Kanban-Board plus PMO-Artefakte, Time-Block-Dailies und CSV-Import/Export (aus ChatGPT/Chats).

## Nutzer & Use Cases
- Projektleiter (Dennis) steuert Workstreams, Backlog, Roadmap, Risiken/Entscheidungen.
- Teammitglieder ziehen Karten durch Kanban, pflegen Logs und Blocker.
- Review/Reporting: Tagesplan, Weekly Review, Statusberichte, Export in Chat.

## MVP-Scope
1. **Kanban Core**: Boards, Listen (Inbox, Ready, Today, Doing, Blocked, Done (This Week), Later), Cards mit Feldern (Titel, Beschreibung, Labels/Tags, Owner, Status, Priorität, Impact, Effort, Due Date, Dependencies, Epic, Workstream, Milestone, Links) und Activity Log. Drag & Drop, WIP-Limits je Liste (Warnung).
2. **Daily Planning mit Time Blocks**: Konfiguration von Blöcken/Tag (z. B. 12–16), Zuordnung 1 Card = 1 Block, Pufferblöcke, Vorschlag zum Splitten großer Karten.
3. **PMO-Artefakte**: Projekt-Canvas, Workstreams/WBS (hierarchisch), Backlog-View (Epic→Feature→Task), Milestones/Roadmap, RACI, Risiko/Issue/Decision/Change-Logs, Definition of Done (global + pro Deliverable). Referenzierbar in Cards.
4. **CSV-Import/Export**: Standardformat, Validierung, automatisches Anlegen von Epics/Workstreams/Milestones, Export aller Cards und Today-Plan (CSV/Markdown).
5. **Auth & Security (MVP)**: Magic-Link oder Passwort-Login, CSRF-Schutz (NextAuth), Rate-Limits auf API-Routen, DSGVO-Basics (Export/Delete, minimale PII: Name, E-Mail, optional API-Key für Assistant).
6. **Assistant (opt-in)**: Lokales Panel, nutzt freigegebene Daten, Aktionen wie Tagesplan erstellen, Risiken identifizieren, Weekly Review, Roadmap-Update. API-Key in Settings.

## Nicht-Funktionale Anforderungen
- **Performance**: Snappy UI, Client-Caching, serverseitiges Paging/Filters für große Backlogs.
- **Security/DSGVO**: TLS (terminiert im Reverse Proxy), minimale Datenspeicherung, Export/Delete-Routinen, keine Third-Party-Tracker, API-Key verschlüsselt gespeichert.
- **Deploy**: Docker Compose (web + Postgres), env-Driven Config.

## Informationsarchitektur & Haupt-Flows
- **Dashboard/Board**: Board-Selector, Kanban-Lanes (Standardlisten), Drag & Drop, WIP-Badges, Card-Drawer.
- **Daily Planner**: Oben Auswahl „Heute: n Blöcke“ + Puffer. Grid Block 1–n mit zugeordneten Cards, Warnung bei zu großen Karten.
- **Backlog/Hierarchy**: Filterbare Tabelle nach Epic/Feature/Task, Workstream, Status, Priorität.
- **PMO Views**: Canvas (Formular/Display), WBS Tree, Roadmap Timeline, RACI Matrix, Logs (Risiken/Issues/Decisions/Changes), Definition of Done Editor.
- **Import/Export**: Upload/Paste CSV, Mapping-Preview, Validierung, Ergebnisreport; Export-Dialog (CSV/Markdown, Filter Today vs All).
- **Assistant**: Panel mit Buttons, Chat-Historie (lokal), nur mit gespeicherten API-Key aktivierbar.

### Textuelle Wireframes
- **Board**: [Header: Project selector | Add Board Template] [Buttons: Import CSV, Export, Assistant]. Lanes with columns (Inbox, Ready, Today, Doing, Blocked, Done (This Week), Later). Cards show Title, Owner, Priority pill, Due, Epic/Workstream chip. WIP badge on column header.
- **Daily Planner**: [Blocks selector dropdown] [Puffer count]. Grid rows: Block 1 … Block n with Card chip slot. Warning label if empty/over-size.
- **PMO Drawer**: Tabs: Canvas | WBS | Milestones | RACI | Risks | Issues | Decisions | Changes | DoD. Each tab shows minimal table/form.
- **Import Modal**: Textarea (paste CSV) + file upload, column map dropdowns, validation list, preview table, CTA “Create Items”.
- **Export Modal**: Filters (All/Today/Board), format (CSV/Markdown), download/copy buttons.
- **Assistant Panel**: Input textarea, quick actions buttons, response area with citations to cards.

## Datenmodell (Textuelles ERD)
- **User** (id, name, email, role, auth_provider, created_at)
- **Board** (id, name, owner_user_id, created_at)
- **List** (id, board_id, name, wip_limit)
- **Card** (id, board_id, list_id, title, description, status, priority, impact, effort, due_date, owner_user_id, epic_id, workstream_id, milestone_id, dependencies [Card[]], tags[], created_at, updated_at)
- **ActivityLog** (id, card_id, user_id, action, payload, created_at)
- **Epic** (id, board_id, title, description)
- **Workstream** (id, board_id, title, parent_id?)
- **Milestone** (id, board_id, title, due_date, status)
- **RaciEntry** (id, work_item_type, work_item_id, role, user_id)
- **Risk/Issue/Decision/Change** (id, type, board_id, title, description, status, owner_user_id, impact, probability, due_date, created_at)
- **DefinitionOfDone** (id, scope_type [global/deliverable], scope_id, criteria[])
- **TimeBlock** (id, user_id, date, index, card_id, reserved:boolean)
- **Setting** (id, user_id, key, value) – e.g., API-Key for Assistant.

Beziehungen: User 1:n Boards; Board 1:n Lists/Epics/Workstreams/Milestones/Risks/Issues/Decisions/Changes; List 1:n Cards; Card n:n Cards via Dependencies; Card 1:n ActivityLogs; Card 1:n TimeBlocks; Workstream hierarchisch via parent_id.

## CSV-Import/Export-Spezifikation
- **Pflichtspalten**: `title`, `list`, `priority`, `impact`, `effort`, `owner`, `status` (plus optional `card_id` für Referenzen).
- **Optionale Spalten**: `description`, `workstream`, `epic`, `milestone`, `dependencies`, `due_date`, `tags`, `created_at`, `updated_at`, `impact`, `effort`.
- **Defaults**: fehlender `card_id` → generierte UUID; `list` → `Ready`; `priority` → `P2`; `impact` → `Med`; `effort` → `M`; `status` → `Open`; `owner` → „Unassigned“; `due_date` leer erlaubt; `created_at/updated_at` → Importzeit.
- **Validierung**: list muss eine der Standardlisten oder bestehender List-Name sein; priority ∈ {P0,P1,P2,P3}; impact ∈ {Low,Med,High}; effort ∈ {S,M,L,1,2,3,4,5}; status ∈ {Open,InProgress,Blocked,Done}; due_date ISO 8601 (YYYY-MM-DD); dependencies/card refs müssen existieren oder im gleichen CSV definiert sein; Tags/Dependencies sind comma-separated, trimmed.
- **Fehlerfälle**: fehlende Pflichtspalten → Abbruch; ungültige Enum-Werte → Zeilenfehler; ungültiges Datum → Zeilenfehler; referenzierte card_id unbekannt → Warnung oder Abbruch je nach Einstellung.
- **Export**: gleiche Spaltenreihenfolge; Today-Plan-Export filtert Cards der Liste „Today“ + TimeBlock-Index; Markdown-Export als Tabelle.

### Beispiel-CSV (12 Zeilen)
```
card_id,title,list,priority,impact,effort,owner,status,description,workstream,epic,milestone,due_date,tags,dependencies
,Set up CRM pipeline,Ready,P1,High,M,Dennis,Open,Define stages and owners,Sales Enablement,CRM Rollout,M1-Init,2024-01-10,"crm,process", 
,Import lead list,Inbox,P2,Med,S,Alex,Open,Load 500 leads,Sales Enablement,CRM Rollout,M1-Init,2024-01-12,"data,leads", 
CARD-3,Design landing page,Ready,P1,High,L,Julia,InProgress,First iteration,Marketing,Growth Launch,M2-Launch,2024-01-15,"web,design", 
,Copywriting iteration,Today,P2,Med,M,Julia,Open,Rewrite hero + CTA,Marketing,Growth Launch,M2-Launch,2024-01-16,"copy",CARD-3
,Ads experiment A,Today,P0,High,S,Tom,Open,Run Google Ads A/B,Marketing,Growth Launch,M2-Launch,2024-01-16,"ads",CARD-3
,Ops playbook draft,Doing,P2,Med,M,Chris,InProgress,Outline SOPs,Operations,Ops Excellence,M3-Scale,2024-01-20,"ops,doc", 
,Vendor shortlist,Inbox,P3,Low,S,Sara,Open,Collect 3 vendors,Operations,Ops Excellence,M3-Scale,,"vendor", 
,Finance risk review,Ready,P1,High,M,Dennis,Open,Assess cashflow risk,Finance,Risk Mgmt,M0-Prep,2024-01-08,"risk", 
,Data quality audit,Blocked,P2,High,L,Alex,Blocked,Awaiting access,Data,Risk Mgmt,M0-Prep,2024-01-09,"data", 
,Weekly summary,Later,P3,Low,S,Dennis,Open,Compile highlights,PMO,Governance,M4-Review,2024-01-19,"report", 
,Team retrospective,Ready,P2,Med,M,Dennis,Open,Retro for sprint,PMO,Governance,M4-Review,2024-01-19,"retro",ADS-123
```

## API-Design (MVP)
- `POST /api/auth/magic-link` – send login link; `POST /api/auth/verify` – verify token.
- `GET /api/boards` – list boards (auth required); `POST /api/boards` – create board.
- `GET /api/boards/:boardId` – board detail + lists; `PATCH /api/boards/:boardId` – update board metadata.
- `POST /api/boards/:boardId/lists` – create/update lists (WIP limit).
- `POST /api/boards/:boardId/cards` – create card; `PATCH /api/cards/:id` – update card; `POST /api/cards/reorder` – drag/drop reorder.
- `GET /api/cards/:id/activity` – activity log; `POST /api/cards/:id/comment` – add activity/comment.
- `GET /api/backlog` – filterable backlog view.
- `POST /api/import` – CSV ingest + validation; `GET /api/export` – export all cards; `GET /api/export/today` – export today plan (CSV/Markdown param `format`).
- `GET/POST /api/pmo/*` – Canvas, Workstreams, Epics, Milestones, RACI, Risks/Issues/Decisions/Changes, DoD.
- `POST /api/assistant/plan` – generate plan (requires user-provided API key stored in settings).

## Auth-Konzept
- Magic-Link Login via email; NextAuth credentials provider fallback (password). Sessions via secure HTTP-only cookies, CSRF tokens on POST. Rate limit magic-link requests. Optional 2FA future.

## Technische Architektur
- **Frontend**: Next.js (App Router) + TypeScript, Tailwind/shadcn optional, dnd-kit für Drag & Drop, SWR/React Query für Datenfetch.
- **Backend**: Next.js API Routes; Validation mit zod; CSV-Parsing mit Papaparse on client oder `csv-parse` on server.
- **DB**: Postgres via Prisma (schema folgt), SQLite für lokale Dev möglich.
- **Deployment**: Docker Compose (web + postgres); ENV für DB_URL, NEXTAUTH_SECRET, EMAIL_PROVIDER, OPENAI_API_KEY.
- **Security**: Helmet-ähnliche Headers via middleware, rate limiting middleware (e.g., upstash/redis optional, fallback in-memory for MVP).

## MVP-UI Komponentenliste
- Board shell (columns, card component, column header mit WIP), DragHandle.
- Card Drawer (details, fields, comments/activity).
- Time Block Grid (block tiles, add/split card modal).
- PMO panels (canvas form, WBS tree list, milestone timeline, log tables, RACI grid, DoD editor).
- Import/Export modals, Assistant panel, Settings/API-key form, Auth screens.

## Deployment & Betrieb
- `docker-compose.yml` startet `web` (Next) + `db` (Postgres).
- Migrations via Prisma after container start.
- Env defaults in `.env.example` (DB_URL, NEXTAUTH_SECRET, EMAIL_FROM, SMTP config, OPENAI_API_KEY optional).

## Risiken & Offene Punkte
- E-Mail-Provider für Magic-Link muss konfiguriert werden.
- Drag & Drop Performance bei großen Boards → virtuelle Listen ggf. später.
- Datenschutz bei Assistant: API-Key nur clientseitig genutzt, serverseitig verschlüsselt speichern.
