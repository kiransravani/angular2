

import { NgModule, Component, ViewChild, ElementRef, AfterViewInit, AfterContentInit, AfterViewChecked, DoCheck, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef, IterableDiffers, Renderer, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from '../../inputtext/inputtext';
import { ButtonModule } from '../../button/button';
import { SharedPrimeModule, PrimeTemplate } from '../../common/sharedComponent';
import { DomHandler } from '../../../common/dom/domhandler';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ObjectUtils } from '../../../common/util/ObjectUtils';
export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutoComplete),
    multi: true
};

@Component({
    selector: 'atpar-ac-server',
    templateUrl: 'autocomplete-server.html',
    host: {
        '[class.ui-inputwrapper-filled]': 'filled',
        '[class.ui-inputwrapper-focus]': 'focus'
    },
    providers: [DomHandler, ObjectUtils, AUTOCOMPLETE_VALUE_ACCESSOR]
})
export class AutoComplete implements AfterViewInit, DoCheck, AfterViewChecked, ControlValueAccessor {

    @Input() minLength: number = 1;

    @Input() delay: number = 300;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() inputStyle: any;

    @Input() inputId: string;

    @Input() inputStyleClass: string;

    @Input() placeholder: string;

    @Input() readonly: boolean;

    @Input() disabled: boolean;

    @Input() maxlength: number;

    @Input() size: number;

    @Input() suggestions: any[];

    @Input() appendTo: any;

    @Input() autoHighlight: boolean;

    @Output() completeMethod: EventEmitter<any> = new EventEmitter();

    @Output() onSelect: EventEmitter<any> = new EventEmitter();

    @Output() onEnter: EventEmitter<any> = new EventEmitter();

    @Output() onUnselect: EventEmitter<any> = new EventEmitter();

    @Output() onFocus: EventEmitter<any> = new EventEmitter();

    @Output() onBlur: EventEmitter<any> = new EventEmitter();

    @Output() onDropdownClick: EventEmitter<any> = new EventEmitter();

    @Input() field: string;

    @Input() scrollHeight: string = '200px';

    @Input() dropdown: boolean;

    @Input() multiple: boolean;

    @Input() tabindex: number;

    @Input() dataKey: string;

    @Input() mandatory: boolean = false;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    public itemTemplate: TemplateRef<any>;

    public selectedItemTemplate: TemplateRef<any>;

    value: any;

    onModelChange: Function = () => { };

    onModelTouched: Function = () => { };

    timeout: any;

    differ: any;

    panel: any;

    input: any;

    multipleContainer: any;

    panelVisible: boolean = false;

    documentClickListener: any;

    suggestionsUpdated: boolean;

    highlightOption: any;

    highlightOptionChanged: boolean;

    focus: boolean = false;

    dropdownFocus: boolean = false;

    filled: boolean;

    @Input() isfocus: boolean;

    @Input() id: string;


    @ViewChild('in') inputEL: ElementRef;

    @ViewChild('multiIn') multiInputEL: ElementRef;

    constructor(public el: ElementRef, public domHandler: DomHandler, differs: IterableDiffers, public renderer: Renderer, public objectUtils: ObjectUtils) {
        this.differ = differs.find([]).create(null);
    }

    ngDoCheck() {
        let changes = this.differ.diff(this.suggestions);
        if (changes && this.panel) {
            if (this.suggestions && this.suggestions.length) {
                this.show();
                this.suggestionsUpdated = true;

                if (this.autoHighlight) {
                    this.highlightOption = this.suggestions[0];
                }
            }
            else {
                this.hide();
            }
        }
    }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;

                case 'selectedItem':
                    this.selectedItemTemplate = item.template;
                    break;

                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }

    ngAfterViewInit() {
        this.input = this.domHandler.findSingle(this.el.nativeElement, 'input');
        this.panel = this.domHandler.findSingle(this.el.nativeElement, 'div.ui-autocomplete-panel');

        if (this.multiple) {
            this.multipleContainer = this.domHandler.findSingle(this.el.nativeElement, 'ul.ui-autocomplete-multiple-container');
        }

        this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
            this.hide();
        });
        if (this.input != null && this.mandatory) {
            //this.input.classList.add('bdr-red');
            var node = document.createElement("span");
            node.setAttribute("class", "text-danger autocomplete-mandatory");
            var textnode = document.createTextNode("*");
            var sp2 = document.getElementById(this.id);
            var parentDiv = sp2.parentNode;
            node.appendChild(textnode);           
            document.getElementById(this.id).appendChild(node);
            parentDiv.insertBefore(node, sp2);
        }
        
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.panel);
            else
                this.domHandler.appendChild(this.panel, this.appendTo);
        }

        if (this.isfocus == true)
        {
            document.getElementById(this.id).focus();
        }
    }

    ngAfterViewChecked() {
        if (this.suggestionsUpdated) {
            this.align();
            this.suggestionsUpdated = false;
        }

        if (this.highlightOptionChanged) {
            let listItem = this.domHandler.findSingle(this.panel, 'li.ui-state-highlight');
            if (listItem) {
                this.domHandler.scrollInView(this.panel, listItem);
            }
            this.highlightOptionChanged = false;
        }
    }

    writeValue(value: any): void {
        this.value = value;
        this.filled = this.value && this.value != '';
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

    onInput(event) {
        let value = event.target.value;
        if (!this.multiple) {
            this.value = value;
            this.onModelChange(value);
        }

        if (value.length === 0) {
            this.hide();
        }

        if (value.length >= this.minLength) {
            //Cancel the search request if user types within the timeout
            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                this.search(event, value);
            }, this.delay);
        }
        else {
            this.suggestions = null;
        }
        this.updateFilledState();
    }

    search(event: any, query: string) {
        //allow empty string but not undefined or null
        if (query === undefined || query === null) {
            return;
        }

        this.completeMethod.emit({
            originalEvent: event,
            query: query
        });
    }

    selectItem(option: any) {
        if (this.multiple) {
            this.input.value = '';
            this.value = this.value || [];
            if (!this.isSelected(option)) {
                this.value = [...this.value, option];
                this.onModelChange(this.value);
            }
        }
        else {
            this.input.value = this.field ? this.objectUtils.resolveFieldData(option, this.field) : option;
            this.value = option;
            this.onModelChange(this.value);
        }

        this.onSelect.emit(option);

        //this.input.focus();
    }

    show() {
        if (!this.panelVisible && (this.focus || this.dropdownFocus)) {
            this.panelVisible = true;
            this.panel.style.zIndex = ++DomHandler.zindex;
            this.domHandler.fadeIn(this.panel, 200);
        }
    }

    align() {
        if (this.appendTo)
            this.domHandler.absolutePosition(this.panel, (this.multiple ? this.multipleContainer : this.input));
        else
            this.domHandler.relativePosition(this.panel, (this.multiple ? this.multipleContainer : this.input));
    }

    hide() {
        this.panelVisible = false;
    }

    handleDropdownClick(event) {
        this.onDropdownClick.emit({
            originalEvent: event,
            query: this.input.value
        });
    }

    removeItem(item: any) {
        let itemIndex = this.domHandler.index(item);
        let removedValue = this.value[itemIndex];
        this.value = this.value.filter((val, i) => i != itemIndex);
        this.onUnselect.emit(removedValue);
        this.onModelChange(this.value);
    }

    onKeydown(event) {
        if (this.panelVisible) {
            let highlightItemIndex = this.findOptionIndex(this.highlightOption);

            switch (event.which) {
                //down
                case 40:
                    if (highlightItemIndex != -1) {
                        var nextItemIndex = highlightItemIndex + 1;
                        if (nextItemIndex != (this.suggestions.length)) {
                            this.highlightOption = this.suggestions[nextItemIndex];
                            this.highlightOptionChanged = true;
                        }
                    }
                    else {
                        this.highlightOption = this.suggestions[0];
                    }

                    event.preventDefault();
                    break;

                //up
                case 38:
                    if (highlightItemIndex > 0) {
                        let prevItemIndex = highlightItemIndex - 1;
                        this.highlightOption = this.suggestions[prevItemIndex];
                        this.highlightOptionChanged = true;
                    }

                    event.preventDefault();
                    break;

                //enter
                case 13:
                    if (this.highlightOption) {
                        this.selectItem(this.highlightOption);
                        this.hide();
                    }
                    //event.preventDefault();
                    break;

                //escape
                case 27:
                    this.hide();
                    event.preventDefault();
                    break;
                //tab
                case 9:
                    if (this.highlightOption) {
                        this.selectItem(this.highlightOption);
                    }
                    this.hide();
                    break;
            }
        } else {
            if (event.which === 40 && this.suggestions) {
                this.search(event, event.target.value);
            }
        }

        if (this.multiple) {
            switch (event.which) {
                //backspace
                case 8:
                    if (this.value && this.value.length && !this.input.value) {
                        this.value = [...this.value];
                        let removedValue = this.value.pop();
                        this.onUnselect.emit(removedValue);
                        this.onModelChange(this.value);
                    }
                    break;
            }
        }
    }

    onKeyPress(event) {
        if (event.charCode == 13) {
            if (!this.highlightOption) {
                this.onEnter.emit();
                console.log(event);
            }
        }
    }

    onInputFocus(event) {
        this.focus = true;
        this.onFocus.emit(event);
    }

    onInputBlur(event) {
        this.focus = false;
        this.onModelTouched();
        this.onBlur.emit(event);
    }

    onDropdownFocus() {
        this.dropdownFocus = true;

        if (this.multiple)
            this.multiInputEL.nativeElement.focus();
        else
            this.inputEL.nativeElement.focus();
    }

    onDropdownBlur() {
        this.dropdownFocus = false;
    }

    isSelected(val: any): boolean {
        let selected: boolean = false;
        if (this.value && this.value.length) {
            for (let i = 0; i < this.value.length; i++) {
                if (this.objectUtils.equals(this.value[i], val, this.dataKey)) {
                    selected = true;
                    break;
                }
            }
        }
        return selected;
    }

    findOptionIndex(option): number {
        let index: number = -1;
        if (this.suggestions) {
            for (let i = 0; i < this.suggestions.length; i++) {
                if (this.objectUtils.equals(option, this.suggestions[i])) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    updateFilledState() {
        this.filled = this.input && this.input.value != '';
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }

        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.panel);
        }
    }

}

@NgModule({
    imports: [CommonModule, InputTextModule, ButtonModule, SharedPrimeModule],
    exports: [AutoComplete, SharedPrimeModule],
    declarations: [AutoComplete]
})
export class AutoCompleteServerModule { }