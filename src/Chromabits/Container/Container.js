'use strict';

let ensure = require('ensure.js'),
    introspect = require('retrieve-arguments');

let Wrap = require('./Wrap'),
    Loader = require('../Loader/Loader'),
    Nullable = ensure.Nullable;

/**
 * Class Container
 *
 * An Inversion of Control container
 */
class Container
{
    /**
     * Construct an instance of a Container
     */
    constructor ()
    {
        /**
         * Container bindings
         *
         * @type {Array}
         */
        this.bindings = [];

        /**
         * Singleton instances
         *
         * @type {Array}
         */
        this.instances = [];

        /**
         * Factory functions
         *
         * @type {Array}
         */
        this.factories = [];

        /**
         * Abstract types that should be shared (singletons after built)
         *
         * @type {Array}
         */
        this.shared = [];

        this.buildStack = [];

        /**
         * Class loader
         *
         * @type {null|Loader}
         */
        this.loader = null;

        /**
         * The max depth dependencies will be explored
         *
         * Circular dependencies or overly complex applications
         * might cause the container to reach this limit and bail.
         *
         * If you are encountering this issue, you can increase the value below
         *
         * @type {number}
         */
        this.maxDepth = 255;

        /**
         * Make the container available as a service
         */
        this.instance('EnclosureContainer', this);
    }

    /**
     * Bind a singleton instance to an abstract
     *
     * @param abstract
     * @param instance
     */
    instance (abstract, instance)
    {
        // If the abstract is an array, we will assume it is an array of strings
        // of each each abstract we want to bind the instance to
        if (ensure.isArray(abstract)) {
            abstract.forEach((single) => {
                ensure(single, String);

                this.instances[single] = instance;
            });
        } else {
            ensure(abstract, String);

            this.instances[abstract] = instance;
        }
    }

    /**
     * Bind an abstract with a concrete with an abstract
     *
     * Acceptable concrete types are Wrap objects or a String
     * reference to another abstract type which eventually
     * should resolve into a concrete
     *
     * @param abstract
     * @param concrete
     * @param shared
     */
    bind (abstract, concrete, shared)
    {
        ensure(abstract, String);
        // TODO: #1: Type-check concrete param once ensure.js supports Maybe

        // If the concrete implementation is either a string or a Wrap,
        // we just create a binding
        if (concrete instanceof Wrap
            || concrete instanceof Function
            || ensure.isString(concrete)) {
            this.bindings[abstract] = concrete;

            if (shared) {
                this.shared[abstract] = true;
            }

            return;
        }

        throw new Error('Unsupported binding type');
    }

    /**
     * Bind a factory function to an abstract
     *
     * @param abstract
     * @param concrete
     * @param shared
     */
    factory (abstract, concrete, shared)
    {
        ensure(abstract, String);
        ensure(concrete, Function);

        this.factories[abstract] = concrete;

        if (shared) {
            this.shared[abstract] = true;
        }
    }

    /**
     * Attempt to find the concrete implementation associated with
     * an abstract
     *
     * @param abstract
     *
     * @returns {*}
     */
    getConcrete (abstract)
    {
        // If the abstract is not defined in the bindings array
        // then we can't find a concrete, so we have to bail
        if (!(abstract in this.bindings) && !(abstract in this.factories)) {
            throw new Error(
                'Unable to resolve concrete type: ' + abstract
            );
        }

        if (abstract in this.bindings) {
            var concrete = this.bindings[abstract];

            // If the concrete is a string, then it still is abstract
            // so we need to recurse and try to find it's concrete
            if (ensure.isString(concrete)) {
                return this.getConcrete(concrete);
            }

            // If there is a Wrap or constructor bound to the abstract, then we
            // know it is actually already concrete already
            if (concrete instanceof Wrap || concrete instanceof Function) {
                return abstract;
            }
        } else if (abstract in this.factories) {
            // If there is a factory function for the abstract, then we know
            // it is actually a concrete already
            return abstract;
        }

        throw new Error(
            'Unable to resolve concrete type. Unknown binding type'
        );
    }

    /**
     * Resolve the abstract in the container
     *
     * @param abstract
     *
     * @returns {*}
     */
    make (abstract)
    {
        // If there is a singleton instance being managed, return it
        if (abstract in this.instances) {
            return this.instances[abstract];
        }

        // Get concrete
        var concrete = abstract;
        try {
            concrete = this.getConcrete(abstract);

            // If buildable, build one
            if (this.isBuildable(concrete)) {
                var instance = this.build(concrete);

                // If the abstract type is marked as shared, we will cache the
                // instance as a singleton so subsequent calls to make will
                // return the same instance
                if (abstract in this.shared) {
                    this.instance(abstract, instance);
                }

                return instance;
            }
        } catch (err) {
            // Fall back to building a class using the loader (if it is present)
            if (this.loader && this.loader.has(abstract)) {
                var constructor = this.loader.get(abstract);
                var dependencies = this.resolveDependencies(constructor);

                var instance = Object.create(constructor.prototype);

                constructor.apply(instance, dependencies);

                return instance;
            }

            throw err;
        }

        throw new Error('Unable to build abstract: ' + abstract);
    }

    /**
     * Construct a new instance of the specified concrete
     *
     * @param concrete
     * @param parameters
     *
     * @returns {*}
     */
    build (concrete, parameters)
    {
        parameters = parameters || [];

        // Check if there is a factory function defined for this function
        // If there is one, we will use it to build the instance. This
        // allows functions to be defined as more refined resolvers
        if (concrete in this.factories) {
            var factoryArguments = [this].concat(parameters);

            var factoryFunction = this.factories[concrete];

            return factoryFunction.apply(
                Object.create(factoryFunction.prototype),
                factoryArguments
            );
        }

        this.buildStack.push(concrete);

        // Check if we have descended too much into the dependency tree.
        // This could mean we have a circular dependency or a very complex
        // application
        if (this.buildStack.length > this.maxDepth) {
            throw new Error(
                'Max dependency depth reached.'
                + 'Possible circular dependency'
            );
        }

        // If the concrete is a Wrap object, we can resolve its dependencies
        // and then construct an instance
        if (this.isWrapped(concrete)) {
            var wrap = this.bindings[concrete];

            var dependencies = this.resolveDependencies(wrap);

            // When calling the constructor in the Wrap object, we pass a
            // reference to this container, and all the dependencies as
            // arguments
            var constructorArguments = [this].concat(dependencies, parameters);

            var constructor =  wrap.getConstructor();

            this.buildStack.pop();

            return constructor.apply(
                Object.create(constructor.prototype),
                constructorArguments
            );
        }

        // If the concrete is just a function, then we will assume it is a
        // service constructor. We will use introspection to find out which are
        // its dependencies
        if (
            concrete in this.bindings
            && this.bindings[concrete] instanceof Function
        ) {
            var constructor = this.bindings[concrete];

            var dependencies = this.resolveDependencies(constructor);

            this.buildStack.pop();

            // Do some magic to call new with a variable number of arguments
            // See http://goo.gl/R7Dpt
            var instance = Object.create(constructor.prototype);

            constructor.apply(instance, dependencies);

            return instance;
        }

        throw new Error(
            'Unable to resolve. The concrete type is not instantiable'
        );
    }

    /**
     * Use the container to get the dependencies of a Wrap or a constructor
     * function
     *
     * @param {Function|Wrap} construct
     *
     * @returns {Array}
     */
    resolveDependencies (construct)
    {
        var dependenciesNames = [],
            dependencies = [];

        if (construct instanceof Wrap) {
            dependenciesNames = construct.getDependencies();
        } else if (construct instanceof Function) {
            dependenciesNames = introspect(construct);
        }

        dependenciesNames.forEach((dependencyName) => {
            dependencyName = dependencyName.replace(/_/g, '/');

            dependencies.push(this.make(dependencyName))
        });

        return dependencies;
    }

    /**
     * Check that a concrete object is wrapped in an Enclosure wrap
     *
     * @param concrete
     *
     * @returns {boolean}
     */
    isWrapped (concrete)
    {
        return (concrete in this.bindings &&
        this.bindings[concrete] instanceof Wrap);
    }

    /**
     * Check if an abstract is resolvable by this container
     *
     * @param abstract
     *
     * @returns {boolean}
     */
    isResolvable (abstract)
    {
        if (this.instances[abstract]) {
            return true;
        }

        try {
            var concrete = this.getConcrete(abstract);

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Get whether a concrete type can be built by this container
     *
     * @param concrete
     * @returns {boolean}
     */
    isBuildable (concrete)
    {
        // If we have a factory function, we can build the type
        if (concrete in this.factories) {
            return true;
        }

        // If we have a wrap or constructor, we can also build it
        if (concrete in this.bindings
            && (this.bindings[concrete] instanceof Wrap)
            || (this.bindings[concrete] instanceof Function)) {
            return true;
        }

        return false;
    }

    /**
     * Set the loader to use for automatic class loading and instantiation
     *
     * @param loader
     */
    setLoader (loader)
    {
        ensure(loader, Loader);

        this.loader = loader;

        this.instance('Chromabits/Loader/Loader', loader);
    }

    /**
     * Load a class constructor
     *
     * A simple alias for the Loader's get method
     *
     * @param fullClassName
     *
     * @returns {Function}
     */
    use (fullClassName)
    {
        if (this.loader) {
            return this.loader.get(fullClassName);
        }

        throw new Error('This container does not have a loader attached');
    }

    /**
     * Installs container shortcut properties into a specific object
     *
     * This is useful for making the container available on the global or window
     * contexts.
     *
     * @param target
     */
    installTo (target)
    {
        ensure(target, Object);

        target.container = this;

        if (this.loader) {
            target.use = this.use.bind(this);
        }
    }
}

module.exports = Container;
