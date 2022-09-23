import {
  BooleanInput,
  coerceBooleanProperty,
  coerceElement,
  coerceNumberProperty,
  NumberInput,
} from "@angular/cdk/coercion";
import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  Injectable,
  Input,
  NgZone,
  OnDestroy,
  Output,
} from "@angular/core";
import {
  debounceTime,
  Observable,
  Observer,
  Subject,
  Subscription,
} from "rxjs";

@Injectable({ providedIn: "root" })
export class ResizeObserverFactory {
  create(callback: ResizeObserverCallback): ResizeObserver | null {
    return typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(callback);
  }
}

@Injectable({ providedIn: "root" })
export class SizeObserver implements OnDestroy {
  private _observedElements = new Map<
    Element,
    {
      observer: ResizeObserver | null;
      readonly stream: Subject<ResizeObserverEntry[]>;
      count: number;
    }
  >();

  constructor(private _resizeObserverFactory: ResizeObserverFactory) {}

  observe(element: Element): Observable<ResizeObserverEntry[]>;

  observe(element: ElementRef<Element>): Observable<ResizeObserverEntry[]>;

  observe(
    elementOrRef: Element | ElementRef<Element>
  ): Observable<ResizeObserverEntry[]> {
    const element = coerceElement(elementOrRef);

    return new Observable((observer: Observer<ResizeObserverEntry[]>) => {
      const stream = this._observeElement(element);
      const subscription = stream.subscribe(observer);

      return () => {
        subscription.unsubscribe();
        this._unobserveElement(element);
      };
    });
  }
  private _observeElement(element: Element) {
    if (!this._observedElements.has(element)) {
      const stream = new Subject<ResizeObserverEntry[]>();
      const observer = this._resizeObserverFactory.create((entries) =>
        stream.next(entries)
      );
      if (observer) {
        observer.observe(element);
      }
      this._observedElements.set(element, { observer, stream, count: 1 });
    } else {
      this._observedElements.get(element)!.count++;
    }
    return this._observedElements.get(element)!.stream;
  }

  private _unobserveElement(element: Element) {
    if (this._observedElements.has(element)) {
      this._observedElements.get(element)!.count--;
      if (!this._observedElements.get(element)!.count) {
        this._cleanupObserver(element);
      }
    }
  }

  ngOnDestroy() {
    this._observedElements.forEach((_, element) =>
      this._cleanupObserver(element)
    );
  }

  private _cleanupObserver(element: Element): void {
    if (this._observedElements.has(element)) {
      const { observer, stream } = this._observedElements.get(element)!;
      if (observer) {
        observer.disconnect();
      }
      stream.complete();
      this._observedElements.delete(element);
    }
  }
}

@Directive({
  selector: "[appObserveResize]",
  exportAs: "appObserveResize",
})
export class ObserveResizeDirective implements AfterContentInit, OnDestroy {
  @Output("appObserveResize") readonly event = new EventEmitter<
    ResizeObserverEntry[]
  >();

  @Input("appObserveResizeDisabled")
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this._unsubscribe() : this._subscribe();
  }
  private _disabled = false;

  /** Debounce interval for emitting the changes. */
  @Input()
  get debounce(): number | undefined {
    return this._debounce;
  }
  set debounce(value: NumberInput) {
    this._debounce = coerceNumberProperty(value);
    this._subscribe();
  }
  private _debounce?: number;

  private _currentSubscription: Subscription | null = null;

  constructor(
    private _sizeObserver: SizeObserver,
    private _elementRef: ElementRef<HTMLElement>,
    private _ngZone: NgZone
  ) {}

  ngAfterContentInit(): void {
    if (!this._currentSubscription && !this.disabled) {
      this._subscribe();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe();
  }

  /**
   * This code does basically the same thing as
   * <code>
   *  this._resizeObserver = new ResizeObserver((entries) =>
   *      this.event.emit(entries)
   *  );
   *
   *  this._resizeObserver.observe(this._elementRef.nativeElement);
   *  </code>
   *
   *  In this version we are wrapping the ResizeObserver callback in an Observable
   */
  private _subscribe() {
    this._unsubscribe();
    const stream = this._sizeObserver.observe(this._elementRef);

    this._ngZone.runOutsideAngular(() => {
      this._currentSubscription = (
        this.debounce ? stream.pipe(debounceTime(this.debounce)) : stream
      ).subscribe(this.event);
    });
  }

  private _unsubscribe() {
    this._currentSubscription?.unsubscribe();
  }
}
