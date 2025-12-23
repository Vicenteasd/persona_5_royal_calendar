import { Injectable, signal, computed } from '@angular/core';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'it';

export interface Translation {
  title: string;
  viewIntel: string;
  hideIntel: string;
  targetData: string;
  secret: string;
  missionDuration: string;
  prev: string;
  next: string;
  today: string;
  eventHeader: string;
  dayActivity: string;
  nightActivity: string;
  notes: string;
  discard: string;
  save: string;
  placeholderDay: string;
  placeholderNight: string;
  placeholderNotes: string;
  months: string[];
  weekDays: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  readonly currentLang = signal<LanguageCode>('en');

  readonly languages: { code: LanguageCode; flagUrl: string; name: string }[] = [
    { code: 'en', flagUrl: 'https://flagcdn.com/w80/us.png', name: 'English' },
    { code: 'es', flagUrl: 'https://flagcdn.com/w80/es.png', name: 'Español' },
    { code: 'fr', flagUrl: 'https://flagcdn.com/w80/fr.png', name: 'Français' },
    { code: 'de', flagUrl: 'https://flagcdn.com/w80/de.png', name: 'Deutsch' },
    { code: 'it', flagUrl: 'https://flagcdn.com/w80/it.png', name: 'Italiano' },
  ];

  private readonly dictionaries: Record<LanguageCode, Translation> = {
    en: {
      title: 'Chronos',
      viewIntel: 'View Intel',
      hideIntel: 'Hide Intel',
      targetData: 'Target Data',
      secret: 'Secret',
      missionDuration: 'Mission Duration',
      prev: 'Prev',
      next: 'Next',
      today: 'Today',
      eventHeader: 'Confidant Event / Log',
      dayActivity: 'Daytime Activity',
      nightActivity: 'Nighttime Activity',
      notes: 'Notes / Mementos',
      discard: 'Discard',
      save: 'Take Your Time',
      placeholderDay: 'What movements did you make?',
      placeholderNight: 'How did you spend the night?',
      placeholderNotes: 'Other observations...',
      months: [],
      weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    es: {
      title: 'Chronos',
      viewIntel: 'Ver Datos',
      hideIntel: 'Ocultar',
      targetData: 'Datos Objetivo',
      secret: 'Secreto',
      missionDuration: 'Duración Misión',
      prev: 'Ant',
      next: 'Sig',
      today: 'Hoy',
      eventHeader: 'Evento Confidente / Registro',
      dayActivity: 'Actividad Diurna',
      nightActivity: 'Actividad Nocturna',
      notes: 'Notas / Mementos',
      discard: 'Descartar',
      save: 'Tómate tu tiempo',
      placeholderDay: '¿Qué movimientos hiciste?',
      placeholderNight: '¿Cómo pasaste la noche?',
      placeholderNotes: 'Otras observaciones...',
      months: [],
      weekDays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    },
    fr: {
      title: 'Chronos',
      viewIntel: 'Voir Infos',
      hideIntel: 'Cacher',
      targetData: 'Données Cibles',
      secret: 'Secret',
      missionDuration: 'Durée Mission',
      prev: 'Préc',
      next: 'Suiv',
      today: 'Auj',
      eventHeader: 'Événement Confident / Journal',
      dayActivity: 'Activité Diurne',
      nightActivity: 'Activité Nocturne',
      notes: 'Notes / Mementos',
      discard: 'Jeter',
      save: 'Prends ton temps',
      placeholderDay: 'Quels mouvements as-tu faits ?',
      placeholderNight: 'Comment as-tu passé la nuit ?',
      placeholderNotes: 'Autres observations...',
      months: [],
      weekDays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    },
    de: {
      title: 'Chronos',
      viewIntel: 'Daten Ansehen',
      hideIntel: 'Verbergen',
      targetData: 'Zieldaten',
      secret: 'Geheim',
      missionDuration: 'Missionsdauer',
      prev: 'Zur',
      next: 'Wei',
      today: 'Heute',
      eventHeader: 'Vertrauter Event / Log',
      dayActivity: 'Tagesaktivität',
      nightActivity: 'Nachtaktivität',
      notes: 'Notizen / Mementos',
      discard: 'Verwerfen',
      save: 'Lass dir Zeit',
      placeholderDay: 'Welche Schritte hast du unternommen?',
      placeholderNight: 'Wie hast du die Nacht verbracht?',
      placeholderNotes: 'Andere Beobachtungen...',
      months: [],
      weekDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    },
    it: {
      title: 'Chronos',
      viewIntel: 'Vedi Dati',
      hideIntel: 'Nascondi',
      targetData: 'Dati Obiettivo',
      secret: 'Segreto',
      missionDuration: 'Durata Missione',
      prev: 'Prec',
      next: 'Succ',
      today: 'Oggi',
      eventHeader: 'Evento Confidente / Registro',
      dayActivity: 'Attività Diurna',
      nightActivity: 'Attività Notturna',
      notes: 'Note / Mementos',
      discard: 'Scarta',
      save: 'Prenditi il tuo tempo',
      placeholderDay: 'Che movimenti hai fatto?',
      placeholderNight: 'Come hai passato la notte?',
      placeholderNotes: 'Altre osservazioni...',
      months: [],
      weekDays: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
    }
  };

  readonly t = computed(() => this.dictionaries[this.currentLang()]);

  // Map simplified codes to Intl locales
  readonly locales: Record<LanguageCode, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT'
  };

  readonly currentLocale = computed(() => this.locales[this.currentLang()]);

  constructor() {
    this.detectLanguage();
  }

  setLanguage(lang: LanguageCode) {
    this.currentLang.set(lang);
    document.documentElement.lang = lang;
  }

  private detectLanguage() {
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    if (['en', 'es', 'fr', 'de', 'it'].includes(browserLang)) {
      this.setLanguage(browserLang as LanguageCode);
    } else {
      this.setLanguage('en');
    }
  }
}