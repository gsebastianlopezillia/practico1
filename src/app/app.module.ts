import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CameraPreview } from '@ionic-native/camera-preview';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Device } from '@ionic-native/device'
import { AndroidFullScreen } from '@ionic-native/android-full-screen'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { EncuestaServiceProvider } from '../providers/encuesta-service/encuesta-service';
import { TapuyOpcionComponent } from '../components/tapuy-opcion/tapuy-opcion';
import { TapuyPreguntaComponent } from '../components/tapuy-pregunta/tapuy-pregunta';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TapuyOpcionComponent,
    TapuyPreguntaComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CameraPreview,
    EncuestaServiceProvider,
    NativeStorage,
    SQLite, 
    Device,
    AndroidFullScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    
  ]
})
export class AppModule {}
