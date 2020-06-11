import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class SafeUnsubscriber implements OnDestroy {
  private subscriptions: Subscription[] = [];
  protected onDestroyHandler = null;  
  constructor() {
      const func = this.ngOnDestroy;
      this.ngOnDestroy = () => {
          func();
          !!this.onDestroyHandler && this.onDestroyHandler();
          this.unsubscribeAll();
      };
  }

  protected safeSubscription(sub: Subscription): Subscription {
      this.subscriptions.push(sub);
      return sub;
  }

  protected safeSubscriptions(subs: Subscription[]): Subscription[] {
    this.subscriptions.push(...subs);
    return subs;
  }

  public unsubscribeAll() {
      this.subscriptions.forEach(element => !element.closed && element.unsubscribe() );
  }

  ngOnDestroy() {
  }
}
