import {Subject} from 'rxjs';
import {Table} from 'dexie';

export abstract class StaticTable<T extends { id: number }> {

  private readonly _change$: Subject<void>;
  private readonly _table: Table<T, number>;

  protected constructor(table: Table<T, number>) {
    this._table = table;
    this._change$ = new Subject<void>();
  }

  /**
   *
   */
  get change$(): Subject<void> {
    return this._change$;
  }

  get table(): Table<T, number> {
    return this._table;
  }

  public clear(): Promise<void> {
    return this._table.clear();
  }

  // -------------------------------------------------------------------------------------------------------------------
  // Single item
  // -------------------------------------------------------------------------------------------------------------------
  /**
   *
   * @param itemId
   */
  public async get(itemId: number): Promise<T> {
    return this._table.get(itemId);
  }

  /**
   *
   * @param item
   */
  public async add(item: T): Promise<T> {
    item.id = await this._table.add(item);
    this._change$.next();
    return item;
  }

  /**
   *
   * @param item
   */
  public async update(item: T): Promise<T> {
    await this._table.update(item.id, item);
    this._change$.next();
    return item;
  }

  /**
   *
   * @param item
   */
  public async remove(item: T): Promise<void> {
    await this._table.delete(item.id);
    this._change$.next();
  }
  // -------------------------------------------------------------------------------------------------------------------
  // Multiple items
  // -------------------------------------------------------------------------------------------------------------------
  public async set(items: T[]): Promise<void> {
    await this._table.clear();
    await this._table.bulkAdd(items);
  }

  /**
   *
   */
  public async getAll(): Promise<T[]> {
    return this._table.toArray();
  }

  /**
   *
   * @param itemIds
   */
  public async getItems(itemIds: number[] = []): Promise<T[]> {
    const _items = await this._table.bulkGet(itemIds);
    return _items.filter(_item => _item !== undefined);
  }

  /**
   *
   * @param items
   */
  public async addMany(items: T[]): Promise<T[]> {
    const ids = await this._table.bulkAdd(items, null, { allKeys: true });
    this._change$.next();
    return items.map((_item, index) => {
      _item.id = ids[index];
      return _item;
    });
  }

  /**
   *
   * @param items
   */
  public async updateMany(items: T[]): Promise<T[]> {
    const ids = await this._table.bulkPut(items, { allKeys: true });
    this._change$.next();
    return items.map((_item, index) => {
      _item.id = ids[index];
      return _item;
    });
  }


  /**
   *
   * @param itemIds
   */
  public async removeMany(itemIds: number[]): Promise<void> {
    await this._table.bulkDelete(itemIds);
    this._change$.next();
  }
}
