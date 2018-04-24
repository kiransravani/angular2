import { Component, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab } from './tab';

@Component({
    selector: 'atpar-pou-tabs',
    templateUrl: 'tabs.html'
})
export class POUReportTabs implements AfterContentInit {

    @ContentChildren(Tab) tabs: QueryList<Tab>;
    @Input() selectedTab: Tab;
    @Output() enableSelectedTab: EventEmitter<any> = new EventEmitter();
    // contentChildren are set
    //purpose
    //to enable and disable the tabs we have introduced this component.
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((tab) => tab.active);

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);            
        } else {
            this.selectTab(activeTabs[0]);
        }
    }

    selectTab(tab: Tab) {     
         this.select(tab);     
    }
    select(tab) {  
        this.tabs.toArray().forEach(tab => tab.active = false);
        this.enableSelectedTab.emit({ tab: tab, tabs: this.tabs });               
    }
}
