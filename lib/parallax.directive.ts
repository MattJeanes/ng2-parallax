// ngx-parallax

import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnInit,
} from '@angular/core';
import { timer } from 'rxjs/observable/timer';

/*
These are optional values you can include in the config object you can pass into the
directive for custom properties you want to use this with.  This tool can be used for
more than just the parallax effect, and it is able to transform anything about the
[parallaxElement] that you want to have bound to the scrolling of the nested element.

*/
export interface ParallaxConfig {
    // the css property (converted to camelCase) that you want changed along with the
    // value you want to assign to the css key; you should use cssProperty if you're
    // just defining one property without special values
    cssKey?: string;

    // this is used to define the css property you'd like to modify as you scroll
    // default is backgroundPositionY
    cssProperty?: string;

    // ratio defining how fast, slow, or the direction of the changes on scrolling
    ratio?: number;

    // this is the initial value in pixels for the cssProperty property you defined
    // before or, if you didn't define one, it defaults to 0
    initialValue?: number;

    // use this if you want the parallax effect only if the passed in statement is
    // truthy; default is boolean true
    canMove?: any;

    // the id for the element on the page you'd like to track the scrolling of in the
    // case where the element is not available in the current component;
    // if no id is defined along with no scrollElement below,
    // it defaults to the scrolling of the body
    scrollerId?: string;
    // This value is to throttle the amount scrollevents.
    // Default value is 3ms. So if keep scrolling, the css effects will only be applied every 3ms on default
    // If set to 0, micro-stuttering could become a problem.
    throttleInterval?: number;
    // This is applied to the calculated value, for trimming the digits.
    // Default value is 2 digits. So if the calculated value is 100.1234567px,
    // the value that is going to be applied is 100.12px
    valueFixedDigits?: number;

    // the upper constraint for the css transformation
    maxValue?: number;

    // the lower constraint for the css transformation
    minValue?: number;

    // the unit (e.g. 'px', 'em', '%', 'vh', etc.) you want for the parallax effect to use
    cssUnit?: string;

    // the element in the current component that you'd like the directive to track its
    // position as it scrolls;  gets assigned to the body if nothing is defined
    scrollElement?: HTMLElement;

    // the element that you'd like the effects from scrolling the scrollElement applied
    // to; essentially the element that moves as you scroll
    parallaxElement?: HTMLElement;

    // what you want to call it to find the particular instance of it if you need to debug
    name?: string;

    // optional callback function for additional actions during scaling
    cb?(): void;

    // arguments for optional callback entered into an array; for context-specific
    cb_args?: any[];

    // callback context in the case where the callback is context-specific
    cb_context?: any;
}

@Directive({
    selector: '[parallax]'
})
export class Parallax implements OnInit {
    name: string = 'parallaxDirective';

    @Input() config: ParallaxConfig;
    // the following @Inputs are all part of the config object, which for
    // brevity's sake, you can do a bunch of operations in bulk by passing
    // in the config object; caveat for this is that angular 2 won't permit
    // more than 9 keys being passed in an object via the template
    @Input() cssKey: string = 'transform';
    @Input() cssProperty: string = 'translate3d';
    @Input() axis: 'X' | 'Y' = 'Y';
    @Input() ratio: number = -2;
    @Input() initialValue: number = 0;
    @Input() canMove: any = true;
    @Input() scrollerId: string;
    @Input() maxValue: number;
    @Input() minValue: number;
    @Input() cssUnit: string = '%';
    @Input() cb: any;
    @Input() cb_context: any = null;
    @Input() cb_args: any[] = [];
    @Input() scrollElement: any;
    @Input() parallaxElement: HTMLElement;
    @Input() throttleInterval: number = 3;
    @Input() valueFixedDigits: number = 2;

    parallaxStyles: {} = {};

    private cssValue: string;
    private isSpecialVal: boolean = false;
    private canTrigger: boolean = true;

    private hostElement: HTMLElement;

    private evaluateScroll = () => {
        if (this.canMove) {
            let resultVal: string;
            let calcVal: number;

            // Calculating the percentage makes the scrolling somehow smoother in my testing.
            let maxScrollHeight = document.documentElement.scrollHeight;
            if (this.scrollElement instanceof Window)
                // calcVal = this.scrollElement.scrollY * this.ratio + this.initialValue;
                calcVal = ((this.scrollElement.scrollY / maxScrollHeight) * 100) * this.ratio;
            else
                // calcVal = this.scrollElement.scrollTop * this.ratio + this.initialValue;
                calcVal = ((this.scrollElement.scrollTop / maxScrollHeight) * 100) * this.ratio;

            if (this.maxValue !== undefined && calcVal >= this.maxValue)
                calcVal = this.maxValue;
            else if (this.minValue !== undefined && calcVal <= this.minValue)
                calcVal = this.minValue;

            calcVal = parseFloat(calcVal.toFixed(this.valueFixedDigits));
            // added after realizing original setup wasn't compatible in Firefox
            // debugger;
            if (this.cssKey === 'backgroundPosition') {
                if (this.axis === 'X') {
                    resultVal = 'calc(50% + ' + calcVal + this.cssUnit + ') center';
                } else {
                    resultVal = 'center calc(50% + ' + calcVal + this.cssUnit + ')';
                }
                // I've only tested this on the X-axis.
            } else if (this.cssKey === 'transform' && this.cssProperty === 'translate3d') {
                resultVal = this.cssProperty + '(0px,' + calcVal + this.cssUnit + ',0px)';
            }
            else if (this.isSpecialVal) {
                resultVal = this.cssValue + '(' + calcVal + this.cssUnit + ')';
            }
            else {
                resultVal = calcVal + this.cssUnit;
            }

            if (this.cb) {
                // console.log('this should be running')
                this.cb.apply(this.cb_context, this.cb_args);
            }
            this.parallaxElement.style[this.cssKey] = resultVal;
            this.canTrigger = true;
        }
    }

    public ngOnInit() {
        let cssValArray: string[];

        // console.log('%s initialized on element', this.name, this.hostElement);
        // console.log(this);

        for (let prop in this.config) {
            this[prop] = this.config[prop];
        }
        this.cssProperty = this.cssProperty ? this.cssProperty : 'backgroundPositionY';
        if (this.cssProperty.match(/backgroundPosition/i)) {
            if (this.cssProperty.split('backgroundPosition')[1].toUpperCase() === 'X') {
                this.axis = 'X';
            }

            this.cssProperty = 'backgroundPosition';
        }
        // I couldn't figure out what this is actually used for. Both the cssKey and cssProperty is set to 'translate3d' in this block before ignoring the block.
        // (If not using the transform css property, this can be out-commented.
        /*
        cssValArray = this.cssProperty.split(':');
        this.cssKey = cssValArray[0];
        this.cssValue = cssValArray[1];
        */

        this.isSpecialVal = this.cssValue ? true : false;
        if (!this.cssValue) this.cssValue = this.cssKey;

        this.ratio = +this.ratio;
        this.initialValue = +this.initialValue;

        this.parallaxElement = this.parallaxElement || this.hostElement;
        if (!this.scrollElement) {
            if (document.getElementById('parallaxScroll'))
                this.scrollElement = document.getElementById('parallaxScroll');
            else if (this.scrollerId) {
                try {
                    this.scrollElement = document.getElementById(this.scrollerId);
                    if (!this.scrollElement)
                        throw (`The ID passed through the parallaxConfig ('${this.scrollerId}') object was not found in the document.  Defaulting to tracking the scrolling of the window.`);
                } catch (e) {
                    console.warn(e);
                    this.scrollElement = window;
                }
            } else this.scrollElement = window;
        }
        //this.scrollElement.addEventListener('scroll', this.evaluateScroll.bind(this));
        window.requestAnimationFrame(this.evaluateScroll);
    }

    constructor(element: ElementRef) {
        this.hostElement = element.nativeElement;
    }

    @HostListener("window:scroll", [])
    onScroll() {
        if (this.canTrigger) {
            this.canTrigger = false;
            const triggerInterval = timer(this.throttleInterval);
            triggerInterval.subscribe(() => {
                window.requestAnimationFrame(this.evaluateScroll);
            });
        }
    }
}

