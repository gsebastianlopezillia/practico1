import { Component } from '@angular/core';

/**
 * Generated class for the TapuyOpcionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'tapuy-opcion',
  templateUrl: 'tapuy-opcion.html'
})
export class TapuyOpcionComponent {

  text: string;

  constructor() {
    console.log('Hello TapuyOpcionComponent Component');
    this.text = 'Hello World';
  }

}
