export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type Impact = 'Low' | 'Med' | 'High';
export type Effort = 'S' | 'M' | 'L' | '1' | '2' | '3' | '4' | '5';
export type Status = 'Open' | 'InProgress' | 'Blocked' | 'Done';

export interface List {
  id: string;
  name: string;
  wipLimit?: number;
}

export interface Card {
  id: string;
  title: string;
  listId: string;
  description?: string;
  labels?: string[];
  owner?: string;
  status: Status;
  priority: Priority;
  impact: Impact;
  effort: Effort;
  dueDate?: string;
  dependencies?: string[];
  epic?: string;
  workstream?: string;
  milestone?: string;
  tags?: string[];
}

export interface TimeBlock {
  id: string;
  index: number;
  cardId?: string;
  reserved?: boolean;
}

export interface BoardTemplate {
  name: string;
  lists: List[];
}

export const defaultBoardTemplate: BoardTemplate = {
  name: 'AUX Default',
  lists: [
    { id: 'inbox', name: 'Inbox' },
    { id: 'ready', name: 'Ready' },
    { id: 'today', name: 'Today', wipLimit: 12 },
    { id: 'doing', name: 'Doing', wipLimit: 2 },
    { id: 'blocked', name: 'Blocked' },
    { id: 'done', name: 'Done (This Week)' },
    { id: 'later', name: 'Later' }
  ]
};

export interface DailyPlanConfig {
  blocksPerDay: number;
  bufferBlocks: number;
}
