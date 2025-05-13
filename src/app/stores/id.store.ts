import {BehaviorSubject} from 'rxjs';

export abstract class IdStore<T extends { id: number }> {

  protected _items: T[] = [];
  protected _items$: BehaviorSubject<T[]>;
  protected _setItems$: BehaviorSubject<T[]>;

  protected constructor() {
    this._items$ = new BehaviorSubject<T[]>(this._items);
    this._setItems$ = new BehaviorSubject<T[]>(this._items);
  }

  set items(items: T[]) {
    this._items = items;
    this._items$.next(this._items);
    this._setItems$.next(this._items);
  }

  get setItems$(): BehaviorSubject<T[]> {
    return this._setItems$;
  }

  get items$(): BehaviorSubject<T[]> {
    return this._items$;
  }

  get items(): T[] {
    return this._items;
  }

  /**
   *
   * @param item
   * @param method
   */
  public add(item: T, method: 'push' | 'shift' = 'push'): void {
    if(method === 'push') {
      this._items = [...this._items, item];
    }
    else {
      this._items = [item, ...this._items];
    }

    this._items$.next(this._items);
  }

  /**
   *
   * @param item
   */
  public update(item: T): void {
    this._items = this._items.map(_item => _item.id === item.id ? item : _item);
    this._items$.next(this._items);
  }

  /**
   *
   * @param itemId
   */
  public remove(itemId: number): void {
    this._items = this._items.filter(_item => _item.id !== itemId);
    this._items$.next(this._items);
  }

  /**
   *
   * @param item
   */
  public addOrUpdate(item: T): void {
    if(this._items.some(_item => _item.id === item.id)) {
      this.update(item);
    } else {
      this.add(item);
    }
  }

  /**
   * 
   * @param itemId
   */
  public get(itemId: number): T {
    return this._items.find(_item => _item.id === itemId);
  }

  /**
   *
   * @param items
   */
  public addMany(items: T[]): void {
    this._items = [...this._items, ...items];
    this._items$.next(this._items);
  }

  /**
   * 
   * @param items
   */
  public updateMany(items: T[]): void {
    this._items.map(_item => {
      const item = items.find(_item2 => _item2.id === _item.id);
      return item ? item : _item;
    });
    this._items$.next(this._items);
  }

}
