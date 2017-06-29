import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

/*
  Generated class for the EncuestaServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EncuestaServiceProvider {

  constructor(public http: Http, public nativeStorage: NativeStorage) {
    console.log('Hello EncuestaServiceProvider Provider');
  }

  getJsonData(){
    /*editar campo url con la definitiva*/
    var url='http://192.168.0.61:8080/tapuy/device/getEncuesta?idDispositivo=1&fechaModificacion=01/02/2017';
    var respuesta;
    this.http.get(url).map(res => res.json()).subscribe(
      data => {
              respuesta = JSON.parse(JSON.stringify(data));
            }, 
      err=> console.log(err), 
      () => this.removeEncuesta(respuesta)
    );
    return respuesta;
  }
  /*NATIVE-STORAGE*/
  setEncuesta = function(encuesta) {
    this.nativeStorage.setItem('encuesta',  { json: encuesta } ).then(
      () => console.log('Encuesta en Storage'),
      err => console.error('Error storing item', err)
      );
  }

  removeEncuesta = function(encuesta2) {
    this.nativeStorage.remove('encuesta').then(
      data => {
        console.log('Registro limpio');
        this.setEncuesta(encuesta2);
      },
      err => console.log(err)
    )
  }
}