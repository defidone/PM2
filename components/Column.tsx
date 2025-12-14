'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { List, Card } from '../lib/models';
import SimpleCard from './SimpleCard';

interface ColumnProps {
  list: List;
  cards: Card[];
}

export default function Column({ list, cards }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: list.id });
  const overLimit = list.wipLimit !== undefined && cards.length > list.wipLimit;

  return (
    <div ref={setNodeRef} className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm">{list.name}</div>
        {list.wipLimit && (
          <span className={`text-xs px-2 py-1 rounded ${overLimit ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
            WIP {cards.length}/{list.wipLimit}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {cards.map((card) => (
          <SimpleCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
