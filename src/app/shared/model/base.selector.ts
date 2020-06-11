import { Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BaseSuccessAction, BaseFailedAction } from './action.interface';

export class BaseSelector {
  constructor(
    protected actions: Actions,
    protected actionSuccessType: string,
    protected actionFailedType: string
  ) { }

  actionSuccessOfSubtype$ = (...typeNames: string[]) =>
    this.actions.pipe(
        ofType(this.actionSuccessType),
        map(action => action as BaseSuccessAction),
        filter(a => typeNames.includes(a.subType))
    )
    
  actionFailedOfSubtype$ = (...typeNames: string[]) =>
    this.actions.pipe(
        ofType(this.actionFailedType),
        map(action => action as BaseFailedAction),
        filter(x => typeNames.includes(x.subType))
    )

  actionOfType$ = (...typeNames: string[]) =>
    this.actions.pipe(
        map(action => action as BaseSuccessAction),
        filter(x => typeNames.includes(x.type))
    )

  readonly loading$ = (typeName: string): Observable<boolean> =>
    this.actions.pipe(
      filter(action => (action['subType'] || action.type) === typeName),
      map(action => action.type === typeName)
    )
}
