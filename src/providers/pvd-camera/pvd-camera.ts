import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';

import 'rxjs/add/operator/map';

/*
  Generated class for the PvdCameraProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PvdCameraProvider {

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

  

  constructor(public http: Http, public cameraPreview: CameraPreview) {
    console.log('Hello PvdCameraProvider Provider');
  }
  /*CAMERA-----------------------------------------------------------------*/
  //toma foto
  getPicture(){
    let picture : String;
    this.cameraPreview.takePicture(this.pictureOpts).then(
      (imageData) => { 
        picture = 'data:image/jpeg;base64,' + imageData;
        return picture;
     },//NO TOCAR
      (err) => { console.log(err); });
  }

  //abre octurador
  openCamera(){
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
      (res) => { return this.getPicture(); },
      (err) => { console.log('Fail preview: '+err); });
  }

  /*END CAMERA-PREVIEW*/

}
