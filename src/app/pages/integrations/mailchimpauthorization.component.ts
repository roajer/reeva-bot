import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'mailchimp',
    template: '',
})

export class MailChimpComponent implements OnInit {
    constructor(private _router: ActivatedRoute) {
        console.log(this._router.snapshot);
        this._router.queryParams.subscribe(res => console.log(res));
    }

    ngOnInit() { }
}