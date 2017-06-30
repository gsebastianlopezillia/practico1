import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { PvdStorageProvider } from '../../providers/pvd-storage/pvd-storage';

/*
  Generated class for the PvdHttpProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PvdHttpProvider {

  constructor(public http: Http, public pdvStorage: PvdStorageProvider) {
    console.log('Hello PvdHttpProvider Provider');
  }

  getJsonData() {
    /*editar campo url con la definitiva*/
    //var url = 'http://192.168.0.59:8080/tapuy/device/getEncuesta?idDispositivo=42&fechaModificacion=01/02/2017';
    var url = 'http://192.168.0.61:8080/tapuy/device/getEncuesta?idDispositivo=32&fechaModificacion=01/02/2017';
    var respuesta;
    this.http.get(url).map(res => res.json()).subscribe(
      data => {
        respuesta = JSON.parse(JSON.stringify(data));
      },
      err => console.log("Fallo la comunicacioón co el servidor"),
      () => this.pdvStorage.setEncuesta(respuesta)
    );
    return respuesta;
  }
}
