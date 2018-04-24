import {
    NgModule, Component, ElementRef, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, DoCheck, OnDestroy, Input, Output, Renderer, EventEmitter, ContentChildren,
    QueryList, ViewChild, TemplateRef, IterableDiffers, forwardRef, trigger, state, style, transition, animate, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectItem } from '../common/api';
import { SharedPrimeModule, PrimeTemplate } from '../common/sharedComponent';
import { DomHandler } from './../../common/dom/domhandler';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const DROPDOWN_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownInGrid),
    multi: true
};

@Component({
    selector: 'atpar-select-grid',
    templateUrl: 'dropdown.html',
    styleUrls: ['dropdown.css'],
    animations: [
        trigger('panelState', [
            state('hidden', style({
                opacity: 0
            })),
            state('visible', style({
                opacity: 1
            })),
            transition('visible => hidden', animate('400ms ease-in')),
            transition('hidden => visible', animate('400ms ease-out'))
        ])
    ],

    providers: [DomHandler, DROPDOWN_VALUE_ACCESSOR]
})
export class DropdownInGrid implements OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, DoCheck, OnDestroy, ControlValueAccessor {

    @Input() options: any;

    @Input() scrollHeight: string = '200px';

    @Input() filter: boolean;

    @Input() style: any;

    @Input() panelStyle: any;

    @Input() styleClass: string;

    @Input() panelStyleClass: string;

    @Input() disabled: boolean;

    @Input() readonly: boolean;

    @Input() autoWidth: boolean = true;

    @Input() required: boolean = false;

    @Input() isfocus: boolean;

    @Input() editable: boolean;

    @Input() appendTo: any;

    @Input() tabindex: number;

    @Input() SelectedLabel: any;
    @Input() id: string;
    @Input() modelstring: any;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    @Output() onFocus: EventEmitter<any> = new EventEmitter();

    @Output() onBlur: EventEmitter<any> = new EventEmitter();

    @ViewChild('container') containerViewChild: ElementRef;

    @ViewChild('panel') panelViewChild: ElementRef;

    @ViewChild('itemswrapper') itemsWrapperViewChild: ElementRef;

    @ViewChild('filter') filterViewChild: ElementRef;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    public itemTemplate: TemplateRef<any>;

    selectedOption: SelectItem;

    value: any;

    onModelChange: Function = () => { };

    onModelTouched: Function = () => { };

    optionsToDisplay: SelectItem[];

    hover: boolean;

    focus: boolean;

    differ: any;

    public optionL: number;

    searchedvalue: string = "";

    public panelVisible: boolean = false;

    public documentClickListener: any;

    public optionsChanged: boolean;

    public panel: HTMLDivElement;

    public container: HTMLDivElement;

    public itemsWrapper: HTMLDivElement;

    public initialized: boolean;

    public selfClick: boolean;

    public itemClick: boolean;

    public hoveredItem: any;

    public selectedOptionUpdated: boolean;
    filtervalue: string;

    xReq: boolean;

    index: number = -1;
    isfltered: boolean = false;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, differs: IterableDiffers, private cd: ChangeDetectorRef) {
        this.differ = differs.find([]).create(null);
    }

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

    ngOnInit() {

        if (this.options != null) {
            this.optionsToDisplay = new Array<SelectItem>();
            if (typeof this.options == "string") {
                if (this.options.indexOf(',') > 0) {
                    for (let x = 0; x < this.options.split(',').length; x++) {
                        this.optionsToDisplay.push({ value: this.options.split(',')[x].trim(), label: this.options.split(',')[x].trim() });
                    }
                } else {
                    this.optionsToDisplay.push({ value: this.options, label: this.options });
                }
            } else {
                this.optionsToDisplay = this.options;
            }
            this.options = this.optionsToDisplay;
            if (this.SelectedLabel != null) {
                var fitem = this.optionsToDisplay.filter(x => x.label.trim() == this.SelectedLabel.trim());
                if (fitem != null && fitem.length > 0) {
                    this.updateSelectedOption(fitem[0].value)
                } else {
                    this.updateSelectedOption(null);
                }
            } else {
                this.updateSelectedOption(null);
            }
        }
    }

    ngDoCheck() {
        let changes = this.differ.diff(this.options);
        if (changes && this.initialized) {
            this.optionsToDisplay = this.options;
            this.updateSelectedOption(this.value);
            this.optionsChanged = true;
        }
    }

    ngAfterViewInit() {
        this.container = <HTMLDivElement>this.containerViewChild.nativeElement;
        this.panel = <HTMLDivElement>this.panelViewChild.nativeElement;
        this.itemsWrapper = <HTMLDivElement>this.itemsWrapperViewChild.nativeElement;
        this.xReq = this.required;
        let id1 = this.id;
        if (this.xReq == true) {
            // document.getElementById(this.id).classList.add('bdr-red');
            // document.getElementById(this.id).classList.add('');
            var node = document.createElement("span");
            node.setAttribute("class", "text-danger grid-mandatory");
            var textnode = document.createTextNode("*");
            var sp2 = document.getElementById(this.id);
            var parentDiv = sp2.parentNode;
            node.appendChild(textnode);
            // document.getElementById(this.id).classList.add('bdr-red');
            document.getElementById(this.id).appendChild(node);
            parentDiv.insertBefore(node, sp2);
            console.log(this.id);
        }
        else {
            // document.getElementById(this.container.id).classList.add('bdr-purple');
            var node = document.createElement("span");
            node.setAttribute("class", "grid-mandatory-white");
            var textnode = document.createTextNode("*");
            var sp2 = document.getElementById(this.id);
            var parentDiv = sp2.parentNode;
            node.appendChild(textnode);
            // document.getElementById(this.id).classList.add('bdr-red');
            document.getElementById(this.id).appendChild(node);
            parentDiv.insertBefore(node, sp2);
        }
        this.updateDimensions();
        this.initialized = true;

        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.panel);
            else
                this.domHandler.appendChild(this.panel, this.appendTo);
        }

        if (this.isfocus == true) {
            this.focus = true;
            document.getElementById("txt" + this.id).focus();
        }

    }

    get label(): string {
        return (this.editable && this.value) ? this.value : (this.selectedOption ? this.selectedOption.label : null);
    }

    onItemClick(event, option) {
        this.itemClick = true;
        this.selectItem(event, option);

        this.hide();
    }

    selectItem(event, option) {
        this.selectedOption = option;
        this.value = option.value;

        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value,
            label: this.label
        });
        if (this.filter) {
            (<HTMLInputElement>document.getElementById(this.id + 'txtDDSearch')).value = '';
            this.filetOptionsByInput('');
        }
    }

    ngAfterViewChecked() {
        if (this.optionsChanged) {
            //this.domHandler.relativePosition(this.panel, this.container);
            this.optionsChanged = false;
        }

        if (this.selectedOptionUpdated && this.itemsWrapper) {
            let selectedItem = this.domHandler.findSingle(this.panel, 'li.ui-state-highlight');
            if (selectedItem) {
                this.domHandler.scrollInView(this.itemsWrapper, this.domHandler.findSingle(this.panel, 'li.ui-state-highlight'));
            }
            this.selectedOptionUpdated = false;
        }
    }

    writeValue(value: any): void {
        this.value = value;
        this.updateSelectedOption(value);
        this.cd.markForCheck();
    }

    updateSelectedOption(val: any): void {
        this.selectedOption = this.findOption(val, this.optionsToDisplay);
        if (!this.selectedOption && this.optionsToDisplay && this.optionsToDisplay.length && !this.editable) {
            this.selectedOption = this.optionsToDisplay[0];
        }
        this.selectedOptionUpdated = true;
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

    updateDimensions() {
        if (this.autoWidth) {
            let select = this.domHandler.findSingle(this.el.nativeElement, 'select');
            if (!this.style || (!this.style['width'] && !this.style['min-width'])) {
                this.el.nativeElement.children[0].style.width = 100 + '%';
            }
        }
    }

    onMouseclick(event, input) {
        if (this.disabled || this.readonly) {
            return;
        }


        this.selfClick = true;

        if (!this.itemClick) {
            input.focus();

            if (this.panelVisible)
                this.hide();
            else {
                this.show(this.panel, this.container);

                if (this.filterViewChild != undefined) {
                    setTimeout(() => {
                        this.filterViewChild.nativeElement.focus();
                    }, 200);
                }
            }
        }
    }

    onEditableInputClick(event) {
        this.itemClick = true;
        this.bindDocumentClickListener();
    }

    onEditableInputFocus(event) {
        this.focus = true;
        this.hide();
    }

    onEditableInputChange(event) {
        this.value = event.target.value;
        this.updateSelectedOption(this.value);
        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
    }

    show(panel, container) {

        this.searchedvalue = "";
        this.filetOptionsByInput(this.searchedvalue);


        if (this.options && this.options.length) {
            this.panelVisible = true;
            panel.style.zIndex = ++DomHandler.zindex;
            this.optionL = 15 + (this.options.length * 18);
            if (this.optionL > 200) {
               
                this.optionL = 200;
            }
            if (this.domHandler.isIE()) {
                panel.style.zIndex = DomHandler.zindex;
            }
            if (this.appendTo)
                this.domHandler.absolutePosition(panel, container);
            else
                this.domHandler.relativePosition2(panel, container, this.optionL);

            this.bindDocumentClickListener();
        }
    }

    hide() {
        this.panelVisible = false;
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

    onKeydown(event) {

        if (this.readonly) {
            return;
        }


        if (this.optionsToDisplay.length == 1) {
            this.selectedOption = this.optionsToDisplay[0];

        }


        let selectedItemIndex = this.selectedOption ? this.findOptionIndex(this.selectedOption.value, this.optionsToDisplay) : -1;

        switch (event.which) {

            //down
            case 40:
                if (!this.panelVisible && event.altKey) {
                    this.show(this.panel, this.container);
                }
                else {


                    //end position need to select option
                    let myindexposition = this.optionsToDisplay.length - 1;

                    if (selectedItemIndex == myindexposition) {
                        selectedItemIndex = -1;
                    }


                    if (selectedItemIndex != -1) {
                        let nextItemIndex = selectedItemIndex + 1;

                        this.selectedOption = this.optionsToDisplay[nextItemIndex];
                        this.selectedOptionUpdated = true;

                        ////0030521
                        //this.selectItem(event, this.selectedOption);
                    }
                    else if (this.optionsToDisplay) {
                        this.selectedOption = this.optionsToDisplay[0];

                        if (this.selectedOption == null || this.selectedOption == undefined) {
                            this.selectedOption = this.options[0];;
                        }

                        ////0030521
                        //this.selectItem(event, this.selectedOption);
                    }
                }

                event.preventDefault();

                break;

            //up
            case 38:
                if (selectedItemIndex > 0) {
                    let prevItemIndex = selectedItemIndex - 1;
                    this.selectedOption = this.optionsToDisplay[prevItemIndex];
                    this.selectedOptionUpdated = true;

                }

                event.preventDefault();
                break;


            //enter
            case 13:
                if (!this.panelVisible && event.altKey) {
                    this.show(this.panel, this.container);
                }
                else {
                    if (selectedItemIndex != -1) {
                        let nextItemIndex = selectedItemIndex;

                        this.selectedOption = this.optionsToDisplay[nextItemIndex];
                        this.selectedOptionUpdated = true;
                        this.selectItem(event, this.selectedOption);
                        this.hide();
                    }
                    else if (this.optionsToDisplay) {
                        this.selectedOption = this.optionsToDisplay[0];
                        if (this.selectedOption == null || this.selectedOption == undefined) {
                            this.selectedOption = this.options[0];
                        }

                        this.selectItem(event, this.selectedOption);
                    }
                }

                event.preventDefault();

                break;



            //escape and tab
            case 27:
                if (!this.panelVisible && event.altKey) {
                    this.show(this.panel, this.container);
                }
                else {
                    if (selectedItemIndex != -1) {

                        this.selectedOption = this.optionsToDisplay[selectedItemIndex];
                        this.selectedOptionUpdated = true;
                        this.selectItem(event, this.selectedOption);
                        this.hide();
                        this.filtervalue = null;

                    }
                    else if (this.optionsToDisplay) {
                        this.selectedOption = this.optionsToDisplay[0];
                        this.selectItem(event, this.selectedOption);
                    }
                }



                break;


            case 9:
                if (!this.panelVisible && event.altKey) {
                    this.show(this.panel, this.container);
                }
                else {
                    if (selectedItemIndex != -1) {

                        this.selectedOption = this.optionsToDisplay[selectedItemIndex];
                        this.selectedOptionUpdated = true;
                        this.selectItem(event, this.selectedOption);
                        this.hide();
                        this.filtervalue = null;
                    }
                    else if (this.optionsToDisplay) {
                        this.selectedOption = this.optionsToDisplay[0];
                        this.selectItem(event, this.selectedOption);
                    }
                }



                break;

        }



    }

    findListItem(element) {
        if (element.nodeName == 'LI') {
            return element;
        }
        else {
            let parent = element.parentElement;
            while (parent.nodeName != 'LI') {
                parent = parent.parentElement;
            }
            return parent;
        }
    }
    keyedval: any;
    onKey(event) {
        let xx = this.keyedval;
        console.log(xx);
        let val = event.key.toLowerCase();
        let enteredItemIndex = this.findOptions(event.key.toLowerCase(), this.optionsToDisplay)
        if (enteredItemIndex != -1) {
            let nextItemIndex = enteredItemIndex;
            if (nextItemIndex != (this.optionsToDisplay.length)) {
                this.selectedOption = this.optionsToDisplay[nextItemIndex];
                this.selectedOptionUpdated = true;
                this.selectItem(event, this.selectedOption);
            }
        }
       

    }



    /**
     * /
     search item  based on keypress
     */
    onKeypress(event) {
        let val = event.key.toLowerCase();
        let enteredItemIndex = this.findOptions(event.key.toLowerCase(), this.optionsToDisplay)
        if (enteredItemIndex != -1) {
            let nextItemIndex = enteredItemIndex;
            if (nextItemIndex != (this.optionsToDisplay.length)) {
                this.selectedOption = this.optionsToDisplay[nextItemIndex];
                this.selectedOptionUpdated = true;
                this.selectItem(event, this.selectedOption);
            }
        }
       
    }


    findOptions(val: any, opts: SelectItem[]): number {
        let targetindex: number = -1;
        let loopCount = 0;
        if (opts) {
            for (let i = 0; i <= opts.length; i++) {
                targetindex = i;
                if (targetindex == opts.length) {
                    if (loopCount == 0) {
                        targetindex = -1;
                        break;
                    }
                    else if (this.index != -1) {
                        this.index = -1;
                        i = 0;
                        loopCount = 0;
                        targetindex = 0;
                    }
                }
                if ((opts[i].label.toLowerCase().substr(0, val.length) == val) == true) {
                    loopCount++;
                    if (!(this.index == targetindex) && (targetindex > this.index)) {
                        this.index = targetindex;
                        break;
                    }
                }
            }
        }
        return targetindex;
    }
    /**
     * /
    end: search item  based on keypress
     */


    findOptionIndex(val: any, opts: SelectItem[]): number {
        let index: number = -1;
        if (opts) {
            for (let i = 0; i < opts.length; i++) {
                if ((val == null && opts[i].value == null) || this.domHandler.equals(val, opts[i].value)) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    findOption(val: any, opts: SelectItem[]): SelectItem {
        let index: number = this.findOptionIndex(val, opts);
        return (index != -1) ? opts[index] : null;
    }


    onFilter(event): void {
        let val = event.target.value.toLowerCase();
        this.filetOptionsByInput(val);
        this.searchedvalue = val;

    }

    filetOptionsByInput(val: string) {

        this.filtervalue = val;


        if (this.options && this.options.length) {
            this.optionsToDisplay = [];
            for (let i = 0; i < this.options.length; i++) {
                let option = this.options[i];
                if (option.label.toLowerCase().substring(0, val.length) === val) {
                    this.optionsToDisplay.push(option);
                }
            }

            this.optionsChanged = true;
        }
    }


    applyFocus(): void {
        if (this.editable)
            this.domHandler.findSingle(this.el.nativeElement, '.ui-dropdown-label.ui-inputtext').focus();
        else
            this.domHandler.findSingle(this.el.nativeElement, 'input[readonly]').focus();
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
                if (!this.selfClick && !this.itemClick) {
                    this.panelVisible = false;
                    this.unbindDocumentClickListener();
                }

                this.selfClick = false;
                this.itemClick = false;
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }

    ngOnDestroy() {
        this.initialized = false;

        this.unbindDocumentClickListener();

        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.panel);
        }
    }
}

@NgModule({
    imports: [CommonModule, SharedPrimeModule],
    exports: [DropdownInGrid, SharedPrimeModule],
    declarations: [DropdownInGrid]
})
export class DropdownInGridModule { }