# Enclosure [![Build Status](https://travis-ci.org/eduard44/enclosure.svg?branch=master)](https://travis-ci.org/eduard44/enclosure)

A Javascript IOC container and module loading system

---

## Roadmap

This library is still a work in progress. The main goal is to build some basic tools which should allow building complex service-based/class-based applications in JavaScript easy. Many of these concepts are borrowed from PHP/Laravel/Symfony development. Some of the planned features are:

- A complete service/IOC container
	- [X] Singleton services
	- [ ] Shared services (cached services)
	- [X] Factory functions
	- [ ] Service providers, which could be defined inside `package.json` or a `providers.json` and be automatically loaded by the container
- An alternative to Node's `require` function
	- [ ] Abstract the process of requiring modules from the filesystem
	- [ ] Introduce something losely similar to namespaces from other languages. Namespaces would be defined based on the filepath in the project: `src/Chromabits/Mailer/MandrillMailer.js` should be accessible by doing something like `var MandrilMailer = use('Chromabits/Mailer/MandrillMailer')`.
	- [ ] Introduce a new `namespace` key to `package.json` which would be parsed by the Enclosure loader in order to figure out namespace to filesystem mappings.

## Current status

There is a basic implementation of the Container and Wrap classes (Wraps are explained below). 
The container should allow defining singletons, services built by factory functions, and "Wrapped" services.
It will also detect circular dependencies. 

TODO: The Loader system, advanced container features (Shared services, Service providers)

## Usage

First, require the library using npm:

```
npm install enclosure
```

Then, the next step is to create a container for your application and register services into it. You should place the container instance in a global variable or pass it along to your application components so that they can resolve dependencies from it.

```js
var enclosure = require('enclosure'),

	Container = enclosure.Container,
	Wrap = enclosure.Wrap;

var app = new Container();
```

Defining a singleton service:

```js
var myServiceInstance = new ServiceOne();

app.instance('ServiceOne', myServiceInstance);
```

Using a service:

```js
var myService = app.make('ServiceOne');
```

## Constructor dependency injection

Defining a service using constructor dependency injection:

```js
// Enclosure's Container will use instrospection to look
// at the constructor's parameters and try to resolve
// services with matching names
var ServiceTwo = function (ServiceOne) {
	// Keep references to service instances
	this.one = ServiceOne;
};

app.bind('ServiceTwo', ServiceTwo);

var instanceTwo = app.make('ServiceTwo');
```

If you would like to access the container directly within a service declare `EnclosureContainer` as a dependency:

```js
var ServiceThree = function (EnclosureContainer) {
	this.app = EnclosureContainer;
	
	// Then you can call the container from within your class
	// ex: var someService = this.app.make('SomeService');
};

app.bind('ServiceThree', ServiceThree);
```

## Factories

Factory functions allow you to tell the container how to build a service for you. They are executed every time the container needs that service.

```js
app.factory('ServiceFour', function (container) {
	var instanceOne = container.make('ServiceOne');
	
	// In this example ServiceFour requires a configuration object
	// as the first parameter of the constructor, so constructor DI does
	// not work. The factory function allows us to tell the container
	// how to build this service
	return new ServiceFour({ sayHello: true }, instanceOne);
});
```

## Wraps

Wraps are delicious. They are a simple construct for coupling dependency definitions and a factory function for building a service instance.

Wraps are useful when constructor dependency injection is not applicable, which can happen when your class requires parameters in the constructor which are not services, or when your code is minified (parameters names are lost).

Defining a "wrapped service":

```js
var myServiceWrap = new Wrap(['DependencyOne', 'DependencyTwo'], function (container, DependencyOne, DependencyTwo) {
	// When this function is called, dependencies will be passed
	// as arguments. In this case, we just pass them along to the
	// constructor of our service so that we can use them inside it
	return new ServiceOne(DependencyOne, DependencyTwo, 'some config string');
});

app.bind('ServiceOne', myServiceWrap);
```
