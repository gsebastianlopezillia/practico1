import { Component } from '@angular/core';
import { NavController, Platform} from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Device } from '@ionic-native/device'
import { NativeStorage } from '@ionic-native/native-storage';
import { EncuestaServiceProvider } from '../../providers/encuesta-service/encuesta-service';
import { TapuyPreguntaComponent } from '../../components/tapuy-pregunta/tapuy-pregunta';



declare let KioskPlugin: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [EncuestaServiceProvider]
})

export class HomePage {
/*DECLARE-ZONE-----------------------------------------------------------*/
  picture : String;
  uuid : String;
  botonName : String = 'false';
  encuesta: any;
  preguntaActual: any;
  // picture options
  private pictureOpts: CameraPreviewPictureOptions = {
    width: 1000,
    height: 1000,
    quality: 10
  };
  // camera options (Size and location). In the following example, the preview
  // uses the rear camera and display the preview in the back of the webview
  private cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height,
    camera: 'front',
    tapPhoto: false,
    previewDrag: false,
    toBack: true,
    alpha: 1
  };
/*CONSTRUCTOR------------------------------------------------------------*/
  constructor(public navCtrl: NavController,
              private cameraPreview: CameraPreview,
              public platform: Platform,
              public sqlite: SQLite,
              public nativeStorage: NativeStorage,
              public encuestaService: EncuestaServiceProvider,
              private device: Device) {
      platform.ready().then(() => {
        this.getEncuesta();
        this.setUuid();
      });
  }
/*LOGICA-----------------------------------------------------------------*/


  cargaTemplate1(){
    //busco la primer pregunta
    var pregunta1 = JSON.parse(JSON.stringify(this.encuesta.json.preguntas))
      .map( objeto => {return objeto;}, err => console.log(err))
      .filter( objeto2 => { return objeto2.inicial == true;}, err => console.log(err))[0];
      //Ejemplo: {id: 1, pregunta: "Como...?", opciones: Array[3], inicial: true}
    this.preguntaActual = new TapuyPreguntaComponent()
  }

  cargaOpcionesTemplate(){

  }
/*CAMERA-----------------------------------------------------------------*/
  //toma foto
  getPicture(){
    this.cameraPreview.takePicture(this.pictureOpts).then(
      (imageData) => { this.picture = 'data:image/jpeg;base64,' + imageData; },//NO TOCAR
      (err) => { console.log(err); });
  }

  //abre octurador
  openCamera(){
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
      (res) => { this.getPicture(); },
      (err) => { console.log('Fail preview: '+err); });
  }

  /*END CAMERA-PREVIEW*/
/*DEVICE-----------------------------------------------------------------*/
  setUuid(){
      this.uuid = this.device.uuid;
  }
  /*END DEVICE*/
/*/*HTTP-SERVICE-PROVIDER------------------------------------------------*/
  getEncuestaRemota(){
    this.encuesta = this.encuestaService.getJsonData();
    
  }
  /*END HTTP-SERVICE-PROVIDER*/
/*NATIVE-STORAGE---------------------------------------------------------*/
  /*
  setEncuesta(encuesta) {
    this.nativeStorage.setItem('encuesta', { encuesta })
      .then(
      () => {
        console.log('Encuesta en Storage');
      }
      ,
      err => console.error('Error storing item', err)
      );
  }*/

  //obtiene la encuesta almacenada en el dispositivo
  getEncuesta() {
    this.nativeStorage.getItem('encuesta')
    .then( 
      data => {
         this.encuesta = JSON.parse(JSON.stringify(data));
         this.cargaTemplate1();
      },
      error => console.error('Error storing item ' + error));
  }

  //borra la encuesta almacenada en el dispositivo
  removeEncuesta() {
    this.nativeStorage.remove('encuesta')
    .then(data => console.log('Encuesta removida.'), 
          err => console.log(err));
  }
  /*END NATIVE-STORAGE*/
/*KIOSK-MODE-------------------------------------------------------------*/
  deshabilitaKiosko(){
    KioskPlugin.exitKiosk();
  }
  /*END KIOSK-MODE*/
/*END--------------------------------------------------------------------*/

}
