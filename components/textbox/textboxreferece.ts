import { Component,Output,EventEmitter} from '@angular/core';
import { ATPAR_VALIDATION_RULES } from '../../entities/atpar_validation_rules';
//import { User } from './ATPAR_VALIDATION_RULES';

@Component({
    selector: 'my-app',
    template: `

<atpar-textbox  (bindModelDataChange)="bindModelDataChange($event)" [paramvalue]="username" [validationrules]="usr.Validations" [id]="First"></atpar-textbox>
<br/>
<atpar-textbox  (bindModelDataChange)="bindModelDataChange($event)" [paramvalue]="password" [validationrules] = "usr1.Validations" [id]="second"></atpar-textbox>
<br/>
<atpar-textbox  (bindModelDataChange)="bindModelDataChange($event)" [paramvalue]="sample"  [validationrules] = "usr2.Validations" [id]="Third"></atpar-textbox>
`
})
//[placeholder] = "placeholder1"[modelstring] = "modelstring1"
//[placeholder] = "placeholder"[modelstring] = "modelstring"

    //Need To Remove Later..
export class textboxReference {
    lstATPAR_VALIDATION_RULES: Array<ATPAR_VALIDATION_RULES>;
    EmailValidation: Array<ATPAR_VALIDATION_RULES>;
    Test: Array<ATPAR_VALIDATION_RULES>;

    username: string = "userName";
    password: string = "Password";
    sample: string = "sample";
    usr: User;
    usr1: User;
    usr2: User;

    First: string = "TextFirst";
    second: string = "TextSecond";
    Third: string = "Textthird";

    //harika
    placeholder: string = "UserName";
    placeholder1: string = "Password";
    modelstring: string = "UserID";
    modelstring1: string = "Pwd";

    constructor() {

        this.usr = new User();
        this.usr1 = new User();
        this.usr2 = new User();

        //validations for First TextBox
        this.lstATPAR_VALIDATION_RULES = new Array<ATPAR_VALIDATION_RULES>();

        let requiredvalidatainrule = new ATPAR_VALIDATION_RULES();
        requiredvalidatainrule.order = 1;
        requiredvalidatainrule.status = false;
        requiredvalidatainrule.ValidationType = "Mandatory";
        requiredvalidatainrule.validationFormat = "";
        requiredvalidatainrule.ErrorMessage = "This Field is Required";
        requiredvalidatainrule.showDiv = true;

        let Minvalidatainrule = new ATPAR_VALIDATION_RULES();
        Minvalidatainrule.order = 2;
        Minvalidatainrule.status = false;
        Minvalidatainrule.ValidationType = "Min";
        Minvalidatainrule.validationFormat = "2";
        Minvalidatainrule.ErrorMessage = "Minimum length Should be 2 Characters";
        Minvalidatainrule.showDiv = true;

        let Maxvalidatainrule = new ATPAR_VALIDATION_RULES();
        Maxvalidatainrule.order = 3;
        Maxvalidatainrule.status = false;
        Maxvalidatainrule.ValidationType = "Max";
        Maxvalidatainrule.validationFormat = "5";
        Maxvalidatainrule.ErrorMessage = "Maximum length Should be 5 Characters";
        Maxvalidatainrule.showDiv = true;

        let Numericvalidatainrule = new ATPAR_VALIDATION_RULES();
        Numericvalidatainrule.order = 4;
        Numericvalidatainrule.status = false;
        Numericvalidatainrule.ValidationType = "Numeric";
        Numericvalidatainrule.validationFormat = "en-AU";
        Numericvalidatainrule.ErrorMessage = "Allows Only Numbers";
        Numericvalidatainrule.showDiv = true;

        this.lstATPAR_VALIDATION_RULES.push(requiredvalidatainrule);
        this.lstATPAR_VALIDATION_RULES.push(Minvalidatainrule);
        this.lstATPAR_VALIDATION_RULES.push(Maxvalidatainrule);
        this.lstATPAR_VALIDATION_RULES.push(Numericvalidatainrule);

        this.usr.Validations = this.lstATPAR_VALIDATION_RULES;



        //validations for second TextBox
        this.EmailValidation = new Array<ATPAR_VALIDATION_RULES>();

        let Emailvalidatainrule2 = new ATPAR_VALIDATION_RULES();
        Emailvalidatainrule2.order = 4;
        Emailvalidatainrule2.status = false;
        Emailvalidatainrule2.ValidationType = "Email";
        Emailvalidatainrule2.validationFormat = "";
        Emailvalidatainrule2.ErrorMessage = "Email Validation";
        Emailvalidatainrule2.showDiv = true;

        let requiredvalidatainrule1 = new ATPAR_VALIDATION_RULES();
        requiredvalidatainrule1.order = 1;
        requiredvalidatainrule1.status = false;
        requiredvalidatainrule1.ValidationType = "Mandatory";
        requiredvalidatainrule1.validationFormat = "";
        requiredvalidatainrule1.ErrorMessage = "This Field is Required";
        requiredvalidatainrule1.showDiv = true;


        this.EmailValidation.push(requiredvalidatainrule1);
        this.EmailValidation.push(Emailvalidatainrule2);

        this.usr1.Validations = this.EmailValidation;

        //validations for third TextBox

        this.Test = new Array<ATPAR_VALIDATION_RULES>();
        let Digitvalidatainrule = new ATPAR_VALIDATION_RULES();
        Digitvalidatainrule.order = 4;
        Digitvalidatainrule.status = false;
        Digitvalidatainrule.ValidationType = "Digit";
        Digitvalidatainrule.validationFormat = "";
        Digitvalidatainrule.ErrorMessage = "Digit Validation";
        Digitvalidatainrule.showDiv = true;

        let numbervalidatainrule = new ATPAR_VALIDATION_RULES();
        numbervalidatainrule.order = 4;
        numbervalidatainrule.status = false;
        numbervalidatainrule.ValidationType = "Number";
        numbervalidatainrule.validationFormat = "";
        numbervalidatainrule.ErrorMessage = "Number Validation";
        numbervalidatainrule.showDiv = true;

        let urlvalidatainrule = new ATPAR_VALIDATION_RULES();
        urlvalidatainrule.order = 4;
        urlvalidatainrule.status = false;
        urlvalidatainrule.ValidationType = "URL";
        urlvalidatainrule.validationFormat = "";
        urlvalidatainrule.ErrorMessage = "URL Validation";
        urlvalidatainrule.showDiv = true;

        let datevalidatainrule = new ATPAR_VALIDATION_RULES();
        datevalidatainrule.order = 4;
        datevalidatainrule.status = false;
        datevalidatainrule.ValidationType = "Date";
        datevalidatainrule.validationFormat = "";
        datevalidatainrule.ErrorMessage = "Date Validation";
        datevalidatainrule.showDiv = true;

        let mindatevalidatainrule = new ATPAR_VALIDATION_RULES();
        mindatevalidatainrule.order = 4;
        mindatevalidatainrule.status = false;
        mindatevalidatainrule.ValidationType = "MinDate";
        mindatevalidatainrule.validationFormat = "2016-09-09";
        mindatevalidatainrule.ErrorMessage = "Minimum Date Validation";
        mindatevalidatainrule.showDiv = true;

        let maxdatevalidatainrule = new ATPAR_VALIDATION_RULES();
        maxdatevalidatainrule.order = 4;
        maxdatevalidatainrule.status = false;
        maxdatevalidatainrule.ValidationType = "MaxDate";
        maxdatevalidatainrule.validationFormat = "2017-03-06";
        maxdatevalidatainrule.ErrorMessage = "Maximum Date Validation";
        maxdatevalidatainrule.showDiv = true;

        let equalvalidatainrule = new ATPAR_VALIDATION_RULES();
        equalvalidatainrule.order = 4;
        equalvalidatainrule.status = false;
        equalvalidatainrule.ValidationType = "Equal";
        equalvalidatainrule.validationFormat = "XXX";
        equalvalidatainrule.ErrorMessage = "equalValidation";
        equalvalidatainrule.showDiv = true;

        let rangevalidatainrule1 = new ATPAR_VALIDATION_RULES();
        rangevalidatainrule1.order = 4;
        rangevalidatainrule1.status = false;
        rangevalidatainrule1.ValidationType = "Range";
        rangevalidatainrule1.validationFormat = [0, 7];
        rangevalidatainrule1.ErrorMessage = "Range Validation";
        rangevalidatainrule1.showDiv = true;


        this.Test.push(urlvalidatainrule);
        this.Test.push(Digitvalidatainrule);
        this.Test.push(numbervalidatainrule);
        this.Test.push(datevalidatainrule);
        this.Test.push(mindatevalidatainrule);
        this.Test.push(maxdatevalidatainrule);
        this.Test.push(equalvalidatainrule);
        this.Test.push(rangevalidatainrule1);

        this.usr2.Validations = this.Test;

    }

    bindModelDataChange(event: any) {
        if ("userName" == event.paramName.toString()) {
            this.usr.userName = event.val;
        }
        if ("Password" == event.paramName.toString()) {
            this.usr.Password = event.val;
        }
    }

}

export class User {
    userName: string;
    Password: string;
    Validations: ATPAR_VALIDATION_RULES[];
}
