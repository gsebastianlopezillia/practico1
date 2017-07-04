import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


/*
  Generated class for the PvdSqliteProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PvdSqliteProvider {


  constructor(public http: Http) {
    //console.log('Hello PvdSqliteProvider Provider');
  }
  public sqlite: SQLite;

  crearBase() {
    this.sqlite = new SQLite
    this.sqlite.create({
      name: 'tapuy.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('create table if not exists respuestaFormulario(idRespuesta INTEGER PRIMARY KEY AUTOINCREMENT, fecha DATE, foto STRING, idEncuesta INTEGER)', {})
          .then(() => console.log('Executed SQL: create respuestaFormulario'))
          .catch(e => console.log(e));
        db.executeSql('create table if not exists opciones(idRespuesta INTEGER REFERENCES respuestaFormulario(idRespuesta), idOpcion INTEGER)', {})
          .then(() => console.log('Executed SQL: create opciones'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  /*aGuardar: any = {
    foto: '',
    fecha: '',
    idDispositivo: '',
    idEncuesta: '',
    opciones: []
  };*/

  public add(obj) {
    var query1 = 'INSERT INTO respuestaFormulario(fecha, foto, idDispositivo, idEncuesta) VALUES(obj.fecha, obj.foto, obj.idDispositivo, obj.idEncuesta)';

    this.sqlite = new SQLite
    this.sqlite.create({
      name: 'tapuy.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(query1, {})
          .then(() => {
            console.log('Executed SQL: insercion datos encuesta');
            db.executeSql('SELECT MAX(idRespuesta) FROM respuestaFormulario', {})
              .then((idRes) => {
                for (var opc of obj.opciones) {
                  var query2 = 'INSERT INTO opciones(idRespuesta, idOpcion) VALUES(' + idRes.rows.item(0) + ',' + opc + ')';
                  db.executeSql(query2, {})
                    .then(() => console.log('Executed SQL: insercion opciones'))
                    .catch(e => console.log(e));
                }
              })
              .catch(e => console.log(e));
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }
}
