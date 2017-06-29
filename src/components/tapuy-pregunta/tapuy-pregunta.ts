import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the TapuyPreguntaComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'tapuy-pregunta',
  templateUrl: 'tapuy-pregunta.html'
})
export class TapuyPreguntaComponent {

  text: string;
/*titulo: string, opciones: Int16Array */
  constructor() {
    console.log('Hello TapuyPreguntaComponent Component');
    this.text = 'Hello pela';
    
  }



}
