import { SimpleChange } from '@angular/core';

/**
 * Typed version of angular's SimpleChange to improve tooling in ngOnChanges.
 * From: https://github.com/angular/angular/issues/17560
 */
export declare class SimpleChangeGeneric<T = any> extends SimpleChange {
    /** @inheritdoc */
    constructor(previousValue: T, currentValue: T, firstChange: boolean);
    /** @inheritdoc */
    previousValue: T;
    /** @inheritdoc */
    currentValue: T;
    /** @inheritdoc */
    firstChange: boolean;
    /**
     * Check whether the new value is the first value assigned.
     */
    isFirstChange(): boolean;
}
