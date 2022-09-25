import { trigger, transition, animate } from "@angular/animations";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { distinctUntilChanged, filter, mapTo, Subject } from "rxjs";
import { AnimationEvent } from "@angular/animations";

@Component({
  selector: "app-collapsable-viewport",
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
        transition-duration: 300ms;
        transition-property: width, height;
      }
    `,
  ],
  animations: [
    trigger("collapse", [transition("void <=> collapsed", [animate("300ms")])]),
  ],
  inputs: ["collapsed"],
  host: {
    "[@collapse]": "_animationState",
    "(@collapse.start)": "_animationStart.next($event)",
    "(@collapse.done)": "_animationEnd.next($event)",
    "[class.app-collapsable-viewport-collapsed]": "collapsed",
  },
})
export class CollapsableViewportComponent implements OnInit, OnDestroy {
  @Input()
  get collapsed() {
    return this._collapsed;
  }
  set collapsed(value: any) {
    const collapsed = coerceBooleanProperty(value);
    this._setCollapsed(collapsed);
  }
  private _collapsed = false;

  protected readonly _animationStart = new Subject<AnimationEvent>();
  protected readonly _animationEnd = new Subject<AnimationEvent>();
  protected _animationState: "void" | "collapsed" = "void";

  @Output() readonly collapsedStart = this._animationStart.pipe(
    filter((e) => e.fromState !== e.toState && e.toState === "collapsed"),
    mapTo(undefined)
  );

  @Output() readonly expandedStart = this._animationStart.pipe(
    filter((e) => e.fromState !== e.toState && e.toState.indexOf("void") === 0),
    mapTo(undefined)
  );

  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    this._animationEnd
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.fromState === y.fromState && x.toState === y.toState;
        })
      )
      .subscribe((event: AnimationEvent) => {
        const { fromState, toState } = event;

        if (
          (toState.indexOf("collapsed") === 0 && fromState === "void") ||
          (toState === "void" && fromState.indexOf("collapsed") === 0)
        ) {
          this.collapsedChange.emit(this._collapsed);
        }
      });
  }

  ngOnDestroy(): void {
    this._animationStart.complete();
    this._animationEnd.complete();
  }

  toggle(isCollapsed: boolean = !this._collapsed) {
    this._setCollapsed(isCollapsed);
  }

  collapse() {
    this.toggle(true);
  }

  expand() {
    this.toggle(false);
  }

  _setCollapsed(isCollapsed: boolean) {
    this._collapsed = isCollapsed;
    this._animationState = this.collapsed ? "collapsed" : "void";
  }
}
