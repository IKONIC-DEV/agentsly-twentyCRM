type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

type Actor = {
  __typename: 'Actor';
  source: string;
  workspaceMemberId: string | null;
  name: string;
  context: Record<string, unknown>;
};

export type Lead = {
  __typename: 'Lead';
  id: string;
  name: string;
  position: number;
  chat: ChatMessage[];
  createdAt: string; // ISO 8601 format
  updatedAt: string;
  deletedAt: string | null;
  createdBy: Actor;
};
