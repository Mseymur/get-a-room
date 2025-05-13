import { Component, OnInit } from '@angular/core';
import {User} from '../../interfaces/core/user';
import {AuthService} from '../../services/core/auth.service';
import {ClassEventsService} from "../../services/class-events.service";
import {ClassEvent} from "../../interfaces/class-event";
import {DateTime} from "luxon";
import {MbscCalendarEvent, MbscEventcalendarOptions} from "@mobiscroll/angular";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  protected user: User = null;
  protected classEvents: ClassEvent[] = [];
  protected loading: boolean = false;
  protected q: string = null;
  protected data: MbscCalendarEvent[] = [];

  protected eventSettings: MbscEventcalendarOptions = {
    clickToCreate: false,
    dragToCreate: false,
    dragToMove: false,
    dragToResize: false,
    eventDelete: false,
    view: {
      calendar: { type: 'month' },
      agenda: { type: 'month' },
    },
    onEventClick: (args) => {

    },
  };

  constructor(private authService: AuthService,
              private loadingController: LoadingController,
              private classEventsService: ClassEventsService) { }

  public ngOnInit(): void {
    this.user = this.authService.user;
    // this.load();
  }

  public async load(): Promise<void> {
    this.loading = true;
    const loader = await this.loadingController.create({
      message: 'Loading...'
    });

    await loader.present();

    this.classEventsService.loadClassEvents({
      q: this.q,
      start: DateTime.local().toISODate(),
      end: DateTime.local().minus({ days: 7 }).toISODate(),
    }).subscribe(async (_classEvents) => {
      this.classEvents = _classEvents;

      this.data = _classEvents.map(_classEvent => {
        return {
          title: _classEvent.title,
          start: _classEvent.start,
          end: _classEvent.end,
          color: _classEvent.color,
        };
      });

      await loader.dismiss();

      this.loading = false;
    });

  }

}
