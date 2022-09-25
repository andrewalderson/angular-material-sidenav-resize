import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "app-navigation",
  template: `<app-collapsable-viewport
    class="app-navigation-viewport"
    #viewport
    [collapsed]="collapsed"
    (collapsedStart)="_setCollapsed(true)"
    (expandedStart)="_setCollapsed(false)"
  >
    <div class="app-navigation-inner">
      <div class="app-navigation-header"></div>
      <div class="app-navigation-content">
        <mat-nav-list>
          <a mat-list-item href="#">
            <mat-icon matListIcon>home</mat-icon>
            <span mat-line class="app-navigation-item-text">Home</span>
          </a>
        </mat-nav-list>
      </div>
      <div class="app-navigation-footer">
        <mat-toolbar>
          <button
            mat-icon-button
            class="app-navigation-collapse-button"
            (click)="viewport.toggle()"
          >
            <mat-icon>chevron_left</mat-icon>
          </button>
        </mat-toolbar>
      </div>
    </div>
  </app-collapsable-viewport>`,
  styles: [
    `
      .app-navigation-viewport {
        height: 100%;
        width: 256px;
      }
      .app-navigation-is-collapsed .app-navigation-viewport {
        width: 68px;
      }
      .app-navigation {
        display: block;
        height: 100%;
        position: relative;
      }

      .app-navigation-inner {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .app-navigation-header {
        min-height: 64px;
      }

      .app-navigation-content {
        flex: 1;
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

      button.app-navigation-collapse-button {
        margin-left: auto;
      }
    `,
  ],
  host: {
    class: "app-navigation",
    "[class.app-navigation-is-collapsed]": "_collapsed",
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
    const collapsed = coerceBooleanProperty(value);
    this._setCollapsed(collapsed);
  }
  private _collapsed?: boolean;

  _setCollapsed(isCollapsed: boolean) {
    this._collapsed = isCollapsed;
  }
}
