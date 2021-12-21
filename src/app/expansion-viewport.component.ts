import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-expansion-viewport",
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  animations: [
    trigger("expansion", [
      state(
        "expanded",
        style({
          width: "256px",
        })
      ),
      state(
        "collapsed",
        style({
          width: "68px",
        })
      ),
      transition("expanded <=> collapsed", [
        animate("400ms cubic-bezier(0.25, 0.8, 0.25, 1)"),
      ]),
    ]),
  ],
  host: {
    "[@expansion]": "_getExpansionState()",
    "(@expansion.start)": "_animationStarted.next($event)",
    "(@expansion.done)": "_animationDone.next($event)",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionViewportComponent {
  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  readonly _animationStarted = new Subject<AnimationEvent>();

  readonly _animationDone = new Subject<AnimationEvent>();

  @Input()
  get expanded() {
    return this._expanded;
  }
  set expanded(value: BooleanInput) {
    const expanded = coerceBooleanProperty(value);
    if (this._expanded !== expanded) {
      this._expanded = expanded;

      this._changeDetectorRef.markForCheck();
    }
  }
  private _expanded = false;

  toggle() {
    this.expanded = !this.expanded;
  }

  collapse() {
    this.expanded = false;
  }

  expand() {
    this.expanded = true;
  }

  _getExpansionState() {
    return this.expanded ? "expanded" : "collapsed";
  }
}
