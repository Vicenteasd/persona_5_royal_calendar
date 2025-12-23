import { Component, input, output, signal, effect, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DayEntry } from '../services/data.service';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-day-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 font-['Oswald']" role="dialog" aria-modal="true">
      <!-- Dynamic Backdrop -->
      <div class="absolute inset-0 bg-red-600/80 backdrop-grayscale transition-opacity" (click)="close.emit()">
         <!-- Striped pattern overlay -->
         <div class="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+CjxwYXRoIGQ9Ik0tMSwxIGwzLC0zIE0wLDEwIGwxMCwtMTAgTTEwLDExIGwxLC0xIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')]"></div>
      </div>

      <!-- Modal Card (Skewed Container) -->
      <div class="relative w-full max-w-3xl lg:max-w-7xl transform transition-all">
        
        <!-- Rotating White Background Shape -->
        <div class="absolute inset-0 bg-white transform -rotate-2 shadow-[20px_20px_0_rgba(0,0,0,1)] z-0 border-4 border-black"></div>

        <!-- Main Content Container -->
        <div class="relative z-10 bg-white border-4 border-black p-1">
            
            <!-- Header Strip -->
            <div class="bg-black text-white p-3 sm:p-6 transform -skew-x-6 -ml-4 -mt-4 mb-2 sm:mb-6 border-b-4 border-red-600 shadow-lg flex justify-between items-center w-[105%]">
                <div>
                    <!-- Reduced font size on mobile (text-xl) -->
                    <h3 class="text-xl sm:text-4xl font-black uppercase italic tracking-tighter transform skew-x-6 truncate max-w-[200px] sm:max-w-none">
                        {{ formattedDate() }}
                    </h3>
                    <!-- Hidden on mobile -->
                    <p class="hidden sm:block text-red-500 font-bold uppercase tracking-widest text-xs sm:text-sm transform skew-x-6">
                      {{ ts.t().eventHeader }}
                    </p>
                </div>
                <button (click)="close.emit()" class="transform skew-x-6 bg-white text-black hover:bg-red-600 hover:text-white rounded-full p-1 sm:p-2 border-2 border-transparent hover:border-black transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
                        <path stroke-linecap="square" stroke-linejoin="miter" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <!-- Increased max-height to 80vh on mobile -->
            <div class="px-4 sm:px-6 pb-2 sm:pb-6 gap-4 sm:gap-8 grid grid-cols-1 lg:grid-cols-3 max-h-[80vh] sm:max-h-[75vh] overflow-y-auto no-scrollbar">
            
                <!-- Daytime Section -->
                <div class="relative group flex flex-col h-full shrink-0">
                    <div class="absolute -left-2 top-0 bottom-0 w-1 bg-yellow-400 group-focus-within:bg-black transition-colors"></div>
                    <label class="block bg-black text-white px-2 sm:px-4 py-1 text-sm sm:text-xl font-bold uppercase italic inline-block transform -skew-x-12 mb-2 shadow-[2px_2px_0_#facc15] sm:shadow-[4px_4px_0_#facc15] self-start">
                        <span class="transform skew-x-12 block">{{ ts.t().dayActivity }}</span>
                    </label>
                    <textarea 
                        [(ngModel)]="formData.daytime"
                        class="w-full h-full min-h-[14rem] sm:min-h-[16rem] bg-gray-100 border-b-4 border-black p-3 sm:p-4 text-black text-base sm:text-lg font-bold placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-red-600 transition-colors resize-none font-sans"
                        [placeholder]="ts.t().placeholderDay"
                    ></textarea>
                </div>

                <!-- Nighttime Section -->
                <div class="relative group flex flex-col h-full shrink-0">
                    <div class="absolute -left-2 top-0 bottom-0 w-1 bg-blue-600 group-focus-within:bg-black transition-colors"></div>
                    <label class="block bg-black text-white px-2 sm:px-4 py-1 text-sm sm:text-xl font-bold uppercase italic inline-block transform -skew-x-12 mb-2 shadow-[2px_2px_0_#2563eb] sm:shadow-[4px_4px_0_#2563eb] self-start">
                        <span class="transform skew-x-12 block">{{ ts.t().nightActivity }}</span>
                    </label>
                    <textarea 
                        [(ngModel)]="formData.nighttime"
                        class="w-full h-full min-h-[14rem] sm:min-h-[16rem] bg-gray-100 border-b-4 border-black p-3 sm:p-4 text-black text-base sm:text-lg font-bold placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors resize-none font-sans"
                        [placeholder]="ts.t().placeholderNight"
                    ></textarea>
                </div>

                <!-- Notes Section -->
                <div class="relative group flex flex-col h-full shrink-0">
                    <div class="absolute -left-2 top-0 bottom-0 w-1 bg-gray-400 group-focus-within:bg-black transition-colors"></div>
                    <label class="block bg-black text-white px-2 sm:px-4 py-1 text-sm sm:text-xl font-bold uppercase italic inline-block transform -skew-x-12 mb-2 shadow-[2px_2px_0_#9ca3af] sm:shadow-[4px_4px_0_#9ca3af] self-start">
                        <span class="transform skew-x-12 block">{{ ts.t().notes }}</span>
                    </label>
                    <textarea 
                        [(ngModel)]="formData.notes"
                        class="w-full h-full min-h-[14rem] sm:min-h-[16rem] bg-gray-100 border-b-4 border-black p-3 sm:p-4 text-black text-base sm:text-lg font-bold placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-600 transition-colors resize-none font-sans"
                        [placeholder]="ts.t().placeholderNotes"
                    ></textarea>
                </div>
            </div>

            <!-- Footer Action -->
            <div class="bg-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex justify-end gap-3 sm:gap-6 border-t-4 border-black">
                <button (click)="close.emit()" class="px-2 sm:px-6 py-1 sm:py-2 text-sm sm:text-base font-bold uppercase text-black hover:text-red-600 hover:underline transition-all">
                    {{ ts.t().discard }}
                </button>
                <button (click)="onSave()" class="relative group px-4 sm:px-8 py-2 sm:py-3 bg-red-600 text-white font-black uppercase tracking-wider transform skew-x-[-10deg] border-2 border-black hover:bg-black hover:text-white hover:border-red-600 transition-all shadow-[3px_3px_0_#000] sm:shadow-[5px_5px_0_#000]">
                    <span class="block transform skew-x-[10deg] text-xs sm:text-base group-hover:scale-110 transition-transform">{{ ts.t().save }}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  `
})
export class DayModalComponent {
  entry = input.required<DayEntry>();
  close = output<void>();
  save = output<DayEntry>();
  
  ts = inject(TranslationService);

  formattedDate = computed(() => {
     if (!this.entry().date) return '';
     const dateObj = new Date(this.entry().date + 'T12:00:00');
     const locale = this.ts.currentLocale();
     const formatted = new Intl.DateTimeFormat(locale, { 
        weekday: 'short', 
        month: 'numeric', 
        day: 'numeric' 
      }).format(dateObj);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  });

  formData: DayEntry = {
    date: '',
    daytime: '',
    nighttime: '',
    notes: '',
    imageDay: '',
    imageNight: ''
  };

  constructor() {
    effect(() => {
      const e = this.entry();
      this.formData = { ...e };
    });
  }

  onSave() {
    this.save.emit(this.formData);
  }
}