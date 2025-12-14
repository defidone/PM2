'use client';

import React from 'react';
import { Card, DailyPlanConfig, TimeBlock } from '../lib/models';

interface Props {
  cards: Card[];
  config: DailyPlanConfig;
  blocks: TimeBlock[];
}

export default function DailyPlanner({ cards, config, blocks }: Props) {
  const byIndex = blocks.reduce<Record<number, TimeBlock>>((acc, block) => {
    acc[block.index] = block;
    return acc;
  }, {});

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Daily Planning</p>
          <h2 className="text-lg font-semibold">{config.blocksPerDay} Blocks</h2>
        </div>
        <div className="text-sm text-slate-600">Buffer: {config.bufferBlocks}</div>
      </header>
      <div className="grid md:grid-cols-3 gap-2">
        {Array.from({ length: config.blocksPerDay }).map((_, idx) => {
          const block = byIndex[idx + 1];
          const card = cards.find((c) => c.id === block?.cardId);
          return (
            <div
              key={idx}
              className={`border rounded-md p-2 text-sm ${card ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">Block {idx + 1}</span>
                {block?.reserved && <span className="text-[11px] text-slate-500">Reserved</span>}
              </div>
              {card ? (
                <div className="mt-1">
                  <div className="font-medium">{card.title}</div>
                  <div className="text-xs text-slate-500">{card.owner ?? 'Unassigned'}</div>
                </div>
              ) : (
                <div className="text-xs text-slate-500">Assign a Ready/Today card</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
