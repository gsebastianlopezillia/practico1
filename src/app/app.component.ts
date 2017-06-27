import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AndroidFullScreen } from '@ionic-native/android-full-screen'



import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = HomePage;
  sqlite: SQLite = null;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    fullScreen: AndroidFullScreen,
    sqlite: SQLite,
   ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.hide();
      splashScreen.hide();
      this.crearBase();
      fullScreen.immersiveMode();

    });
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
        db.executeSql('create table if not exists opciones(idRespuesta INTEGER REFERENCES tapuy.respuestaFormulario(idRespuesta), idOpcion INTEGER)', {})
          .then(() => console.log('Executed SQL: create opciones'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
    //hasta aca llegamos
  }
  
}

