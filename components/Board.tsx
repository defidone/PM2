'use client';

import React, { useMemo } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Card, List } from '../lib/models';
import Column from './Column';
import SimpleCard from './SimpleCard';

interface BoardProps {
  lists: List[];
  cards: Card[];
  onMove: (cardId: string, destinationListId: string) => void;
}

export default function Board({ lists, cards, onMove }: BoardProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const cardsByList = useMemo(() => {
    return lists.reduce<Record<string, Card[]>>((acc, list) => {
      acc[list.id] = cards.filter((card) => card.listId === list.id);
      return acc;
    }, {});
  }, [lists, cards]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && typeof over.id === 'string') {
      onMove(String(active.id), String(over.id));
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="column-grid">
        {lists.map((list) => (
          <SortableContext
            key={list.id}
            id={list.id}
            items={cardsByList[list.id].map((card) => card.id)}
            strategy={verticalListSortingStrategy}
          >
            <Column list={list} cards={cardsByList[list.id]} />
          </SortableContext>
        ))}
      </div>
      <DragOverlay>{null}</DragOverlay>
    </DndContext>
  );
}
