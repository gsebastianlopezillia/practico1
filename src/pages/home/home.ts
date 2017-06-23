import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { NativeStorage } from '@ionic-native/native-storage';

import { EncuestaServiceProvider } from '../../providers/encuesta-service/encuesta-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[EncuestaServiceProvider]
})
export class HomePage {
  picture : String;
  encuesta : any;
  loading : any;
  // picture options
  private pictureOpts: CameraPreviewPictureOptions = {
    width: 1000,
    height: 1000,
    quality: 100
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
              private encuestaServiceProvider: EncuestaServiceProvider,
              private loadingController: LoadingController,
              private nativeStorage: NativeStorage) {

      //create loading spinner
      this.loading = this.loadingController.create({
        content:
          '<ion-spinner></ion-spinner>'
          
      });
      // start camera
      this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
          (res) => {
            console.log('Success preview: '+res)
          },
          (err) => {
            console.log('Fail preview: '+err)

      });
      //this.getEncuestaRemota()
      this.getSomething('encuesta');

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

  /*HTTP-SERVICE-PROVIDER*/
    getEncuestaRemota(){
      this.loading.present();
      this.encuestaServiceProvider.getJsonData().subscribe(
        result=>{
          console.log('Result.Data: '+result.data)
          this.encuesta = result;
          //this.setEncuesta(this.encuesta);
          console.log("HTTP Success: "+JSON.stringify(this.encuesta));
        },
        err=>{
          console.error('Error: '+err);
        },
        ()=>{
          this.loading.dismiss();
          console.log('getData Completed');
          //guardar en memoria el json recuperado
        }
      );
    }
  /*FIN HTTP-SERVICE-PROVIDER*/

  /*NATIVE-STORAGE*/
  setEncuesta(resJson){
    this.nativeStorage.setItem('encuesta', {json: resJson})
      .then(
        
        () => {
          console.log('Stored item encuesta!')
          
    }

        ,
        error => console.error('Error storing item', error)
      );
  }
    
  getSomething(encuesta){
    this.nativeStorage.getItem(encuesta)
      .then(
        data => console.log('Stored item encuesta!'+JSON.stringify(data)),
        error => console.error('Error storing item '+error)
      );
  }

  removeEncuesta(encuesta){
    console.log('Encuesta removda.');
    this.nativeStorage.remove(encuesta)
  }
  


  /*FIN NATIVE-STORAGE*/

}
