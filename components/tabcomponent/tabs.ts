import { Component, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab } from './tab';

@Component({
    selector: 'atpar-tabs',
    templateUrl:'tabs.html'
})
export class Tabs implements AfterContentInit {

    @ContentChildren(Tab) tabs: QueryList<Tab>;
    @Input() selectedTab: string;
    @Output() enableSelectedTab: EventEmitter<any> = new EventEmitter();
    @Output() selectedTabIndexChanged: EventEmitter<any> = new EventEmitter();
    
    // contentChildren are set
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((tab) => tab.active);

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    selectTab(tab: Tab) {
        // deactivate all tabs
        this.tabs.toArray().forEach(tab => tab.active = false);
        this.enableSelectedTab.emit(tab);
        // activate the tab the user has clicked on.
        tab.active = true;
        this.selectedTabIndexChanged.emit({tab: tab, tabs: this.tabs });
    }

}
