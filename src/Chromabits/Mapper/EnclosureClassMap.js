'use strict';

import path from 'path';

import DirectoryMapper from './DirectoryMapper';
import ClassMap from './ClassMap';
import Container from '../Container/Container';

/**
 * EnclosureClassMap
 *
 * A class map containing Enclosure's own classes and objects
 *
 * @type {ClassMap}
 */
let map;

if (typeof window !== 'undefined') {
    map = new ClassMap();

    map.addConstructor(
        '/Chromabits/Container/Container',
        Container
    );
} else {
    map = new DirectoryMapper(path.resolve(__dirname, '../../'))
        .generate();
}

export default map;
