import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { EventBase } from './event.base';

@Injectable()
export class PubSubEvent<T> extends EventBase {

    subscribe(observer: (a: T) => void) {
        if (this.subscriptions.find(item => item[0] === observer) !== undefined)
            return;
        let subscription = this.observable.subscribe(observer);
        this.subscriptions.push([observer, subscription]);
    }

    publish(payload: T) {
        this.source.next(payload);
    }

    unsubscribe(observer: (a: T) => void) {
        let foundIndex = this.subscriptions.findIndex(item => item[0] === observer);
        if (foundIndex > -1) {
            let subscription: Subscription = this.subscriptions[foundIndex][1];
            //if (subscription.isUnsubscribed === false) {
            subscription.unsubscribe();
            console.log('unsubscribe successful');
            // }

            this.subscriptions.splice(foundIndex, 1);//removes item
        }
    }

    private source = new Subject<T>();

    // Observable string streams
    private observable = this.source.asObservable();

    // Cache array of tuples
    private subscriptions: Array<[(a: T) => void, Subscription]> = [];

}
