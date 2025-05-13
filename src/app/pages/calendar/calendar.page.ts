import { Component } from '@angular/core';
import { MbscCalendarEvent, MbscEventcalendarView, setOptions, localeDe } from '@mobiscroll/angular';

setOptions({
  locale: localeDe,
  theme: 'ios',
  themeVariant: 'light',
});

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})

export class CalendarPage {

  constructor() {
  }

}
