import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable() export class ConfirmDialogService {  
    private subject = new Subject<any>();  
    constructor() { }  
    confirmThis(message: string, siFn: () => void, noFn: () => void) {  
        this.setConfirmation(message, siFn, noFn);  
    }  
    setConfirmation(message: string, siFn: () => void, noFn: () => void) {  
        let that = this;  
        this.subject.next({  
            type: "confirm",  
            text: message,  
            siFn:  
                function () {  
                    that.subject.next(); //this will close the modal  
                    siFn();  
                },  
            noFn: function () {  
                that.subject.next();  
                noFn();  
            }  
        });  
  
    }  
  
    getMessage(): Observable<any> {  
        return this.subject.asObservable();  
    }  
}  