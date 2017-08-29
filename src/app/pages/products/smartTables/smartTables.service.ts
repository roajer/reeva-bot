import {Injectable} from '@angular/core';

@Injectable()
export class SmartTablesService {

  smartTableData = [
    {
      productName: 'Mark',
      productDesc: 'Otto',
      productURL: '@mdo',
      productTags: 'mdo@gmail.com'
    },


  ];


  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 2000);
    });
  }
}
