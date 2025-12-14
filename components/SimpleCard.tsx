'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../lib/models';

interface Props {
  card: Card;
}

export default function SimpleCard({ card }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} className="card" {...attributes} {...listeners}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-semibold">{card.title}</div>
          <div className="text-xs text-slate-500">{card.owner ?? 'Unassigned'}</div>
        </div>
        <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">{card.priority}</span>
      </div>
      {card.dueDate && <div className="text-xs text-slate-500">Due {card.dueDate}</div>}
      <div className="flex gap-1 flex-wrap mt-1 text-[11px]">
        {card.epic && <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded">{card.epic}</span>}
        {card.workstream && <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded">{card.workstream}</span>}
      </div>
    </div>
  );
}
