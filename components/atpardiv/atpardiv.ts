import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    templateUrl: 'atpardiv.html',
    selector: 'atpar-div',
    //styleUrls: ['../../../Content/bootstrap.css']
    //<tr>< td colspan="3" >
    //<input type="button" id= "btnErpSystem" value= "Submit"  style= "float:initial" >
    //</td> </tr>
})
export class Atpardiv {

    @Input() configs: any[];
    @Input() uploadFlag: boolean = true;
	
    // @Input() name: string;
    //option: any;
    selectedValue: any = "";
    userSelectedFile: string;
    @Output() bindModelDataChange: EventEmitter<any> = new EventEmitter();
    @Output() fileUploadEvent: EventEmitter<any> = new EventEmitter();

    getData(option, event) {
        option.PARAMETER_VALUE = event.label
        //  debugger
        this.bindModelDataChange.emit(option);

    }
    onChange(option, event) {
        if (event != null && event != undefined) {
            option.PARAMETER_VALUE = event.value;
        }           
        this.bindModelDataChange.emit(option);
    }
    ontxtchange(option, event) {
       if (event != null && event != undefined) {
            option.PARAMETER_VALUE = event.trim();
        }
         
        this.bindModelDataChange.emit(option);
    }
    ontxtpwdchange(option) { 
        this.bindModelDataChange.emit(option);
    }
    onClick(option, event)
    {
        if (event != null && event != undefined)
        {
            option.PARAMETER_VALUE = event;
        }
       
      
        this.bindModelDataChange.emit(option);

    }

    change(option, event)
    {
        if (event != null && event != undefined) {
            option.PARAMETER_VALUE = event;
        }
         
        this.bindModelDataChange.emit(option);
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        this.userSelectedFile = event.target.files[0].name;
        this.fileUploadEvent.emit(event);
      
       // let fileList: FileList = event.target.files;
       //if (fileList.length > 0) {
       //     let file: File = fileList[0];
       //     let formData: FormData = new FormData();
       //     var listData = [];
       //     var obj = { FileName: file.name, File: file };
       //     listData.push(obj);

       //     formData.append('uploadFile', file, file.name);
       //     //let headers = new Headers();
       //     //headers.append('Authorization', 'bearer');
            //headers.append('enctype', 'multipart/form-data');
            //let options = new RequestOptions({ headers: headers });
            //let apiUrl = "/api/User/UploadCustomerLogo";

            //this.http.post(apiUrl, formData, options)
            //    .catch(error => Observable.throw(error))
            //    .map(res => res.json())
            //    .subscribe(
            //    (res) => {
                    
            //        console.log('success');
            //        if (res.Message == "Image Uploaded Successfully.") {
            //            this.blnFileUpload = false;
            //            this.msgs.push({ severity: 'success', summary: AtParConstants.GrowlTitle_Success, detail: res.Message });
            //        } else {
            //            this.blnFileUpload = true;
            //            this.msgs.push({ severity: 'error', summary: AtParConstants.GrowlTitle_Error, detail: res.Message });
            //        }
            //    },
            //    error => console.log(error)
            //    );
        //}
    }

}
