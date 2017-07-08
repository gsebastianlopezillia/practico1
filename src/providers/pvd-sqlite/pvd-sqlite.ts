import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { PvdHttpProvider } from '../../providers/pvd-http/pvd-http';

import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


/*
  ORIGEN 
  https://github.com/kiranchenna/ionic-2-native-sqlite/blob/master/src/providers/data-base.ts
*/
@Injectable()
export class PvdSqliteProvider {
  private options = { name: "tapuy.db", location: 'default' };
  private queryCreateTableRespuestaForm = 'create table if not exists respuestaFormulario(idRespuesta INTEGER PRIMARY KEY AUTOINCREMENT, fecha STRING, foto STRING, idDispositivo INTEGER, idEncuesta INTEGER)';
  private queryCreateTableOpciones = 'create table if not exists opciones(idRespuesta INTEGER REFERENCES respuestaFormulario(idRespuesta), idOpcion INTEGER)';

  dbTapuy: SQLiteObject;

  constructor(public http: PvdHttpProvider, private sqlite: SQLite) {
    this.sqlite.create(this.options)
      .then((db: SQLiteObject) => {
        this.dbTapuy = db;
      })
  }

  crearBase() {
    return this.dbTapuy.executeSql(this.queryCreateTableRespuestaForm, [])
      .then(() => {//crea tabla respuestas
        this.dbTapuy.executeSql(this.queryCreateTableOpciones, [])
          .then(() => {//crea tabla opciones
            return Promise.resolve(console.log('**Tablas creadas con éxito**'));
          })
      })
  }

  insertRespuesta(obj) {
    console.log('obj sqlite service');
    console.log(obj);
    var query1 = 'INSERT INTO respuestaFormulario(fecha, foto, idDispositivo, idEncuesta) VALUES(obj.fecha, obj.foto, obj.idDispositivo, obj.idEncuesta)';
    //inserta respuesta
    console.log('INSERT-1');
    return this.dbTapuy.executeSql(query1, {})
      .then(insert1 => {
        if (insert1.rowsAfected == 0) {
          Promise.reject('Fallos insert');
        }
      })
      .catch(e => {
        console.log('e');
        console.log(e);
      })
  }


  insertRespuesta2(obj) {
    var query1 = 'INSERT INTO respuestaFormulario(fecha, foto, idDispositivo, idEncuesta) VALUES(obj.fecha, obj.foto, obj.idDispositivo, obj.idEncuesta)';
    //inserta respuesta
    console.log('INSERT-1');
    return this.dbTapuy.executeSql(query1, {})
      .then(res1 => {
        if (res1.rowsAfected == 0) {
          Promise.reject('**ERR - Insert Response**');
        }
        //busca último idRespuesta
        console.log('INSERT-2');
        this.dbTapuy.executeSql('SELECT MAX(idRespuesta) FROM respuestaFormulario', {})
          .then(res2 => {
            if (res2.rows.length == 0) {
              Promise.reject('**ERR - Selecting idResponse**')
            }
            console.log('INSERT-3');
            //inserta las opciones de la respuesta
            for (var opc of obj.opciones) {
              var query2 = 'INSERT INTO opciones(idRespuesta, idOpcion) VALUES(' + res2.rows.item(0) + ',' + opc + ')';
              this.dbTapuy.executeSql(query2, {})
                .then(res => {
                  console.log('INSERT-4' + res2.rows.item(0));
                  if (res.rowsAfected == 0) {
                    Promise.reject('**ERR - Inserting Option**')
                  }
                })
            }
          })
      })
      .catch(e => {
        console.log('Error en insert--');
        console.log(e);
        Promise.reject(e);
      })
  }

  /*insertRespuesta(respuesta) {
    let queryInsertRespuesta = 'INSERT INTO respuestaFormulario(fecha, foto, idDispositivo, idEncuesta) VALUES(?, ?, ?, ?)';
    let queryInsertOpcion = 'INSERT INTO opciones(idRespuesta, idOpcion) VALUES(?, ?)';
    let queryUltimoIdRespuesta = 'SELECT MAX(idRespuesta) data FROM respuestaFormulario';
    return this.sqlite.create(this.options)
      .then((db: SQLiteObject) => {
        db.executeSql(queryInsertRespuesta, [respuesta.fecha, respuesta.foto, respuesta.idDispositivo, respuesta.idEncuesta])
          .then(res0 => {
            console.log('INSERT-1');
            if (res0.rowsAfected == 0) {
              Promise.reject('**Fallo la inserción respuesta**');
            }

          })
          .then(res1 => {
            db.executeSql(queryUltimoIdRespuesta, [])
              .then(res2 => {
                console.log('INSERT-2');
                if (res2.rowsAfected == 0) {
                  Promise.reject('**Fallo select último idRespuesta**');
                }
                Promise.resolve(res2.rows.item(0).data);
              })
          })
          .then(res3 => {
            console.log('INSERT-3');
            for (var o = 0; o < respuesta.opciones.length; o++) {
              db.executeSql(queryInsertOpcion, [res3, respuesta.opciones[o]])
                .then(res => {
                  console.log('INSERT-4');
                  if (res.rowsAfected == 0) {
                    Promise.reject('**Fallo la inserción de opciones**');
                  }
                })
            }
          })
          .then(res => {
            console.log('INSERT-5');
            db.close()
              .then(res => {
                return Promise.resolve('**Respuesta almacenada**');
              })
          })
      })

      .catch(e => {
        console.log('Error: ' + e);
      });
  }*/

  ultimoIdRespuesta() {
    let queryUltimoIdRespuesta = 'SELECT MAX(idRespuesta) data FROM respuestaFormulario';
    return this.sqlite.create(this.options)
      .then((db: SQLiteObject) => {
        db.executeSql(queryUltimoIdRespuesta, [])
          .then(res => {
            let ultimoId = res.rows.item(0).data;
            db.close().then(res => {
              return Promise.resolve(ultimoId);
            }).catch(e => {
              return Promise.reject(e);
            })
          })
          .catch(e => {
            return Promise.reject(e);
          });
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }

  getAllRespuestas() {
    let getQuery = "SELECT * FROM respuestaFormulario ORDER BY idRespuesta DESC";
    return this.sqlite.create(this.options)
      .then((db: SQLiteObject) => {
        db.executeSql(getQuery, [])
          .then(res => {
            let respuestas = [];
            for (var i = 0; i < res.rows.length; i++) {
              respuestas.push(res.rows.item(i));
            }
            db.close()
              .then(res => { return Promise.resolve(respuestas); })
              .catch(e => { return Promise.reject(e) })
          })
          .catch(e => {
            return Promise.reject(e);
          });
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }

  getAllOpciones() {
    let getQuery = "SELECT * FROM opciones ORDER BY idRespuesta, idOpcion DESC";
    return this.sqlite.create(this.options)
      .then((db: SQLiteObject) => {
        db.executeSql(getQuery, [])
          .then(res => {
            let opciones = [];
            for (var i = 0; i < res.rows.length; i++) {
              opciones.push(res.rows.item(i));
            }
            db.close()
              .then(res => {
                return Promise.resolve(opciones);
              })
              .catch(e => {
                return Promise.reject(e);
              })

          })
          .catch(e1 => {
            return Promise.reject(e1);
          });
      })
      .catch(e2 => {
        return Promise.reject(e2);
      });
  }

  deleteRespuestas() {
    let deleteQuery = "DELETE FROM respuestaFormulario";
    return this.dbTapuy.executeSql(deleteQuery, [])
      .then(res => {
        this.dbTapuy.executeSql("DELETE FROM opciones", [])
          .then(res => {
            console.log('**Borrado de base exitoso**');
          })
      })
      .catch(e => {
        return Promise.resolve(e);
      });
  }

  findRespuestaById(id) {
    let getQuery = "SELECT * FROM respuestaFormulario WHERE idRespuesta = " + id;
    return this.sqlite.create(this.options)
      .then((db: SQLiteObject) => {
        db.executeSql(getQuery, [])
          .then(res => {
            db.close()
              .then(res => {
                return Promise.resolve(res);
              })
              .catch(e => {
                return Promise.reject(e);
              })
          })
          .catch(e1 => {
            return Promise.reject(e1);
          });
      })
      .catch(e2 => {
        return Promise.reject(e2);
      });
  }

  findOpcionesByRespuestaId(id) {
    let getQuery = "SELECT * FROM opciones WHERE idRespuesta = " + id;
    return this.sqlite.create(this.options)
      .then((db: SQLiteObject) => {
        db.executeSql(getQuery, [])
          .then(res => {
            db.close()
              .then(res => {
                return Promise.resolve(res);
              })
              .catch(e => {
                return Promise.reject(e);
              })
          })
          .catch(e1 => {
            return Promise.reject(e1);
          });
      })
      .catch(e2 => {
        return Promise.reject(e2);
      });
  }

  sincronizaRespuestas() {
    let postQuery = "SELECT * FROM respuestaFormulario WHERE idRespuesta IN (SELECT MIN(idRespuesta) FROM respuestaFormulario)";
    return this.sqlite.create(this.options)
      .then((db: SQLiteObject) => {//abre base
        db.executeSql(postQuery, [])
          .then(res => {//hace el select de postQuery
            if (res.rows.length > 0) {
              var respPSinc = res.rows.item(0);
              console.log('-----------------------------------------1');
              var queryOpciones = "SELECT idOpcion FROM opciones WHERE idRespuesta like " + respPSinc.idRespuesta;
              console.log('-----------------------------------------2');
              db.executeSql(queryOpciones, [])
                .then(res2 => {//hace select de queryOpciones
                  console.log('-----------------------------------------3');
                  var opciones = [];
                  for (var i = 0; i < res2.rows.length; i++) {
                    opciones.push(res2.rows.item(i).idOpcion);
                  }
                  console.log('-----------------------------------------4');
                  respPSinc.opciones = opciones;//objeto respuesta completo
                  console.log('Llama http con:');
                  console.log(respPSinc);
                  this.http.callPost3(respPSinc)
                    .then(res => {
                      console.log('-----------------------------------------5');
                      let respuestaServidor = res;
                      console.log('----------------------------respuestaServidor');
                      console.log(respuestaServidor);
                      if (respuestaServidor) {
                        let deleteOpQuery = "DELETE FROM opciones WHERE idRespuesta =" + respPSinc.idRespuesta;
                        let deleteResQuery = "DELETE FROM respuestaFormulario WHERE idRespuesta =" + respPSinc.idRespuesta;
                        db.executeSql(deleteOpQuery, [])
                          .then(res => {
                            db.executeSql(deleteResQuery, []).then(res => {
                              db.close()
                                .then(res => {
                                  Promise.resolve(console.log('Borrado de la respuesta exitoso.'))
                                })
                                .catch(e => {
                                  return Promise.reject(e);
                                })
                            }).catch(e => {
                              return Promise.reject(e);
                            });
                          })
                          .catch(e0 => {
                            return Promise.reject(e0);
                          });
                      } else {
                        db.close();
                      }
                    })
                    .catch(e1 => {
                      return Promise.reject(e1);
                    });
                })
                .catch(e2 => {
                  return Promise.reject(e2);
                })
            } else {
              db.close()
                .then(res => { Promise.resolve(console.log('**No se registran respuestas**')) })
                .catch(e => { return Promise.reject(e); })
            }
          })
          .catch(e3 => {
            return Promise.reject(e3);
          });
      })
      .catch(e4 => {
        return Promise.reject(e4);
      });
  }

  deleteByRespuestaId(id) {
    let deleteOpQuery = "DELETE FROM opciones WHERE idRespuesta =" + id;
    let deleteResQuery = "DELETE FROM respuestaFormulario WHERE idRespuesta =" + id;
    this.dbTapuy.executeSql(deleteOpQuery, [])
      .then(res => {
        this.dbTapuy.executeSql(deleteResQuery, []).then(res => {
          console.log('Borrado de la respuesta exitoso.')
        })
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }
}
