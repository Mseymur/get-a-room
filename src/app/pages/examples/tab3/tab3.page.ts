import { Component } from '@angular/core';
import {SegmentCustomEvent} from '@ionic/angular';
import {DateTime} from 'luxon';
import {ExampleItem} from '../../../interfaces/examples/example-item';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  protected segment: string = 'local';

  protected items: ExampleItem[] = [
    {
      id: 1,
      title: 'First item',
      subtitle: 'Subtitle of the first item',
      image: 'test-image.jpeg',
      created: DateTime.local().minus({ day: 4, minute: 180 }).toJSDate()
    },
    {
      id: 2,
      title: 'Second item',
      subtitle: 'Subtitle of the second item',
      image: 'test-image.jpeg',
      created: DateTime.local().minus({ day: 2, minute: 30 }).toJSDate()
    },
    {
      id: 3,
      title: 'Third item',
      subtitle: 'Subtitle of the third item',
      image: 'test-image.jpeg',
      created: DateTime.local().minus({ minutes: 45 }).toJSDate()
    }
  ];

  constructor() {}

  /**
   *
   * @protected
   */
  protected setSegmentIndex(event: SegmentCustomEvent): void {
    this.segment = event.detail.value as string;
  }

}
