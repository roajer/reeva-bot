import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  Http,
  Request,
  Response,
  Headers,
  RequestMethod,
  RequestOptions
} from '@angular/http';
import 'rxjs';

@Injectable()
export class HttpService {

  constructor(private http: Http) {}

  httpRequest(requestObject: any) {
    const request = this.requestBuilder(requestObject);
    return this.http.request(request)
      .map(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.log('----- HTTP - Error -----', error);
    return Observable.throw(error || { '_body': 'Server error' });
  }

  private requestBuilder(requestObject: any): Request {
    let method: RequestMethod;
    switch (requestObject.method) {
      case 'GET':
        method = RequestMethod.Get;
        break;
      case 'POST':
        method = RequestMethod.Post;
        break;
      case 'PUT':
        method = RequestMethod.Put;
        break;
      case 'DELETE':
        method = RequestMethod.Delete;
        break;
      default:
        throw new Error('Property `method` is required for `http request`');
    }

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('Accept-Encoding', 'utf-8');
    const data = Object.assign({}, requestObject.data);
    const request: Object = {
      method: method,
      url: requestObject.url,
      headers: headers,
      body: JSON.stringify(requestObject.data)
    };

    return new Request(new RequestOptions(request));
  }

}
