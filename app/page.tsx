import React, { useMemo, useState } from 'react';
import Board from '../components/Board';
import DailyPlanner from '../components/DailyPlanner';
import { defaultBoardTemplate, Card, TimeBlock, DailyPlanConfig } from '../lib/models';
import { importCsv, exportCardsToCsv } from '../lib/csv';

const initialCards: Card[] = [
  {
    id: '1',
    title: 'Set up CRM pipeline',
    listId: 'ready',
    status: 'Open',
    priority: 'P1',
    impact: 'High',
    effort: 'M',
    owner: 'Dennis',
    epic: 'CRM Rollout',
    workstream: 'Sales Enablement',
    milestone: 'M1-Init',
    dueDate: '2024-01-10'
  },
  {
    id: '2',
    title: 'Copywriting iteration',
    listId: 'today',
    status: 'Open',
    priority: 'P2',
    impact: 'Med',
    effort: 'M',
    owner: 'Julia',
    epic: 'Growth Launch',
    workstream: 'Marketing',
    milestone: 'M2-Launch',
    dueDate: '2024-01-16'
  },
  {
    id: '3',
    title: 'Ops playbook draft',
    listId: 'doing',
    status: 'InProgress',
    priority: 'P2',
    impact: 'Med',
    effort: 'M',
    owner: 'Chris',
    epic: 'Ops Excellence',
    workstream: 'Operations',
    milestone: 'M3-Scale',
    dueDate: '2024-01-20'
  }
];

const initialBlocks: TimeBlock[] = Array.from({ length: 12 }).map((_, idx) => ({
  id: `block-${idx + 1}`,
  index: idx + 1,
  cardId: idx === 0 ? '2' : undefined
}));

const planConfig: DailyPlanConfig = {
  blocksPerDay: 12,
  bufferBlocks: 2
};

export default function Home() {
  const [cards, setCards] = useState<Card[]>(initialCards);

  const handleMove = (cardId: string, destinationListId: string) => {
    setCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, listId: destinationListId } : card)));
  };

  const exportedCsv = useMemo(() => exportCardsToCsv(cards), [cards]);
  const validationExample = useMemo(() => importCsv([]), []);

  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Board</h2>
          <span className="text-xs text-slate-500">WIP limits active</span>
        </div>
        <Board lists={defaultBoardTemplate.lists} cards={cards} onMove={handleMove} />
      </section>
      <DailyPlanner cards={cards} config={planConfig} blocks={initialBlocks} />
      <section className="bg-white border border-slate-200 rounded-lg p-4">
        <h3 className="text-base font-semibold mb-2">Import/Export Skeleton</h3>
        <p className="text-sm text-slate-600">Use lib/csv.ts to validate and map CSV to cards. Server routes will call `importCsv` / `exportCardsToCsv`.</p>
        <div className="mt-2">
          <p className="text-xs text-slate-500 mb-1">Export preview</p>
          <pre className="bg-slate-50 border border-slate-200 rounded p-2 text-[11px] overflow-x-auto">{exportedCsv}</pre>
        </div>
        <p className="text-xs text-slate-500 mt-2">Validation placeholder: {validationExample.errors.length} errors captured.</p>
      </section>
    </main>
  );
}
