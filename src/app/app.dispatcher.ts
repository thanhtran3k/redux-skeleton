import { Store, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable()
export class Dispatcher {
  public store: Store<any>;

  constructor(data: Store<any>) {
    this.store = data;
  }
  
  public fire(action: Action): any {
    this.store.dispatch(action);
  }
}
