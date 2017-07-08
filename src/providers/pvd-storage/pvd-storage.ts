import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';


/*
  Generated class for the PvdStorageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PvdStorageProvider {

  constructor(public nativeStorage: NativeStorage) {
    //console.log('Hello PvdStorageProvider Provider');
  }

  //guarda una encuesta en el dispositivo
  setEncuesta(encuesta) {
    this.nativeStorage.remove('encuesta')
      .then(data => {
        this.nativeStorage.setItem('encuesta', { json: encuesta }).then(
          () => console.log('Encuesta en Storage'),
          err => console.error('Error storing item', err)
        );
      },
      err => console.log(err));
  }

  //obtiene la encuesta almacenada en el dispositivo
  getEncuesta() {
    return this.nativeStorage.getItem('encuesta')
      .then(data => {
        console.log(JSON.parse(JSON.stringify(data)));
        return Promise.resolve(JSON.parse(JSON.stringify(data)));
      })
  }

  //borra la encuesta almacenada en el dispositivo
  removeEncuesta() {
    return this.nativeStorage.remove('encuesta').then(
      data => console.log('Encuesta removida.'),
      err => console.log(err));
  }

}
