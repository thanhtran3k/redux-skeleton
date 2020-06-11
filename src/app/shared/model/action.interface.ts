import { Action } from '@ngrx/store';

export interface BaseSuccessAction extends Action {
    subType: string;
    payload: any;
}

export interface BaseFailedAction extends Action {
    subType: string;
    payload: any;
}
