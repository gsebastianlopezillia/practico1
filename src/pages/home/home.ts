import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';

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
              private loadingController: LoadingController) {

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
      this.getEncuesta()
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
    getEncuesta(){
      this.loading.present();
      this.encuestaServiceProvider.getJsonData().subscribe(
        result=>{
          console.log('Result.Data: '+result.data)
          this.encuesta = result;
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

}
