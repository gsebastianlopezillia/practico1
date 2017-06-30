import { Component } from '@angular/core';
import { NavController, NavParams, Platform} from 'ionic-angular';
import { Device } from '@ionic-native/device'
import { NativeStorage } from '@ionic-native/native-storage';

import { PvdHttpProvider } from '../../providers/pvd-http/pvd-http';
import { PvdCameraProvider } from '../../providers/pvd-camera/pvd-camera';
import { PvdStorageProvider } from '../../providers/pvd-storage/pvd-storage';

declare let KioskPlugin: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [PvdHttpProvider,PvdCameraProvider,PvdStorageProvider]
})

export class HomePage {
  uuid : String;
  encuesta: any;
  preguntaInicial: any;
  preguntas: any = [];
  opciones: any = [];
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public http: PvdHttpProvider,
              public camera: PvdCameraProvider,
              public storage: PvdStorageProvider,
              public nativeStorage: NativeStorage,
              private device: Device) {
      platform.ready().then(() => {
        http.getJsonData();
        this.setUuid();
        this.encuesta = this.getEncuesta();
      });
  }

  cargaTemplate1(){
    //busco la primer pregunta
    var pregunta1 = JSON.parse(JSON.stringify(this.encuesta.json.preguntas))
      .map( objeto => {return objeto;}, err => console.log(err))
      .filter( objeto2 => { return objeto2.inicial == true;}, err => console.log(err))[0];
      //Ejemplo: {id: 1, pregunta: "Como...?", opciones: Array[3], inicial: true}
    this.preguntaInicial = pregunta1;//dejo en memoria la primer pregunta
    var conImagenes = true;//declaro la bandera de imagenes
    var opcionesPregunta1 = JSON.parse(JSON.stringify(this.encuesta.json.opciones))
      .map( objeto => {
        if(objeto.imagen == "" && objeto.id in pregunta1.opciones){//defino la bandera de imagenes
          conImagenes = false;
        }
        return objeto;}, err => console.log(err))
      .filter( objeto2 => { return objeto2.id in pregunta1.opciones;}, err => console.log(err));
    document.getElementById("preguntaContainer").innerHTML = pregunta1.pregunta;
    if(conImagenes){
      var cantidad = opcionesPregunta1.length;
      for(var o = 0; o < cantidad ; o++){
        var img = document.createElement("img");
        img.src = opcionesPregunta1[o].imagen;
        img.className="imagenOpcion";
        document.getElementById("opcionesContainer").appendChild(img);
      }
    }
  }

  cargaOpcionesTemplate(){
    //preg.
  }

/*DEVICE-----------------------------------------------------------------*/
  setUuid(){
      this.uuid = this.device.uuid;
  }

/*HTTP-------------------------------------------------------------------*/
  getEncuestaRemota(){
    this.encuesta = this.http.getJsonData();
  }

/*KIOSK-MODE-------------------------------------------------------------*/
  deshabilitaKiosko(){
    KioskPlugin.exitKiosk();
  }

/*NATIVE-STORAGE---------------------------------------------------------*/
  getEncuesta(){
    this.nativeStorage.getItem('encuesta').then(
      data => { 
        var respuesta = JSON.parse(JSON.stringify(data));
        this.encuesta = respuesta; //recupero la encuesta del dispositivo
        for(var i in this.encuesta.json.preguntas){
          this.preguntas.push(JSON.parse(JSON.stringify(this.encuesta.json.preguntas[i])));
        }
        for(var i in this.encuesta.json.opciones){
          this.opciones.push(JSON.parse(JSON.stringify(this.encuesta.json.opciones[i])));
        }
        console.log(this.preguntas);
        console.log(this.opciones);
        this.cargaTemplate1();
      },
      error => console.error('Error reading item ' + error));
  }
/*END--------------------------------------------------------------------*/

  buscaPrimera(){
    
  }

  buscaOpciones(){

  }
}

