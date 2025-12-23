import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, DayEntry } from '../services/data.service';
import { TranslationService } from '../services/translation.service';

interface CalendarDay {
  date: Date;
  isoDate: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDisabled: boolean;
  hasData: boolean;
  hasImages: boolean;
  imageDay: string;
  imageNight: string;
}

@Component({
  selector: 'app-calendar-month',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white border-4 border-black shadow-[10px_10px_0_rgba(0,0,0,0.5)] relative overflow-hidden">
      <!-- Watermark text behind -->
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 text-9xl font-black text-gray-100 opacity-50 pointer-events-none select-none whitespace-nowrap z-0">
        {{ monthName() }}
      </div>

      <!-- Month Header with Controls -->
      <div class="bg-black text-white px-2 sm:px-4 py-3 border-b-4 border-black flex justify-between items-center relative z-10 gap-4">
        
        <!-- Prev Button -->
        <button 
          (click)="monthChanged.emit(-1)" 
          [disabled]="!canGoBack()"
          class="group relative px-3 sm:px-4 py-1 sm:py-2 bg-white border-2 border-black text-black font-bold uppercase transform skew-x-12 hover:bg-[#d91c2b] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[2px_2px_0_#d91c2b]"
        >
          <div class="transform -skew-x-12 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="currentColor" class="w-4 h-4 sm:w-5 sm:h-5">
              <path stroke-linecap="square" stroke-linejoin="miter" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span class="hidden sm:inline text-sm">{{ ts.t().prev }}</span>
          </div>
        </button>

        <!-- Title (No Year) -->
        <h2 class="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-white drop-shadow-[2px_2px_0_#d91c2b] text-center flex-1">
          {{ monthName() }}
        </h2>

        <!-- Next Button -->
         <button 
          (click)="monthChanged.emit(1)" 
          [disabled]="!canGoNext()"
          class="group relative px-3 sm:px-4 py-1 sm:py-2 bg-white border-2 border-black text-black font-bold uppercase transform -skew-x-12 hover:bg-[#d91c2b] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[2px_2px_0_#fff]"
        >
          <div class="transform skew-x-12 flex items-center gap-1">
            <span class="hidden sm:inline text-sm">{{ ts.t().next }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="currentColor" class="w-4 h-4 sm:w-5 sm:h-5">
              <path stroke-linecap="square" stroke-linejoin="miter" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>
      </div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 border-b-4 border-black bg-white relative z-10">
        @for (day of weekDays(); track day) {
          <div class="py-3 text-center text-sm sm:text-xl font-bold bg-gray-100 text-black uppercase">
            {{ day }}
          </div>
        }
      </div>

      <!-- Days Grid -->
      <div class="grid grid-cols-7 auto-rows-fr bg-black gap-[2px] border-b-2 border-black relative z-10">
        @for (day of days(); track day.isoDate) {
          <button
            (click)="onDayClick(day)"
            [disabled]="day.isDisabled"
            [class]="getDayClasses(day)"
            class="relative h-20 sm:h-32 flex flex-col p-1 transition-all duration-100 focus:outline-none group overflow-hidden"
          >
            <!-- Background Decoration for Hover -->
            <div class="absolute inset-0 bg-[#d91c2b] transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out z-0"></div>

            <!-- Date Number -->
            <span 
              class="relative z-20 text-xl sm:text-3xl font-black italic self-start ml-1 mt-0 leading-none transition-colors duration-200"
              [class.text-[#d91c2b]]="day.isToday && !day.isDisabled"
              [class.text-white]="day.isToday && !day.isDisabled" 
              [class.text-gray-900]="!day.isToday"
              [class.group-hover:text-white]="!day.isDisabled"
              [class.scale-125]="day.isToday"
            >
              {{ day.date.getDate() }}
            </span>
            
            <!-- Today Label -->
            @if(day.isToday) {
                <span class="absolute top-1 right-1 bg-black text-white text-[8px] sm:text-[10px] font-bold px-1 uppercase transform rotate-12 z-20">
                    {{ ts.t().today }}
                </span>
            }

            <!-- Day Images (Bottom Right) -->
            @if (!day.isDisabled && day.hasImages) {
              <div class="absolute bottom-1 right-1 z-10 flex gap-1 pointer-events-none">
                 @if (day.imageDay) {
                   <img [src]="day.imageDay" class="w-6 h-6 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-200 object-cover shadow-sm transition-transform group-hover:scale-110" alt="Day">
                 }
                 @if (day.imageNight) {
                   <img [src]="day.imageNight" class="w-6 h-6 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-900 object-cover shadow-sm transition-transform group-hover:scale-110" alt="Night">
                 }
              </div>
            }

            <!-- Disabled Hatch Pattern -->
            @if (day.isDisabled) {
               <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0tMSwxIGw1LC01Ck0wLDQgbDQsLTQiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-20"></div>
            }
          </button>
        }
      </div>
    </div>
  `
})
export class CalendarMonthComponent {
  year = input.required<number>();
  month = input.required<number>(); 
  entries = input.required<Map<string, DayEntry>>();
  canGoBack = input.required<boolean>();
  canGoNext = input.required<boolean>();
  
  dayClicked = output<string>(); 
  monthChanged = output<number>();

  ts = inject(TranslationService);
  private dataService = inject(DataService);

  weekDays = computed(() => this.ts.t().weekDays);

  monthName = computed(() => {
    const date = new Date(this.year(), this.month(), 1);
    const locale = this.ts.currentLocale();
    const name = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
    return name.charAt(0).toUpperCase() + name.slice(1);
  });

  days = computed(() => {
    const y = this.year();
    const m = this.month();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    
    // Adjusted logic for Monday start:
    // JS getDay(): Sun=0, Mon=1 ... Sat=6
    // We want Mon=0, Tue=1 ... Sun=6
    // Formula: (day + 6) % 7
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; 
    
    const days: CalendarDay[] = [];

    // Previous month padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push(this.createDay(new Date(y, m, -i), false));
    }

    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(this.createDay(new Date(y, m, i), true));
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push(this.createDay(new Date(y, m + 1, i), false));
    }

    return days;
  });

  private createDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const isoDate = `${y}-${m}-${d}`;

    const today = new Date();
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear();

    const isDisabled = !this.dataService.isDateInRange(date);
    const entry = this.entries().get(isoDate);
    
    const hasData = !!(entry && (entry.daytime || entry.nighttime || entry.notes));

    // Images from Entry or empty if not present 
    const imageDay = entry?.imageDay || '';
    const imageNight = entry?.imageNight || '';

    // Fix: Only set hasImages if we actually have non-empty strings
    const hasImages = !!imageDay || !!imageNight;

    return { date, isoDate, isCurrentMonth, isToday, isDisabled, hasData, hasImages, imageDay, imageNight };
  }

  onDayClick(day: CalendarDay) {
    if (!day.isDisabled) {
      this.dayClicked.emit(day.isoDate);
    }
  }

  getDayClasses(day: CalendarDay): string {
    if (day.isDisabled) {
      return 'bg-gray-300 cursor-not-allowed';
    }
    if (!day.isCurrentMonth) {
      return 'bg-gray-200 text-gray-500';
    }
    return 'bg-white cursor-pointer';
  }
}