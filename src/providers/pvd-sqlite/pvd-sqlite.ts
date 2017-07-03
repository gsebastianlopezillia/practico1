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

  constructor(public http: Http, public sqlite: SQLite) {
    //console.log('Hello PvdSqliteProvider Provider');
  }

  crearBase() {
    this.sqlite = new SQLite
    this.sqlite.create({
      name: 'tapuy.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        //create table danceMoves(name VARCHAR(32))
        db.executeSql('create table if not exists respuestaFormulario(idRespuesta INTEGER PRIMARY KEY ASC, fecha DATE, foto STRING, idEncuesta INTEGER)', {})
          .then(() => console.log('Executed SQL: create respuestaFormulario'))
          .catch(e => console.log(e));
        db.executeSql('create table if not exists opciones(idRespuesta INTEGER REFERENCES respuestaFormulario(idRespuesta), idOpcion INTEGER)', {})
          .then(() => console.log('Executed SQL: create opciones'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

}
