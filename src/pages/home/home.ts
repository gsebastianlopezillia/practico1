import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device'
import { NativeStorage } from '@ionic-native/native-storage';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';

import { PvdHttpProvider } from '../../providers/pvd-http/pvd-http';
import { PvdCameraProvider } from '../../providers/pvd-camera/pvd-camera';
import { PvdStorageProvider } from '../../providers/pvd-storage/pvd-storage';
import { PvdSqliteProvider } from '../../providers/pvd-sqlite/pvd-sqlite';

declare let KioskPlugin: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [PvdHttpProvider, PvdCameraProvider, PvdStorageProvider]
})

export class HomePage {
  uuid: String;
  encuesta: any;
  preguntaInicial: any;
  preguntas: any = [];
  opciones: any = [];
  opcionesConImagen: any = [];
  opcionesSinImagen: any = [];
  conImagenes: boolean = true;//declaro la bandera de imagenes
  //camera params
  picture: string = '';
  private pictureOpts: CameraPreviewPictureOptions = {
    width: 500,
    height: 500,
    quality: 20
  };
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
  //fin camera params
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public http: PvdHttpProvider,
    public storage: PvdStorageProvider,
    public nativeStorage: NativeStorage,
    public camera: CameraPreview,
    private device: Device) {
    platform.ready().then(() => {
      //http.getJsonData();
      this.encuesta = this.getEncuesta();
      this.setUuid();
    });
  }

  /*LOGICA-----------------------------------------------------------------*/
  finalizaEncuesta() {
    document.getElementById("preguntaContainer").innerHTML = 'MUCHAS GRACIAS POR SU TIEMPO!!';
    this.opcionesConImagen = [];
    this.opcionesSinImagen = [];
    this.conImagenes = true;//declaro la bandera de imagenes
  }

  cargaTemplate1() {
    this.preguntaInicial = this.primerPregunta();
    var opcionesPregunta1 = this.opcionesPregunta(this.preguntaInicial);
    console.log('opcionesPregunta1');
    console.log(opcionesPregunta1);
    console.log(this.preguntaInicial.opciones);
    document.getElementById("preguntaContainer").innerHTML = this.preguntaInicial.pregunta;
    if (this.conImagenes) {
      this.opcionesConImagen = opcionesPregunta1;
    } else {
      this.opcionesSinImagen = opcionesPregunta1;
    }
  }

  pageSgte(paramId) {
    var preguntaActual = this.preguntaPorId(paramId);
    var opcionesPreguntaActual = this.opcionesPregunta(preguntaActual);
    this.opcionesConImagen = [];
    this.opcionesSinImagen = [];
    document.getElementById("preguntaContainer").innerHTML = preguntaActual.pregunta;
    if (this.conImagenes) {
      this.opcionesConImagen = opcionesPreguntaActual;
    } else {
      this.opcionesSinImagen = opcionesPreguntaActual;
    }
  }
  /*FIN LOGICA-------------------------------------------------------------*/

  /*FILTROS----------------------------------------------------------------*/
  opcionesPregunta(pregunta) {
    this.conImagenes = true;
    return JSON.parse(JSON.stringify(this.encuesta.json.opciones))
      .map(
      objeto => {
        if (objeto.imagen == "" && objeto.id in pregunta.opciones) {
          this.conImagenes = false;
        }
        return objeto;
      },
      err => console.log(err))
      .filter(
      objeto2 => {
        return objeto2.id in pregunta.opciones;
      },
      err => console.log(err));
  }

  preguntaPorId(paramId: number) {
    return JSON.parse(JSON.stringify(this.encuesta.json.preguntas))
      .map(objeto => { return objeto; }, err => console.log(err))
      .filter(objeto2 => { return objeto2.id == paramId; }, err => console.log(err))[0];
  }

  primerPregunta() {//retorna la primer pregunta de la encuesta
    return JSON.parse(JSON.stringify(this.encuesta.json.preguntas))
      .map(objeto => { return objeto; }, err => console.log(err))
      .filter(objeto2 => { return objeto2.inicial == true; }, err => console.log(err))[0];
    //Ejemplo: {id: 1, pregunta: "Como...?", opciones: Array[3], inicial: true}
  }
  /*FIN FILTROS------------------------------------------------------------*/

  /*DEVICE-----------------------------------------------------------------*/
  setUuid() {
    this.uuid = this.device.uuid;
  }
  /*FIN DEVICE-------------------------------------------------------------*/

  /*HTTP-------------------------------------------------------------------*/
  getEncuestaRemota() {
    this.encuesta = this.http.getJsonData();
  }
  /*FIN HTTP---------------------------------------------------------------*/

  /*KIOSK-MODE-------------------------------------------------------------*/
  deshabilitaKiosko() {
    KioskPlugin.exitKiosk();
  }
  /*FIN KIOSK-MODE---------------------------------------------------------*/

  /*NATIVE-STORAGE---------------------------------------------------------*/
  getEncuesta() {
    this.nativeStorage.getItem('encuesta').then(
      data => {
        var respuesta = JSON.parse(JSON.stringify(data));
        this.encuesta = respuesta; //recupero la encuesta del dispositivo
        this.preguntas = this.encuesta.json.preguntas;
        this.opciones = this.encuesta.json.opciones;
        this.cargaTemplate1();
      },
      error => console.error('Error reading item ' + error));
  }
  /*FIN NATIVE-STORAGE-----------------------------------------------------*/

  /*CAMERA-----------------------------------------------------------------*/
  sacaFoto(opcion) {
    this.camera.takePicture(this.pictureOpts).then((imageData) => {
      this.picture = 'data:image/jpeg;base64,' + imageData;
      if (opcion.preguntasiguiente != 'null') {
        this.pageSgte(opcion.preguntasiguiente);
      } else {
        this.finalizaEncuesta();
      }
    }, (err) => {
      console.log('Fail take: ' + err);
    });
  }
  /*FIN CAMERA-------------------------------------------------------------*/
}

