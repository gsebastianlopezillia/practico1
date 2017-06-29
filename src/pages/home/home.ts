import { Component } from '@angular/core';
import { NavController, Platform} from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Device } from '@ionic-native/device'
import { NativeStorage } from '@ionic-native/native-storage';
import { EncuestaServiceProvider } from '../../providers/encuesta-service/encuesta-service';


declare let KioskPlugin: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [EncuestaServiceProvider]
  
})
export class HomePage {
  picture : String;
  uuid : String;
  botonName : String = 'false';
  encuesta: any;
  //loading : any;
  // picture options
  private pictureOpts: CameraPreviewPictureOptions = {
    width: 1000,
    height: 1000,
    quality: 10
  };
    // camera options (Size and location). In the following example, the preview uses the rear camera and display the preview in the back of the webview
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
  constructor(public navCtrl: NavController,
              private cameraPreview: CameraPreview,
              public platform: Platform,
              public sqlite: SQLite,
              public nativeStorage: NativeStorage,
              public encuestaService: EncuestaServiceProvider,
              private device: Device) {
      platform.ready().then(() => {
        // start camera
        this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
            (res) => {
              console.log('Success preview: '+res);
            },
            (err) => {
              console.log('Fail preview: '+err);
        });
        this.getEncuesta();
      });
  }



  cargaTemplate1(){
    //busco la primer pregunta
    var pregunta1 = JSON.parse(JSON.stringify(this.encuesta.json.preguntas))
      .map( objeto => {return objeto;}, err => console.log(err))
      .filter( objeto2 => { return objeto2.inicial == true;}, err => console.log(err))[0];
      //Ejemplo: {id: 1, pregunta: "Como...?", opciones: Array[3], inicial: true}
  }

  cargaOpcionesTemplate(){

  }


  /*CAMERA-PREVIEW*/
  getPicture(){
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
          this.picture = 'data:image/jpeg;base64,' + imageData;
          console.log('Success take: '+this.picture);
        }, (err) => {
          console.log('Fail take: '+err);
          this.picture = 'assets/img/test.jpg';
        });
  }
  /*FIN CAMERA-PREVIEW*/

  /*DEVICE*/
  setUuid(){
      this.uuid = this.device.uuid;
  }
  /*FIN DEVICE*/

  /*HTTP-SERVICE-PROVIDER*/
  getEncuestaRemota(){
    this.encuesta = this.encuestaService.getJsonData();
    
  }
  /*FIN HTTP-SERVICE-PROVIDER*/

  /*NATIVE-STORAGE
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

  getEncuesta() {
    console.log('getEncuesta()');
    this.nativeStorage.getItem('encuesta')
    .then( 
      data => {
         this.encuesta = JSON.parse(JSON.stringify(data));
         console.log(this.encuesta);
         this.cargaTemplate1();
         console.log('FIN getEncuesta()');   
      },
      error => console.error('Error storing item ' + error));
  }

  removeEncuesta() {
    this.nativeStorage.remove('encuesta')
    .then(
      data => console.log('Encuesta removida.')
    ,
      err => console.log(err)
    );
  }
  /*FIN NATIVE-STORAGE*/

  /*LOGICA DE NEGOCIOS*/
  compruebaEncuestaVigente(){
    
  }
  /*FIN LOGICA DE NEGOCIOS*/

  cabiarNombreBoton(){
    if(this.botonName=='false')
      this.botonName='true';
    else
      this.botonName='false';
  }

  habilitaKiosko(){
    
  }

  deshabilitaKiosko(){
    KioskPlugin.exitKiosk();
  }

  consoleEncuesta(){console.log(this.encuesta);}
}
