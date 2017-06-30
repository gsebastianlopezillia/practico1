import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { PvdSqliteProvider } from '../providers/pvd-sqlite/pvd-sqlite';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = HomePage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    fullScreen: AndroidFullScreen,
    sqlite: PvdSqliteProvider
   ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.hide();
      fullScreen.immersiveMode();
      setTimeout(()=>{
        splashScreen.hide();
      }, 100);
      sqlite.crearBase();
    });
  }

}

