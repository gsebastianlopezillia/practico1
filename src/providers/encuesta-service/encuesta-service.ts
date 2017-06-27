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
    var url='http://192.168.0.61:8080/tapuy/device/getEncuesta?idDispositivo=1&fechaModificacion=01/02/2017';
    var respuesta = '';
    this.http.get(url).map(res=> res.json()).subscribe(res => console.log(res));
    

    this.http.get(url).map(res=> res.json()).subscribe(
      res => respuesta = res, 
      err=> console.log(err), 
      () => console.log('http.get exitoso')
      );
    
    return respuesta;
  }
}