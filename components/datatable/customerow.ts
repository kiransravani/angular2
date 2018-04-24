
import { NgModule, Directive, ElementRef, AfterViewInit, OnDestroy, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[inColSpan]'
})
export class ColSpanDirective {

    @Input() colSpan: number;
    @Input() description: string;
    constructor(private el: ElementRef) {

    }

    ngAfterViewInit(): void {
            console.log('Col Span Is' + this.colSpan);       
            let row = document.createElement("tr");
            let data = document.createElement("td");
            data.colSpan = this.colSpan;
            data.align = "center";
            data.style.fontWeight = "bold";
            let description = document.createTextNode(this.description);
            data.appendChild(description);
            row.appendChild(data);
            this.insertAfter(this.el.nativeElement.parentNode.parentNode.parentNode, row);
        
    }	

    insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}

@NgModule({
    exports: [ColSpanDirective],
    declarations: [ColSpanDirective]
})
export class CustomRowModule { }
