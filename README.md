![Logo](http://i.imgur.com/KXjzLDF.png)
# Enclosure 

A Javascript IOC container and module loading system

---

## About

Enclosure is a library that aims to make developing complex Node.js applications easier. It provides a simple foundation for getting an Inversion of Control container and Module Loading system in your application.

The IoC container acts as a centralized repository of service singletons and factory functions. Whenever you define a service in your application, you register it in the container, and when you need to use it you ask the container to construct an instance or pass along a reference to the singleton.

While you could implement similar functionality by defining all services in a global object, the IoC container has the added benefit that it can perform Dependency Injection and it can resolve aliases. Dependency Injection is very useful for testing since it allows you to quickly replace a component of your application with a mock or stub for testing, without having to change the code that uses it at all.

The second half of Enclosure consists of a module loading system. This sounds redundant since Node.js already includes `require`. However, as
applications grow more complicated and the number .js files in your source folder keeps growing, requiring files from each other creates a very spaghetti like situation which makes it really hard to refactor code.

The Loader requires you to structure your project in a very specific way (inspired by PHP's PSR standards), but once it is setup, it allows you include files using an absolute path format rather than using relative paths. This allows you to quickly move files around in your project without having to worry too much about broken requires.

Additionally, Enclosure provides other utility components such as an extended container with support for Service Providers. 

## Roadmap

This library is still a work in progress. The main goal is to build some basic tools which should allow building complex service-based/class-based applications in JavaScript easy. Many of these concepts are borrowed from PHP/Laravel/Symfony development. Some of the planned features are:

- A complete service/IOC container
	- [X] Singleton services
	- [X] Shared services (cached services)
	- [X] Factory functions
	- [ ] Service providers, which could be defined inside `package.json` or a `providers.json` and be automatically loaded by the container (In progress)
- An alternative to Node's `require` function
	- [X] Abstract the process of requiring modules from the filesystem
	- [X] Introduce something losely similar to namespaces from other languages. Namespaces would be defined based on the filepath in the project: `src/Chromabits/Mailer/MandrillMailer.js` should be accessible by doing something like `var MandrilMailer = use('Chromabits/Mailer/MandrillMailer')`.
	- [ ] Introduce a new `namespace` key to `package.json` which would be parsed by the Enclosure loader in order to figure out namespace to filesystem mappings.

### Current status

There is a basic implementation of the Container and Wrap classes (Wraps are explained below). 
The container should allow defining singletons, services built by factory functions, and "Wrapped" services.
It will also detect circular dependencies. 

The Application class, which is extension of the Container class, is capable of loading service providers,
registering them and booting them.

The loader system is sort of working but requires more extensive testing. 

TODO: Testing, defining things in package.json, better bootstrap experience

## Usage

### Installation

Installation is simple. Just require the library using npm:

```
npm install enclosure
```

and then reference it from your code:

```js
var enclosure = require('enclosure');
```

### Compatibility

Currently, Enclosure only officially supports Node.js environments, mostly due to the dependency on the filesystem. It should be possible to the container component on browser applications by using libraries like Browserify.

Additionally, when installing Enclosure to the global scope, the following variables are reserved: `container`, `use`

## The Container Component

### Getting started

After installation, the next step is to create a container for your application and register services into it. You should install the container instance into the global variable (more on that below) or pass it along to your application components so that they can resolve dependencies from it.

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

### Installing

It is possible to install the container into an object such as the `global` object. This makes it easier to access the container throughout your application:

```js
app.installTo(global)

// At this point, the container is available globally
var myService = container.make('ServiceOne');
```

Enclosure does not install itself automatically to the global context since there might be cases where you want to avoid using global variables or another library uses the required variables.

### Constructor dependency injection

Defining a service using constructor dependency injection:

```js
// Enclosure's Container will use instrospection to look
// at the constructor's parameters and try to resolve
// services with matching names
var ServiceTwo = function (ServiceOne) {
	// Keep references to service instances
	this.one = ServiceOne;
};

container.bind('ServiceTwo', ServiceTwo);

var instanceTwo = container.make('ServiceTwo');
```

If you would like to access the container directly within a service declare `EnclosureContainer` as a dependency:

```js
var ServiceThree = function (EnclosureContainer) {
	this.app = EnclosureContainer;
	
	// Then you can call the container from within your class
	// ex: var someService = this.app.make('SomeService');
};

container.bind('ServiceThree', ServiceThree);
```

### Factories

Factory functions allow you to tell the container how to build a service for you. They are executed every time the container needs that service.

```js
container.factory('ServiceFour', function (container) {
	var instanceOne = container.make('ServiceOne');
	
	// In this example ServiceFour requires a configuration object
	// as the first parameter of the constructor, so constructor DI does
	// not work. The factory function allows us to tell the container
	// how to build this service
	return new ServiceFour({ sayHello: true }, instanceOne);
});
```

### Wraps

Wraps are delicious. They are a simple construct for coupling dependency definitions and a factory function for building a service instance.

Wraps are useful when constructor dependency injection is not applicable, which can happen when your class requires parameters in the constructor which are not services, or when your code is minified (parameters names are lost).

Defining a "wrapped service":

```js
var myServiceWrap = new Wrap(
    ['DependencyOne', 'DependencyTwo'], 
    function (container, DependencyOne, DependencyTwo) {
	    // When this function is called, dependencies will be passed
	    // as arguments. In this case, we just pass them along to the
	    // constructor of our service so that we can use them inside it
	    return new ServiceOne(DependencyOne, DependencyTwo, 'some config string');
});

container.bind('ServiceOne', myServiceWrap);
```

## The Loader Component

### Mappers

### Class Maps

### use() vs require()

If you installed the container globally, you can use the `use()` function as a replacement of `require()` (This function is also available as `container.use()`).

### Automatic construction