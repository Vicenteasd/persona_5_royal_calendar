import { Injectable, signal, computed } from '@angular/core';
import { CALENDAR_DATA } from './calendar-data';

export interface DayEntry {
  date: string; // ISO Date string YYYY-MM-DD
  daytime: string;
  nighttime: string;
  notes: string;
  imageDay: string;
  imageNight: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Hardcoded range based on prompt: Sat April 9 (2022) - Feb 3 (2023)
  readonly START_DATE = new Date(2022, 3, 9); 
  readonly END_DATE = new Date(2023, 1, 3);   

  // Public signal for consumers
  readonly entriesMap = signal<Map<string, DayEntry>>(new Map());

  // JSON Data representation (Array format)
  readonly entriesJson = computed(() => {
    const values = Array.from(this.entriesMap().values());
    // Sort by date for consistent array output
    values.sort((a, b) => a.date.localeCompare(b.date));
    return JSON.stringify(values, null, 2);
  });

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    // Import the data from our TS constant
    const initialData2 = CALENDAR_DATA;

    const newMap = new Map<string, DayEntry>();
    for (const entry of initialData2) {
      newMap.set(entry.date, entry);
    }
    this.entriesMap.set(newMap);
  }

  getEntry(dateIso: string): DayEntry {
    return this.entriesMap().get(dateIso) || {
      date: dateIso,
      daytime: '',
      nighttime: '',
      notes: '',
      imageDay: 'https://ui-avatars.com/api/?name=D&background=e5e7eb&color=9ca3af&rounded=true&bold=true',
      imageNight: 'https://ui-avatars.com/api/?name=N&background=374151&color=9ca3af&rounded=true&bold=true'
    };
  }

  saveEntry(entry: DayEntry) {
    this.entriesMap.update(map => {
      const newMap = new Map(map);
      newMap.set(entry.date, entry);
      return newMap;
    });
  }

  isDateInRange(d: Date): boolean {
    const check = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const start = new Date(this.START_DATE.getFullYear(), this.START_DATE.getMonth(), this.START_DATE.getDate());
    const end = new Date(this.END_DATE.getFullYear(), this.END_DATE.getMonth(), this.END_DATE.getDate());
    return check.getTime() >= start.getTime() && check.getTime() <= end.getTime();
  }
}