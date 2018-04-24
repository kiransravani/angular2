/// <reference path="../../common/dom/domhandler.ts" />
import { NgModule, Component, ElementRef, Input, Output, EventEmitter, AfterViewInit, AfterContentInit, ContentChildren, QueryList, TemplateRef, IterableDiffers, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectItem } from '../common/api';
import { SharedPrimeModule, PrimeTemplate } from '../common/sharedComponent';
import { DomHandler } from '../../common/dom/domhandler';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const LISTBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Listbox),
    multi: true
};
@Component({
    selector: 'atpar-listbox',
    templateUrl:'listbox.html',
    providers: [DomHandler, LISTBOX_VALUE_ACCESSOR]
})
export class Listbox implements AfterContentInit, ControlValueAccessor {

    @Input() options: SelectItem[];

    @Input() multiple: boolean;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() disabled: boolean;

    @Input() checkbox: boolean = false;

    @Input() filter: boolean = false;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    @Output() onDblClick: EventEmitter<any> = new EventEmitter();

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    public itemTemplate: TemplateRef<any>;

    public filterValue: string;

    public visibleOptions: SelectItem[];

    public filtered: boolean;

    public value: any;

    public onModelChange: Function = () => { };

    public onModelTouched: Function = () => { };

    public checkboxClick: boolean;

    @Input() id: string;

    @Input() required: boolean = false;

    constructor(public el: ElementRef, public domHandler: DomHandler) { }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;

                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }

    ngAfterViewInit() {
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
       

    }
    writeValue(value: any): void {
        this.value = value;
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

    onOptionClick(event, option) {
        if (!this.checkboxClick) {
            let metaKey = (event.metaKey || event.ctrlKey);
            let selected = this.isSelected(option);

            if (this.multiple)
                this.onOptionClickMultiple(event, option);
            else
                this.onOptionClickSingle(event, option);
        }
        else {
            this.checkboxClick = false;
        }
    }

    onOptionClickSingle(event, option) {
        let metaKey = (event.metaKey || event.ctrlKey);
        let selected = this.isSelected(option);
        let valueChanged = false;

        if (selected) {
            if (metaKey) {
                this.value = null;
                valueChanged = true;
            }
        }
        else {
            this.value = option.value;
            valueChanged = true;
        }

        if (valueChanged) {
            this.onModelChange(this.value);
            this.onChange.emit({
                originalEvent: event,
                value: this.value
            });
        }
    }

    onOptionClickMultiple(event, option) {
        let metaKey = (event.metaKey || event.ctrlKey);
        let selected = this.isSelected(option);
        let valueChanged = false;

        if (selected) {
            if (metaKey) {
                this.value.splice(this.findIndex(option), 1);
            }
            else {
                this.value = [];
                this.value.push(option.value);
            }
            valueChanged = true;
        }
        else {
            this.value = (metaKey) ? this.value || [] : [];
            this.value.push(option.value);
            valueChanged = true;
        }

        if (valueChanged) {
            this.onModelChange(this.value);
            this.onChange.emit({
                originalEvent: event,
                value: this.value
            });
        }
    }

    isSelected(option: SelectItem) {
        let selected = false;

        if (this.multiple) {
            if (this.value) {
                for (let i = 0; i < this.value.length; i++) {
                    if (this.value[i] === option.value) {
                        selected = true;
                        break;
                    }
                }
            }
        }
        else {
            selected = this.value == option.value;
        }

        return selected;
    }

    findIndex(option: SelectItem): number {
        let index: number = -1;
        if (this.value) {
            for (let i = 0; i < this.value.length; i++) {
                if (this.domHandler.equals(option.value, this.value[i])) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    isAllChecked() {
        if (this.filterValue && this.filterValue.trim().length)
            return this.value && this.visibleOptions && (this.value.length == this.visibleOptions.length);
        else
            return this.value && this.options && (this.value.length == this.options.length);
    }

    onFilter(event) {
        this.filterValue = event.target.value.trim().toLowerCase();
        this.visibleOptions = [];
        for (let i = 0; i < this.options.length; i++) {
            let option = this.options[i];
            if (option.label.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1) {
                this.visibleOptions.push(option);
            }
        }
        this.filtered = true;
    }

    toggleAll(event, checkbox) {
        if (checkbox.checked) {
            this.value = [];
        }
        else {
            let opts = this.getVisibleOptions();
            if (opts) {
                this.value = [];
                for (let i = 0; i < opts.length; i++) {
                    this.value.push(opts[i].value);
                }
            }
        }
        checkbox.checked = !checkbox.checked;
        this.onModelChange(this.value);
        this.onChange.emit({ originalEvent: event, value: this.value });
    }

    getVisibleOptions(): SelectItem[] {
        if (this.filterValue && this.filterValue.trim().length) {
            let items = [];
            for (let i = 0; i < this.options.length; i++) {
                let option = this.options[i];
                if (option.label.toLowerCase().includes(this.filterValue.toLowerCase())) {
                    items.push(option);
                }
            }
            return items;
        }
        else {
            return this.options;
        }
    }
    

    isItemVisible(option: SelectItem): boolean {
        if (this.filterValue && this.filterValue.trim().length) {
            for (let i = 0; i < this.visibleOptions.length; i++) {
                if (this.visibleOptions[i].value == option.value) {
                    return true;
                }
            }
        }
        else {
            return true;
        }
    }

    onDoubleClick(event: Event, option: SelectItem): any {
        this.onDblClick.emit({
            originalEvent: event,
            value: this.value
        })
    }

    onCheckboxClick(event: Event, option: SelectItem) {
        this.checkboxClick = true;
        let selected = this.isSelected(option);

        if (selected) {
            this.value.splice(this.findIndex(option), 1);
        }
        else {
            this.value = this.value ? this.value : [];
            this.value.push(option.value);
        }

        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
    }
}

@NgModule({
    imports: [CommonModule, SharedPrimeModule],
    exports: [Listbox, SharedPrimeModule],
    declarations: [Listbox]
})
export class ListboxModule { }
