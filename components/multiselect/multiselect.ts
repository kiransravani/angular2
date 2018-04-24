

import {NgModule,Component,ElementRef,OnInit,AfterViewInit,AfterViewChecked,DoCheck,OnDestroy,Input,Output,Renderer,EventEmitter,IterableDiffers,forwardRef,ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectItem} from '../common/api';
import { DomHandler } from '../../common/dom/domhandler';
import { ObjectUtils } from '../../common/util/ObjectUtils';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

export const MULTISELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiSelect),
  multi: true
};

@Component({
    selector: 'atpar-multiSelect',
    templateUrl:'multiselect.html',
    providers: [DomHandler,ObjectUtils,MULTISELECT_VALUE_ACCESSOR]
})
export class MultiSelect implements OnInit,AfterViewInit,AfterViewChecked,DoCheck,OnDestroy,ControlValueAccessor {

    @Input() options: SelectItem[];

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    @Input() scrollHeight: string = '200px';
    
    @Input() defaultLabel: string = 'Select Item';

    @Input() style: any;

    @Input() styleClass: string;

    @Input() inputId: string;

    @Input() disabled: boolean;
    
    @Input() overlayVisible: boolean;

    @Input() tabindex: number;
    
    @Input() appendTo: any;
    
    @Input() dataKey: string;
    
    @ViewChild('container') containerViewChild: ElementRef;
    
    @ViewChild('panel') panelViewChild: ElementRef;
    
    public value: any[];
    
    public onModelChange: Function = () => {};
    
    public onModelTouched: Function = () => {};
    
    public valuesAsString: string;
        
    public focus: boolean;
    
    public documentClickListener: any;
    
    public container: HTMLDivElement;
    
    public panel: HTMLDivElement;
        
    public selfClick: boolean;
    
    public panelClick: boolean;
    
    public filterValue: string;
    
    public visibleOptions: SelectItem[];
    
    public filtered: boolean;
        
    public differ: any;

    @Input() id: string;

    @Input() required: boolean = false;
    
    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, differs: IterableDiffers, public objectUtils: ObjectUtils) {
        this.differ = differs.find([]).create(null);
    }
    
    ngOnInit() {
        this.updateLabel();
        
        this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
            if(!this.selfClick && this.overlayVisible) {
                this.hide();
            }
            
            this.selfClick = false;
            this.panelClick = false;
        });
    }
    
    ngAfterViewInit() {
        this.container = <HTMLDivElement> this.containerViewChild.nativeElement;
        this.panel = <HTMLDivElement> this.panelViewChild.nativeElement; 
        
        if(this.appendTo) {
            if(this.appendTo === 'body')
                document.body.appendChild(this.panel);
            else
                this.domHandler.appendChild(this.panel, this.appendTo);
        }
        if (this.required == true) {
            var node = document.createElement("span");
            node.setAttribute("class", "text-danger autocomplete-mandatory");
            var textnode = document.createTextNode("*");
            var sp2 = document.getElementById(this.id);
            var parentDiv = sp2.parentNode;
            node.appendChild(textnode);
            document.getElementById(this.id).appendChild(node);
            parentDiv.insertBefore(node, sp2);


        }
        
        if(this.overlayVisible) {
            this.show();
        }
    }
    
    ngAfterViewChecked() {
        if(this.filtered) {
            this.domHandler.relativePosition(this.panel, this.container);
            this.filtered = false;
        }
    }
    
    ngDoCheck() {
        let changes = this.differ.diff(this.value);
        
        if(changes) {
            this.updateLabel();
        }
    }
    
    writeValue(value: any) : void {
        this.value = value;
        this.updateLabel();
    }
    
    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }
    
    setDisabledState(val: boolean): void {
        this.disabled = val;
    }
    
    onItemClick(event, value) {
        let selectionIndex = this.findSelectionIndex(value);
        if(selectionIndex != -1)
            this.value = this.value.filter((val,i) => i!=selectionIndex);
        else
            this.value = [...this.value||[],value];
        
        this.onModelChange(this.value);
        this.onChange.emit({originalEvent: event, value: this.value});
    }   
    
    isSelected(value) {
        return this.findSelectionIndex(value) != -1;
    }
    
    findSelectionIndex(val: any): number {
        let index = -1;
        
        if(this.value) {
            for(let i = 0; i < this.value.length; i++) {
                if(this.objectUtils.equals(this.value[i], val, this.dataKey)) {
                    index = i;
                    break;
                }
            }
        }
        
        return index;
    }
    
    toggleAll(event, checkbox) {
        if(checkbox.checked) {
            this.value = [];
        }
        else {
            let opts = this.getVisibleOptions();
            if(opts) {
                this.value = [];
                for(let i = 0; i < opts.length; i++) {
                    this.value.push(opts[i].value);
                } 
            }
        }
        checkbox.checked = !checkbox.checked;
        this.onModelChange(this.value);
        this.onChange.emit({originalEvent: event, value: this.value});
    } 
    
    isAllChecked() {
        if(this.filterValue && this.filterValue.trim().length)
            return this.value&&this.visibleOptions&&this.visibleOptions.length&&(this.value.length == this.visibleOptions.length);
        else
            return this.value&&this.options&&(this.value.length == this.options.length);
    } 
    
    show() {
        this.overlayVisible = true;
        this.panel.style.zIndex = String(++DomHandler.zindex);
        
        if(this.appendTo)
            this.domHandler.absolutePosition(this.panel, this.container);
        else
            this.domHandler.relativePosition(this.panel, this.container);

        this.domHandler.fadeIn(this.panel, 250);
    }
    
    hide() {
        this.overlayVisible = false;
    }
    
    close(event) {
        this.hide();
        event.preventDefault();
    }
         
    onMouseclick(event,input) {
        if(this.disabled) {
            return;
        }
        
        if(!this.panelClick) {
            if(this.overlayVisible) {
                this.hide();
            }
            else {
                input.focus();
                this.show();
            }
        }
        
        this.selfClick = true;
    }
    
    onFocus(event) {
        this.focus = true;
    }
    
    onBlur(event) {
        this.focus = false;
        this.onModelTouched();
    }
    
    updateLabel() {
        if(this.value && this.value.length) {
            let label = '';
            for(let i = 0; i < this.value.length; i++) {
                if(i != 0) {
                    label = label + ', ';
                }
                label = label + this.findLabelByValue(this.value[i]);
            }
            this.valuesAsString = label;
        }
        else {
            this.valuesAsString = this.defaultLabel;
        }
    }
    
    findLabelByValue(val: any): string {
        let label = null;
        for(let i = 0; i < this.options.length; i++) {
            let option = this.options[i];
            if(option.value == val) {
                label = option.label;
                break; 
            }
        }
        return label;
    }
    
    onFilter(event) {
        this.filterValue = event.target.value.trim().toLowerCase();
        this.visibleOptions = [];
        for(let i = 0; i < this.options.length; i++) {
            let option = this.options[i];
            if(option.label.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1) {
                this.visibleOptions.push(option);
            }
        }
        this.filtered = true;
    }
        
    isItemVisible(option: SelectItem): boolean {
        if(this.filterValue && this.filterValue.trim().length) {
            for(let i = 0; i < this.visibleOptions.length; i++) {
                if(this.visibleOptions[i].value == option.value) {
                    return true;
                }
            }
        }
        else {
            return true;
        }
    }
    
    getVisibleOptions(): SelectItem[] {
        if(this.filterValue && this.filterValue.trim().length) {
            let items = [];
            for(let i = 0; i < this.options.length; i++) {
                let option = this.options[i];
                if(option.label.toLowerCase().includes(this.filterValue.toLowerCase())) {
                    items.push(option);
                }
            }
            return items;
        }
        else {
            return this.options;
        }
    }

    ngOnDestroy() {
        if(this.documentClickListener) {
            this.documentClickListener();
        }
        
        if(this.appendTo) {
            this.container.appendChild(this.panel);
        }
    }

}

@NgModule({
    imports: [CommonModule],
    exports: [MultiSelect],
    declarations: [MultiSelect]
})
export class MultiSelectModule { }
