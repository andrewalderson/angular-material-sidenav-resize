import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
} from "@angular/core";

@Component({
  selector: "app-expansion-viewport",
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: block;
        width: 256px;
        transition: width 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
      }
      :host.is-collapsed {
        width: 68px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionViewportComponent {
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {}

  @Input()
  get expanded() {
    return this._expanded;
  }
  set expanded(value: BooleanInput) {
    const expanded = coerceBooleanProperty(value);
    if (this._expanded !== expanded) {
      this._setExpanded(expanded);

      this._changeDetectorRef.markForCheck();
    }
  }
  private _expanded = false;

  toggle(isExpanded: boolean = !this.expanded) {
    this._setExpanded(isExpanded);
  }

  collapse() {
    this.toggle(false);
  }

  expand() {
    this.toggle(true);
  }

  _setExpanded(isExpanded: boolean) {
    this._expanded = isExpanded;
    if (this._expanded) {
      this._elementRef.nativeElement.classList.remove("is-collapsed");
    } else {
      this._elementRef.nativeElement.classList.add("is-collapsed");
    }
  }
}
