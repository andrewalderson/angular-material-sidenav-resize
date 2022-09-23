import {
  AfterContentInit,
  Directive,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import {
  MatDrawer,
  MatDrawerContainer,
  MatSidenavContainer,
} from "@angular/material/sidenav";
import { startWith, Subject, takeUntil } from "rxjs";

/**
 * This directive makes it possible to have the drawer in a MatDrawerContainer
 * animate its width when it is resized. This directive should be considered
 * temporary and will be able to be removed if the MatDrawerContainer class
 * is updated to remove the 'mat-drawer-transition' after the open/close
 * animations are completed
 *
 * The problem with the current implementation of MatDrawerContainer is that it
 * adds a class to the container for animations the first time a drawer in the
 * container is toggled opened or closed and it is never removed. This animation class interferes with
 * adding an animation to the width of the drawer content by causing the animations
 * for the margin of the drawer content to lag.
 * Since this animation class is added each time the drawer is toggled this directive
 * simply removes it after the animation is complete (the openChange event fires).
 * This leaves the developer free to implement the resizing of the drawer content to fit
 * their use case.
 *
 * To use this directive add it to the declarations of a module and add the 'autosize'
 * attribute to the mat-drawer-container
 *
 */

@Directive({
  selector: "mat-drawer-container[autosize]",
})
export class MatDrawerAutosizeHackDirective
  implements OnDestroy, AfterContentInit
{
  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _container: MatDrawerContainer
  ) {}

  private _destroyed = new Subject<void>();

  ngAfterContentInit(): void {
    /**
     * Even though '_container' should be considered private (or internal)
     * we are using it anyways because if we queryed for our own drawers
     * like the MatDrawer class does we would still need to access private/internal
     * properties to filter them. Six of one, half dozen of the other.
     */
    this._container._drawers.changes
      .pipe(startWith(null), takeUntil(this._destroyed))
      .subscribe(() => {
        this._container._drawers.forEach((drawer) =>
          this._watchForDrawerOpenChange(drawer)
        );
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private _watchForDrawerOpenChange(drawer: MatDrawer) {
    if (!drawer) {
      return;
    }
    drawer.openedChange.subscribe(() => {
      this._elementRef.nativeElement.classList.remove("mat-drawer-transition");
    });
  }
}

/**
 * This directive extends the MatDrawerAutosizeHackDirective
 * and is used to add the same functionality to a mat-sidenav-container.
 */
@Directive({
  selector: "mat-sidenav-container[autosize]",
})
export class MatSidenavAutosizeHackDirective extends MatDrawerAutosizeHackDirective {
  constructor(
    elementRef: ElementRef<HTMLElement>,
    sidenavContainer: MatSidenavContainer
  ) {
    super(elementRef, sidenavContainer);
  }
}
