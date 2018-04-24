import { Component, OnInit, EventEmitter, Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Employee } from './employee';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { DomHandler } from '../../common/dom/domhandler';
@Injectable()
export class datatableservice {
    public headers: Headers;
    constructor(private http: Http) {

    }
   

    getdetails() {
        return this.http.get("./src/app/components/datatable/Employee.json")
            .toPromise()
            .then(res => <Employee[]>res.json())
            .then(data => { return data; });
    }
    getBunits() {
        return this.http.get("./app/components/datatable/Employee.json")
            .toPromise()
            .then(res => <Employee[]>res.json())
            .then(data => { return data; });
    }

    adddetails(ven) {
       
        var headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        this.http.post('http://localhost/datatableapi/api/Employee/Addemployee', JSON.stringify(ven), { headers: headers }).subscribe();
    }
    deletedetails(id: string) {

        return this.http.delete("http://localhost/datatableapi/api/Employee/Delete?id=" + id, { headers: this.headers })
            .toPromise()
             .then(() => null);
    }
    

}

