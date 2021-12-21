import { DOCUMENT } from "@angular/common";
import {
  Directive,
  ElementRef,
  Host,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from "@angular/core";
import {
  MatDrawer,
  MatDrawerContainer,
  MatSidenav,
  MatSidenavContainer,
} from "@angular/material/sidenav";
import { Subject, takeUntil } from "rxjs";

/**
 * The MatDrawer doesn't currently support animating the width.
 * There are issues with animation timing and updating the content margins.
 * This directive makes animating the width possible by removing the css class that adds the
 * transition to the content margins and then manually updating the margins
 * using a ResizeObserver.
 * This directive does not adjust the width of the drawer or animate it.
 * That needs to be done seperately. This directive just makes it possible
 * to do it.
 *
 * This directive also makes the 'autosize' property on the MatDrawerContainer superflous.
 * Once the component supports animating the width of the drawer this directive is no longer needed
 * and the autosize property can be set on the container.
 */

@Directive({
  selector: "[appDrawerAutosizeHack]",
})
export class DrawerAutosizeHackDirective implements OnInit, OnDestroy {
  constructor(
    @Optional() @Self() @Host() drawer: MatDrawer,
    @Optional() @Self() @Host() sidenav: MatSidenav,
    @Optional() drawerContainer: MatDrawerContainer,
    @Optional() sidenavContainer: MatSidenavContainer,
    @Optional() @Inject(DOCUMENT) private _doc: Document,
    private _el: ElementRef<HTMLElement>
  ) {
    this._drawer = drawer ?? sidenav;
    this._container = drawerContainer ?? sidenavContainer;
  }

  private _drawer?: MatDrawer | MatSidenav;
  private _container?: MatDrawerContainer | MatSidenavContainer;

  private _destroyed = new Subject<void>();

  private resizeObserver?: ResizeObserver;

  ngOnInit(): void {
    // Remove this css class after the drawer's toggle animation completes.
    // This css class adds the transitions to the mat-drawer-content
    // and it is added each time the drawer is toggled open and closed
    // It is safe to remove it since it will be added again.
    // If it is not removed it causes the animation on the content
    // to lag behind the animation for the drawer width.
    // Since we are manually updating the content margins on each resize
    // below we don't need this.
    this._drawer?.openedChange
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this._doc
          .querySelector(".mat-drawer-transition")
          ?.classList.remove("mat-drawer-transition");
      });

    this.resizeObserver = new ResizeObserver((entries) => {
      // manually update the content margins on each resize
      this._container?.updateContentMargins();
    });
    this.resizeObserver.observe(this._el.nativeElement);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();

    this.resizeObserver?.unobserve(this._el.nativeElement);
  }
}
