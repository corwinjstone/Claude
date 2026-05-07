export type Provider = 'google' | 'outlook' | 'apple';

export interface ConnectionStatus {
  google: boolean;
  outlook: boolean;
  apple: boolean;
}

export interface CalendarEntry {
  provider: Provider;
  id: string;
  name: string;
  color?: string;
}

export interface BusySlot {
  start: string;
  end: string;
}

export interface AvailabilityResult {
  self: BusySlot[];
  guests: Record<string, BusySlot[]>;
}

export interface EventDraft {
  title: string;
  description: string;
  start: string;
  end: string;
  attendees: string[];
  provider: Provider | '';
  calendarId: string;
}
