import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the EncuestaServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EncuestaServiceProvider {

  constructor(public http: Http) {

    console.log('Hello EncuestaServiceProvider Provider');
  }

  getJsonData(){
    return this.http.get('http://192.168.0.61/tapuy/device/getEncuesta?idDispositivo=1&fechaModificacion=01/02/2017').map(res=>res.json());
  }

}
