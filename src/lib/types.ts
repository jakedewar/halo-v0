export enum MESSAGE_TYPES {
  GENERAL_SETTINGS_UPDATED = 'GENERAL_SETTINGS_UPDATED',
  OPEN_OPTIONS = 'OPEN_OPTIONS',
  TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
}

export type Theme = 'dark' | 'light';

export interface Message {
  type: MESSAGE_TYPES;
  data?: unknown;
}

export const GENERAL_SETTINGS_KEY = 'generalSettings';

export interface GeneralSettings {
  theme: Theme;
  hide_sidebar_button: boolean;
}

export interface Note {
  id: string;
  content: string;
  url: string | null | undefined;
  orbit?: string;
  scope?: 'url' | 'global';
  createdAt: number;
}

export interface Task {
  id: string;
  content: string;
  completed: boolean;
  url: string | null | undefined;
  orbit?: string;
  scope?: 'url' | 'global';
  createdAt: number;
  dueDate?: number;  // Timestamp in milliseconds
}
