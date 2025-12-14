import { Card, Impact, Effort, Priority, Status } from './models';

export type CsvRow = Partial<Card> & {
  card_id?: string;
  title: string;
  list: string;
  priority: Priority;
  impact: Impact;
  effort: Effort;
  owner: string;
  status: Status;
  description?: string;
  workstream?: string;
  epic?: string;
  milestone?: string;
  dependencies?: string;
  due_date?: string;
  tags?: string;
  created_at?: string;
  updated_at?: string;
};

export interface CsvImportResult {
  cards: Card[];
  errors: string[];
  warnings: string[];
}

const priorityValues: Priority[] = ['P0', 'P1', 'P2', 'P3'];
const impactValues: Impact[] = ['Low', 'Med', 'High'];
const effortValues: Effort[] = ['S', 'M', 'L', '1', '2', '3', '4', '5'];
const statusValues: Status[] = ['Open', 'InProgress', 'Blocked', 'Done'];

export function validateRow(row: CsvRow, index: number): string[] {
  const errors: string[] = [];
  if (!row.title) errors.push(`Row ${index}: title is required`);
  if (!row.list) errors.push(`Row ${index}: list is required`);
  if (!priorityValues.includes(row.priority)) errors.push(`Row ${index}: invalid priority`);
  if (!impactValues.includes(row.impact)) errors.push(`Row ${index}: invalid impact`);
  if (!effortValues.includes(row.effort)) errors.push(`Row ${index}: invalid effort`);
  if (!statusValues.includes(row.status)) errors.push(`Row ${index}: invalid status`);
  if (row.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.due_date)) errors.push(`Row ${index}: invalid due_date`);
  return errors;
}

export function csvRowToCard(row: CsvRow): Card {
  return {
    id: row.card_id || crypto.randomUUID(),
    title: row.title,
    listId: row.list,
    description: row.description,
    owner: row.owner,
    status: row.status,
    priority: row.priority,
    impact: row.impact,
    effort: row.effort,
    dueDate: row.due_date,
    dependencies: row.dependencies?.split(',').map((d) => d.trim()).filter(Boolean),
    epic: row.epic,
    workstream: row.workstream,
    milestone: row.milestone,
    tags: row.tags?.split(',').map((t) => t.trim()).filter(Boolean)
  };
}

export function importCsv(rows: CsvRow[]): CsvImportResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const cards: Card[] = rows.map((row, index) => {
    const rowErrors = validateRow(row, index + 1);
    if (rowErrors.length) errors.push(...rowErrors);
    return csvRowToCard({
      owner: 'Unassigned',
      priority: 'P2',
      impact: 'Med',
      effort: 'M',
      status: 'Open',
      list: 'Ready',
      ...row
    } as CsvRow);
  });

  return { cards, errors, warnings };
}

export function exportCardsToCsv(cards: Card[]): string {
  const header = 'card_id,title,list,priority,impact,effort,owner,status,description,workstream,epic,milestone,due_date,tags,dependencies';
  const rows = cards.map((card) => {
    const deps = card.dependencies?.join(' ') || '';
    const tags = card.tags?.join(' ') || '';
    return [
      card.id,
      escapeCsv(card.title),
      card.listId,
      card.priority,
      card.impact,
      card.effort,
      card.owner ?? '',
      card.status,
      escapeCsv(card.description ?? ''),
      card.workstream ?? '',
      card.epic ?? '',
      card.milestone ?? '',
      card.dueDate ?? '',
      escapeCsv(tags),
      escapeCsv(deps)
    ].join(',');
  });
  return [header, ...rows].join('\n');
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
