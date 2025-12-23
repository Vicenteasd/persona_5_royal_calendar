import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, DayEntry } from './services/data.service';
import { TranslationService, LanguageCode } from './services/translation.service';
import { CalendarMonthComponent } from './components/calendar-month.component';
import { DayModalComponent } from './components/day-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CalendarMonthComponent, DayModalComponent],
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  // State for navigation
  // Default to start date: April 2022
  currentDate = signal(new Date(2022, 3, 9)); 

  // Modal State
  selectedEntry = signal<DayEntry | null>(null);
  isModalOpen = computed(() => this.selectedEntry() !== null);

  // Derived state for the view
  displayYear = computed(() => this.currentDate().getFullYear());
  displayMonth = computed(() => this.currentDate().getMonth());
  
  // Navigation constraints
  canGoBack = computed(() => {
    const prevMonth = new Date(this.displayYear(), this.displayMonth() - 1, 1);
    const startMonth = new Date(this.dataService.START_DATE.getFullYear(), this.dataService.START_DATE.getMonth(), 1);
    return prevMonth.getTime() >= startMonth.getTime();
  });

  canGoNext = computed(() => {
    const nextMonth = new Date(this.displayYear(), this.displayMonth() + 1, 1);
    const endMonth = new Date(this.dataService.END_DATE.getFullYear(), this.dataService.END_DATE.getMonth(), 1);
    return nextMonth.getTime() <= endMonth.getTime();
  });

  // Expose signal for the template
  entries = signal<Map<string, DayEntry>>(new Map());

  // Show raw data toggle
  showJson = signal(false);
  jsonData = this.dataService.entriesJson;

  ts = inject(TranslationService);
  showLangMenu = signal(false);

  constructor(public dataService: DataService) {}
  
  changeMonth(delta: number) {
    this.currentDate.update(d => {
      return new Date(d.getFullYear(), d.getMonth() + delta, 1);
    });
  }

  openDay(isoDate: string) {
    const entry = this.dataService.getEntry(isoDate);
    this.selectedEntry.set(entry);
  }

  closeModal() {
    this.selectedEntry.set(null);
  }

  saveEntry(updatedEntry: DayEntry) {
    this.dataService.saveEntry(updatedEntry);
    this.selectedEntry.set(null);
  }

  toggleJson() {
    this.showJson.update(v => !v);
  }

  toggleLangMenu() {
    this.showLangMenu.update(v => !v);
  }

  setLang(code: LanguageCode) {
    this.ts.setLanguage(code);
    this.showLangMenu.set(false);
  }

  // Helper for template to get the map
  get entriesMap() {
    return this.dataService.entriesMap; 
  }
}