import { Component, Input } from '@angular/core';
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
  opcionesInicialesCI: any = [];
  opcionesInicialesSI: any = [];
  preguntas: any = [];
  opciones: any = [];

  opcionesConImagen: any = [];
  opcionesSinImagen: any = [];

  aGuardar: any = {
    foto: '',
    fecha: '',
    idDispositivo: '',
    idEncuesta: '',
    opciones: []
  };

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
      http.getJsonData();
      this.encuesta = this.getEncuesta();
      this.setUuid();
    });
  }

  /*SINCRONIZACION---------------------------------------------------------*/
  elDemonio(){
    console.log('este demonio es un lokillo');
    setTimeout(() => { this.elDemonio(); }, 1000);
  }

  continuara(){
    var cantRespondida = this.aGuardar.opciones.length;
    setTimeout(() => { this.continuaraAux(cantRespondida); }, 6000);
  }

  continuaraAux(val){
    if(val == this.aGuardar.opciones.length){
      this.cargaTemplate1();
    }
  }
  
  /*FIN SINCRONIZACION-----------------------------------------------------*/

  /*LOGICA-----------------------------------------------------------------*/
  finalizaEncuesta() {
    this.opcionesConImagen = [];
    this.opcionesSinImagen = [];
    this.conImagenes = true;
    var pregCont = document.getElementById("preguntaContainer");
    pregCont.style.height = "35%";
    pregCont.innerHTML = 'GRACIAS';
    this.guardarAGuardar();
    setTimeout(() => { this.cargaTemplate1(); }, 2000);
  }

  cargaTemplate1() {
    this.clean();
    this.preguntaInicial = this.primerPregunta();
    var opcionesPregunta1 = this.opcionesPregunta(this.preguntaInicial);
    var pregCont = document.getElementById("preguntaContainer");
    pregCont.style.height = "35%";
    pregCont.innerHTML = this.preguntaInicial.pregunta;
    if (this.conImagenes) {
      this.opcionesInicialesCI = opcionesPregunta1;
    } else {
      this.opcionesInicialesSI = opcionesPregunta1;
    }
  }

  preguntaSgte(opcion) {
    this.continuara();
    this.aGuardar.opciones[this.aGuardar.opciones.length] = opcion.id;
    if (opcion.preguntasiguiente != null) {
      var preguntaActual = this.preguntaPorId(opcion.preguntasiguiente);
      var opcionesPreguntaActual = this.opcionesPregunta(preguntaActual);
      this.opcionesConImagen = [];
      this.opcionesSinImagen = [];
      var pregCont = document.getElementById("preguntaContainer");

      if (preguntaActual.pregunta != null) {
        pregCont.style.height = "35%";
        pregCont.innerHTML = preguntaActual.pregunta;
      } else {
        pregCont.style.height = "0%";
        pregCont.innerHTML = null;
      }
      if (this.conImagenes) {
        this.opcionesConImagen = opcionesPreguntaActual;
      } else {
        this.opcionesSinImagen = opcionesPreguntaActual;
      }
    } else {
      this.finalizaEncuesta()
    }
  }

  setAGuardar(opcion) {
    this.aGuardar.foto = this.picture;
    this.aGuardar.idDispositivo = this.uuid;
    this.aGuardar.fecha = new Date();
    this.aGuardar.idEncuesta = this.encuesta.id;
  }

  clean() {
    this.opcionesConImagen = [];
    this.opcionesSinImagen = [];
    this.aGuardar = {
      foto: '',
      fecha: '',
      idDispositivo: '',
      idEncuesta: '',
      opciones: []
    };

  }

  guardarAGuardar(){

  }

  /*FIN LOGICA-------------------------------------------------------------*/

  /*FILTROS----------------------------------------------------------------*/
  opcionesPregunta(pregunta) {
    this.conImagenes = true;
    var currOps = [];
    return JSON.parse(JSON.stringify(this.encuesta.json.opciones))
      .map(
      objeto => {
        return objeto;
      },
      err => console.log(err))
      .filter(
      objeto2 => {
        for (let id of pregunta.opciones) {
          if (objeto2.id == id) {
            if (objeto2.imagen == '') {
              this.conImagenes = false;
            }
            return objeto2;
          }
        }
      },
      err => console.log(err));
  }

  preguntaPorId(paramId: number) {
    return JSON.parse(JSON.stringify(this.encuesta.json.preguntas))
      .map(objeto => { return objeto; }, err => console.log(err))
      .filter(objeto2 => { return objeto2.id == paramId; }, err => console.log(err))[0];
  }

  primerPregunta() {
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
        this.encuesta = respuesta;
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
      this.opcionesInicialesCI = [];
      this.opcionesInicialesSI = [];
      this.setAGuardar(opcion);
      if (opcion.preguntasiguiente != 'null') {
        this.preguntaSgte(opcion);
      } else {
        this.finalizaEncuesta();
      }
    }, (err) => {
      console.log('Fail take: ' + err);
    });
  }

  /*FIN CAMERA-------------------------------------------------------------*/
}

