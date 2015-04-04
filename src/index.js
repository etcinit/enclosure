'use strict';

import BaseContainer from './Chromabits/Container/Container';
import BaseWrap from './Chromabits/Container/Wrap';
import Loader from './Chromabits/Loader/Loader.js';
import Bootstrapper from './Chromabits/Bootstrapper/Bootstrapper.js';

export var Container = BaseContainer;
export var Wrap = BaseWrap;

/**
 * Create a basic environment for setting up a container
 *
 * This allows to use the `use()` function to load Enclosure classes
 * before the container itself is setup.
 *
 * @returns {*}
 */
export function prelude () {
    return this.preludeTo(global);
}

/**
 * Create a basic environment inside a specific object
 *
 * This allows to use the `use()` function to load Enclosure classes
 * before the container itself is setup.
 *
 * @returns {*}
 */
export function preludeTo (target) {
    Bootstrapper.setupPrelude(target);
}

/**
 * Use the bootstrapper
 *
 * @param options
 *
 * @returns {Application}
 */
export function boot (options) {
    let bootstrapper = new Bootstrapper(options);

    return bootstrapper.boot();
}

/**
 * Use the bootstrapper but do not run the entry point
 *
 * @param options
 *
 * @returns {Application}
 */
export function softBoot (options) {
    let bootstrapper = new Bootstrapper(options);

    return bootstrapper.softBoot();
}
