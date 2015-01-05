# Enclosure

A Javascript IOC container and module loading system

---

## Roadmap

This library is still a work in progress. The main goal is to build some basic tools which should allow building complex service-based/class-based applications in JavaScript easy. Many of these concepts are borrowed from PHP/Laravel/Symfony development. Some of the planned features are:

- A complete service/IOC container
	- Singleton services
	- Shared services (cached services)
	- Factory functions
	- Service providers, which could be defined inside `package.json` or a `providers.json` and be automatically loaded by the container
- An alternative to Node's `require` function
	- Abstract the process of requiring modules from the filesystem
	- Introduce something losely similar to namespaces from other languages. Namespaces would be defined based on the filepath in the project: `src/Chromabits/Mailer/MandrillMailer.js` should be accessible by doing something like `var MandrilMailer = use('Chromabits/Mailer/MandrillMailer')`.
	- Introduce a new `namespace` key to `package.json` which would be parsed by the Enclosure loader in order to figure out namespace to filesystem mappings.

## Current status

There is a basic implementation of the Container and Wrap classes (Wraps are explained below). The container should allow defining singletons, services built by factory functions, and "Wrapped" services.

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

Defining a "wrapped service":

```js
var myServiceWrap = new Wrap(['DependencyOne', 'DependencyTwo'], function (DependencyOne, DependencyTwo) {
	// When this function is called, dependencies will be passed
	// as arguments. In this case, we just pass them along to the
	// constructor of our service so that we can use them inside it
	return new ServiceOne(DependencyOne, DependencyTwo);
});

app.bind('ServiceOne', myServiceWrap);
```

Using a service:

```js
var myService = app.make('ServiceOne');
```

## Wraps

Wraps are delicious. They are a simple construct for coupling dependency definitions and a function for building that service.

// TODO

## Factories

Factory functions allow you to tell the container how to build a service for you. They are executed every time the container needs that service.

// TODO
