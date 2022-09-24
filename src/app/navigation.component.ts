import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "app-navigation",
  template: `<mat-nav-list>
    <a mat-list-item href="#">
      <mat-icon matListIcon>home</mat-icon>
      <span mat-line class="app-navigation-item-text">Home</span>
    </a>
  </mat-nav-list>`,
  styles: [
    `
      .app-navigation {
        display: block;
      }

      .app-navigation-item-text {
        transition-property: opacity, transform;
        transition-duration: 500ms;
        transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
        opacity: 1;
        transform: none;
      }

      .app-navigation-is-collapsed .app-navigation-item-text {
        opacity: 0;
        transform: translateX(-10px);
      }
    `,
  ],
  host: {
    class: "app-navigation",
    "[class.app-navigation-is-collapsed]": "collapsed",
  },
  // need to set this to 'None' because the animations target items that are added through ng-content
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  @Input()
  get collapsed() {
    return this._collapsed;
  }
  set collapsed(value: BooleanInput) {
    this._collapsed = coerceBooleanProperty(value);
  }
  private _collapsed?: boolean;
}
