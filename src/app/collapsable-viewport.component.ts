import { trigger, transition, animate } from "@angular/animations";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { distinctUntilChanged, filter, mapTo, Subject, take } from "rxjs";
import { AnimationEvent } from "@angular/animations";
import { ANIMATION_MODULE_TYPE } from "@angular/platform-browser/animations";
import { Platform } from "@angular/cdk/platform";

export type CollapsableViewportToggleResult = "collapsed" | "expanded";

@Component({
  selector: "app-collapsable-viewport",
  template: `<ng-content></ng-content>`,
  styles: [
    `
      .app-collapsable-viewport {
        display: block;
        position: relative;
        overflow: hidden;
      }
      .app-collapsable-viewport-transition {
        transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
        transition-duration: 300ms;
        transition-property: width, height;
      }
      .ng-animate-disabled .app-collapsable-viewport-transition,
      .ng-animate-disabled.app-collapsable-viewport-transition {
        transition: none;
      }
    `,
  ],
  animations: [
    trigger("collapse", [
      transition("void => collapse-instant", animate("0ms")),
      transition("void <=> collapse, collapse-instant => void", [
        animate("300ms"),
      ]),
    ]),
  ],
  host: {
    class: "app-collapsable-viewport",
    "[class.app-collapsable-viewport-collapsed]": "collapsed",
    "[@collapse]": "_animationState",
    "(@collapse.start)": "_animationStart.next($event)",
    "(@collapse.done)": "_animationEnd.next($event)",
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsableViewportComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  private _enableAnimations = false;

  @Input()
  get collapsed() {
    return this._collapsed;
  }
  set collapsed(value: any) {
    const collapsed = coerceBooleanProperty(value);
    this.toggle(collapsed);
  }
  private _collapsed = false;

  protected readonly _animationStart = new Subject<AnimationEvent>();
  protected readonly _animationEnd = new Subject<AnimationEvent>();
  protected _animationState: "void" | "collapse" | "collapse-instant" = "void";

  @Output() readonly collapsedStart = this._animationStart.pipe(
    filter((e) => e.fromState !== e.toState && e.toState === "collapse"),
    mapTo(undefined)
  );

  @Output() readonly expandedStart = this._animationStart.pipe(
    filter((e) => e.fromState !== e.toState && e.toState.indexOf("void") === 0),
    mapTo(undefined)
  );

  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: Platform,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) private _animationMode?: string
  ) {}

  ngOnInit(): void {
    this._animationStart
      .pipe(
        filter((event: AnimationEvent) => event.fromState !== event.toState)
      )
      .subscribe((event: AnimationEvent) => {
        if (
          event.toState !== "collapse-instant" &&
          this._animationMode !== "NoopAnimations"
        ) {
          this._setViewportClasses(true);
        }
        this._changeDetectorRef.markForCheck();
      });

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
          this._setViewportClasses(false);
          this.collapsedChange.emit(this._collapsed);

          this._changeDetectorRef.markForCheck();
        }
      });
  }

  ngAfterContentChecked() {
    if (this._platform.isBrowser) {
      this._enableAnimations = true;
    }
  }

  ngOnDestroy(): void {
    this._animationStart.complete();
    this._animationEnd.complete();
  }

  toggle(
    isCollapsed: boolean = !this._collapsed
  ): Promise<CollapsableViewportToggleResult> {
    return this._setCollapsed(isCollapsed);
  }

  collapse(): Promise<CollapsableViewportToggleResult> {
    return this.toggle(true);
  }

  expand(): Promise<CollapsableViewportToggleResult> {
    return this.toggle(false);
  }

  _setCollapsed(
    isCollapsed: boolean
  ): Promise<CollapsableViewportToggleResult> {
    this._collapsed = isCollapsed;
    if (isCollapsed) {
      this._animationState = this._enableAnimations
        ? "collapse"
        : "collapse-instant";
    } else {
      this._animationState = "void";
    }

    return new Promise<CollapsableViewportToggleResult>((resolve) => {
      this.collapsedChange
        .pipe(take(1))
        .subscribe((collapsed) =>
          resolve(collapsed ? "collapsed" : "expanded")
        );
    });
  }

  private _setViewportClasses(isAdd: boolean) {
    if (isAdd) {
      this._elementRef.nativeElement.classList.add(
        "app-collapsable-viewport-transition"
      );
    } else {
      this._elementRef.nativeElement.classList.remove(
        "app-collapsable-viewport-transition"
      );
    }
  }
}
