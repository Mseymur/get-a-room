import {Injectable} from '@angular/core';
import {Name} from '../../../../interfaces/examples/name';
import {IdStore} from '../../../../stores/id.store';

@Injectable({
  providedIn: 'root'
})
export class NamesStore extends IdStore<Name> {
  constructor() {
    super();
  }
}
