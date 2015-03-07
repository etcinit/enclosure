![Logo](http://i.imgur.com/qAoBgMP.png)
# [Enclosure](http://enclosure.me) ![Build Status](https://travis-ci.org/etcinit/enclosure.svg?branch=develop)

A Javascript IOC container and module loading system

---

## Introduction

Before you begin, take note that Enclosure is a VERY opinionated way of writing 
Javascript code. It really asks you to write code in a very specific way, and 
yes, the code written on it looks a lot like PHP and Java (There is a reason
for it), and just plain weird.

### Things that you will probably like:

- Complex and automated dependency injection
- Automated file loading and construction of classes
- No more relative paths on your Node.js code!
- Support for ES6
- Everything in classes!

### Things that you will probably won't like:

- Everything in classes!
- It looks like PHP/Java (yes, there's even an entrypoint class with `main()`)
- It doesn't fit in well with other libraries (yet)
- It doesn't port to the web browser (yet)
- You have to write your project around it

## About

Enclosure is a library that aims to make developing complex Node.js applications easier. It provides a simple foundation for getting an Inversion of Control container and Module Loading system in your application.

The IoC container acts as a centralized repository of service singletons and factory functions. Whenever you define a service in your application, you register it in the container, and when you need to use it you ask the container to construct an instance or pass along a reference to the singleton.

While you could implement similar functionality by defining all services in a global object, the IoC container has the added benefit that it can perform Dependency Injection and it can resolve aliases. Dependency Injection is very useful for testing since it allows you to quickly replace a component of your application with a mock or stub for testing, without having to change the code that uses it at all.

The second half of Enclosure consists of a module loading system. This sounds redundant since Node.js already includes `require`. However, as
applications grow more complicated and the number .js files in your source folder keeps growing, requiring files from each other creates a very spaghetti-like situation which makes it really hard to refactor code.

The Loader requires you to structure your project in a very specific way (inspired by PHP's PSR standards), but once it is setup, it allows you include files using an absolute path format rather than using relative paths. This allows you to quickly move files around in your project without having to worry too much about broken `require()`s.

Additionally, Enclosure provides other utility components such as an extended container with support for Service Providers and automated Bootstrapper. 

### What it actually ends up looking like:

After setting up the container and module loader, writing applications with Enclosure ends up looking something like this (using EcmaScript 6):

```js
// With Enclosure it is possible to stop using `require` in certain
// parts of your application and just reference you classes by their
// absolute namespace
let ResponseFactory = use('MyBlog/Http/ResponseFactory'),
    Controller = use('MyBlog/Http/BaseController');

/**
 * Class IndexController
 *
 * Handles main app routes
 */
class IndexController extends Controller
{
    /**
     * Construct an instance of a IndexController
     *
     * @param {LanguageService} MyBlog_Support_LanguageService
     */
    constructor (MyBlog_Support_LanguageService)
    {
        // When the container resolves the controller class, it will
        // automatically provide dependencies through the constructor.
        // Due to language restrictions, MyBlog_Support_LanguageService 
        // is used as an alias for MyBlog/Support/LanguageService
        this.lang = MyBlog_Support_LanguageService;
    }
    
    /**
     * GET /api/v1/
     * 
     * @return {Response}
     */
    getHome ()
    {
        let welcomeMessage = this.lang.get('index.welcome', 'en-us');
        
        return ResponseFactory.make({
            message: welcomeMessage;
        });
    }
}
```

## Roadmap

This library is still a work in progress. Specific features are being tracked on GitHub issues. Main project features are listed below:

- **The Container Component:** A complete service/IOC container
    - [X] Singleton services
    - [X] Shared services (cached services)
    - [X] Factory functions
    - [X] Service providers
    - [ ] Deferred service providers
    - [X] Load providers defined in `package.json`
- **The Loader Component:** An alternative to Node's `require` function
    - [X] Abstract the process of requiring modules from the filesystem (`use()`)
    - [X] Introduce something loosely similar to namespaces from other languages. Namespaces would be defined based on the file path in the project: `src/Chromabits/Mailer/MandrillMailer.js` should be accessible by doing something like `var MandrilMailer = use('Chromabits/Mailer/MandrillMailer')`.
    - [X] Introduce a new `autoload` key to `package.json` which would be parsed by the Enclosure loader in order to figure out namespace to filesystem mappings.
    - [ ] Add a mapper capable of exploring libraries in `node_modules` and discover namespaces provided by each library
    - [ ] Cache class maps (a lot like PHP Composer's dump-autoload)

### Near-term improvements:

- [ ] Better test coverage (>80%)
- [X] `package.json` extensions
- [X] Better bootstrap experience

### Current status

- **Bootstrapper Component:** The bootstrapper component is capable of setting up a container, an application, service providers, and a loader with a single method call.
- **Container Component:** There is an almost complete implementation of the IoC container. Services can be defined through a binding, a factory. Services can also be singletons, or stored as singletons once they are resolved (Shared services). Services can define dependencies through their constructors or a Wrap. Circular dependencies can be detected. The container can also fallback to the loader if a service cannot be resolved, and even apply dependency injection to this method.
- **Application Component:** Is an extension of the Container, and is able to register and boot Service Providers, which can be referenced just by their class name thanks to the Loader component.
- **Loader Component:** Is capable of resolving class constructors and modules from a full namespace path (`Name/Space/Class`). Currently the two possible class map generators can generate class maps for directories and for Enclosure itself. The component is flexible enough for future mappers to be added in the future.

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

## The Bootstrapper Component

### First steps

If you are developing an application with Enclosure (not a library), a good place to start to use the Bootstrapper class. This class can automatically setup Enclosure for you. All you need to do is add some extra information to your `package.json` and call the library. 

Example `index.js`:

```js
// This creates, setups and runs an application container
require('enclosure').boot();
```

Example `package.json`:

```js
{
    // ...
    "entrypoint": "MyBlog/Console/App",
    "providers": [
        "MyBlog/Http/Providers/RouterServiceProvider",
        "MyBlog/Mail/MailServiceProvider"
    ],
    "autoload": {
        "roots": ["src"]
    }
    // ...
}
```

Each of these keys will be explained more in detail in the sections below. However, note that **none of these are required** for `boot()` to work properly, although you will probably want to use them to include your own classes.

The boot function can also take additional options:

```js
// You are not required to use package.json
require('enclosure').boot({
    metadata: '/path/to/metadata.json'
});

// You can also just provide the metadata directly
require('enclosure').boot({
    metadata: {
        "entrypoint": "MyBlog/Console/App",
        "providers": [
            "MyBlog/Http/Providers/RouterServiceProvider",
            "MyBlog/Mail/MailServiceProvider"
        ],
        "autoload": {
            "roots": ["src"]
        }
    }
});

// You can also specify where to install the container
// See the section on the Container component for a description
// of what this actually means
require('enclosure').boot({
    installTo: someObject
});
```

#### Global variables

After running the bootstrapper, the container should be available under `container` global variable. The loader can be used through the `use()` global variables. Unless you provided a different install context through the `installTo` config option.

#### Project Structure

While it is not enforced in any way, most examples will assume the following project structure:

```
src/
    Example/
        App.js
        Controllers/
            IndexController.js
            ...
        Providers
            RandomServiceProvider.js
            ...
        ...
test/
    ...
index.js
package.json
```

The matching metadata configuration is:

```js
//...
"entrypoint": "Example/App",
"providers": ["Example/Providers/RandomServiceProvider"],
"autoload": {
    "roots": ["src"]
}
//...
```

#### The Entrypoint

So you have probably noticed the `entrypoint` configuration key. This tells the bootstrapper where to go next once your application has been booted. The entrypoint is treated as any other service and will have it dependencies resolved during instantiation.

Example `App.js`:

```js
// Dependency injection
var App = function (ServiceOne, ServiceTwo) {
    this.serviceOne = ServiceOne;
    this.serviceTwo = ServiceTwo;
};

// Command line arguments are passed in for convenience
App.prototype.main = function (args) {
    // This is where you would start setting up your app,
    // launch servers, etc
};

module.exports = App;
```

`main(args)` gets called once `enclosure.boot()` has finished setting up the environment.

#### Seeing is better than reading (sometimes):

Check out the example project for a near comprehensive use of all the features in Enclosure. The project is located under the `example/` directory. Please note that this project is written in EcmaScript 6 (ES6).

### Prelude Environment

If you want more control on how Enclosure is setup, you can use the Prelude environment. You will have to manually setup the Container and Loader components.

After installation, the first thing you'll probably want to do is use one of Enclosure's classes. On previous versions, these were inside the enclosure object itself (`enclosure.Container`). However, since newer versions include more classes, this method was dropped since it requires every file in enclosure when it is required, which can be slow.

Instead, Enclosure makes use of it's own Loader component (the `use()` function) for getting classes. The initial prelude environment is only capable of resolving classes that are inside the library. 

To initialize the bootstrap environment, just call the following function before any call to `use()`:

```js
require('enclosure').prelude();

// Now you can use Enclosure's classes by using use()
var Container = use('Chromabits/Container/Container');
var instance = new Container();

// You can also specify where to install the environment to if you 
// prefer to keep the global context clean
require('enclosure').preludeTo(someObject);
var Container = someObject.use(...);
```

See _The Loader Component_ below for more instructions on how to setup the Loader to load your own classes and how to use the `use()` function.

## The Container Component

### Getting started

Once bootstrapped, the next step is to create a container for your application and register services into it. You should install the container instance into the global variable (more on that below) or pass it along to your application components so that they can resolve dependencies from it.

```js
require('enclosure').prelude();

var Container = use('Chromabits/Container/Container'),
    Wrap = use('Chromabits/Container/Wrap');

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
// Enclosure's Container will use introspection to look
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

#### Limitations

EcmaScript does not allow slashes `/` as part of a parameter name, so as a workaround Enclosure's container can replace underscores `_` with `/` when resolving dependencies in constructors.

Example: `Chromabits_Container_Container` becomes `Chromabits/Container/Container`

If this syntax seems ugly or you need to minify your code, you can always just use Wraps (defined below).

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

### Shared Services

Shared services are services that become singletons once they are built. This means that if the service is never requested it will never be instantiated. However, if it is, the instance will be cached and returned on every subsequent `make` call. 

Shared services can be defined by providing a third parameter to `container.bind` and `container.factory`:

```js
container.bind('ServiceOne', myServiceWrap, true);

container.factory('ServiceFour', function () { ... }, true);
```

### Service Providers

As your application gets more complex, you will probably want to break down how you register services into the container and perhaps perform some setup task as the application prepares to run. This is possible using Service Providers.

Enclosure includes an extension of the Container class called Application. Application is still a container but it has support for handing service providers

#### Example:

Note: The loader component is explained in the section below.

__src/app.js:__

```js
require('enclosure').prelude();

var Application = use('Chromabits/Container/Application'),
    Loader = use('Chromabits/Loader/Loader'),
    DirectoryMapper = use('Chromabits/Mapper/DirectoryMapper'),
    EnclosureMap = use('Chromabits/Mapper/EnclosureClassMap');

// Setup class autoloading
var loader = new Loader();
var mapper = new DirectoryMapper(__dirname);

loader.addMap(mapper.generate());
loader.addMap(EnclosureMap);

// Start the service container
var application = new Application();

application.setLoader(loader);
application.installTo(global);

// Register providers
container.addProvider('Providers/HelloServiceProvider');

// Register services and boot providers
container.register();
container.bootProviders();
```

__src/Providers/HelloServiceProvider.js:__

```js
var ServiceProvider = use('Chromabits/Container/ServiceProvider');

var HelloServiceProvider = function () {
    // Call parent constructor
    ServiceProvider.call(this, arguments);
}

HelloServiceProvider.prototype = new ServiceProvider();

// Here is where we register all services provided in this provider:
HelloServiceProvider.prototype.register = function (app) {
    app.bind('HelloWorld', function () {
        return 'Hello World';
    });
};

// Here we boot the services provided:
HelloServiceProvider.prototype.boot = function (app) {
    var hello = app.make('HelloWorld');
    
    // In this simple case we just call a simple function, but
    // you get the idea
    console.log(hello());
};

module.exports = HelloServiceProvider;
```

#### Example in ES6:

The previous example can be rewritten in EcmaScript 6 for a much simpler syntax:

__src/Providers/HelloServiceProvider.js:__

```js
var ServiceProvider = use('Chromabits/Container/ServiceProvider');

class HelloServiceProvider extends ServiceProvider
{
    register (app) {
         app.bind('HelloWorld', function () {
            return 'Hello World';
        });
    }
    
    boot (app) {
        var hello = app.make('HelloWorld');
    
        // In this simple case we just call a simple function, but
        // you get the idea
        console.log(hello());
    }
}

module.exports = HelloServiceProvider;
```

Enclosure works with transpilers like Babel, so you can use ES6 right now

## The Loader Component

### Class Maps

Enclosure has the concept of a Class Map, which is a simple class capable of mapping a full class name into a function or a JavaScript file.

In most cases, you'll probably won't have to deal with ClassMaps directly, but instead use Mappers (explained below).

#### Class names

The class name convention for Enclosure is borrowed from PHP namespaces, with foward slashes instead of back-slashes as path separators.

_Valid:_

- `Example/Services/Mailer`
- `/Example/App`
- `/Server`
- `Database`

_Invalid:_

- `\..\App`
- `app.js`
- `Example/++/Mailer`
- and many more...

#### EnclosureClassMap

A class map with all Enclosure classes is available as `Chromabits/Mapper/EnclosureClassMap`. This is the map used by the bootstrap environment. However, as soon as you setup your own class loader, Enclosure classes will not be available anymore unless you add this map into your loader.

### Mappers

The first step towards automatic class loading is to use a Mapper. In Enclosure, a Mapper is basically just a factory capable of creating a class map. If you would like to create your own, just extend the `AbstractMapper` class. However, most people will probably just want to use the `DirectoryMapper` which generates a class map by looking at a directory structure.

#### DirectoryMapper

Consider the following project structure:

```
src/
    app.js
    Mailer.js
    Database/
        Post.js
    Controllers/
        ContactController.js
```

__src/app.js:__

```js
require('enclosure').bootstrap();

var DirectoryMapper = use('Chromabits/Mapper/DirectoryMapper');

var mapper = new DirectoryMapper(__dirname);

// Generate the class map
var map = mapper.generate();
```

The generated map in this case will contain the following files:

- `app`
- `Mailer`
- `Database/Post`
- `Controllers/ContactController`

### Containers and Loaders

The last piece of the puzzle is Loaders. Loaders are just classes that group a bunch of class maps together and are able to tell if they can resolve a certain class:

```js
require('enclosure').prelude();

var Container = use('Chromabits/Container/Container'),
    Loader = use('Chromabits/Loader/Loader'),
    DirectoryMapper = use('Chromabits/Mapper/DirectoryMapper'),
    EnclosureMap = use('Chromabits/Mapper/EnclosureClassMap');

// Setup class autoloading
var loader = new Loader();
var mapper = new DirectoryMapper(__dirname);

loader.addMap(mapper.generate()); // Adds app classes
loader.addMap(EnclosureMap); // Adds enclosure classes

loader.has('Chromabits/Container/Application') 
>>> true

loader.has('Example/Fake') 
>>> false
```

A Container can be made more useful by attaching a Loader to it. This will allow it to resolve classes out of the loader if there are no services implementing them:

```js
// Start the service container
var container = new Container();

container.setLoader(loader);

container.installTo(global);
```

__IMPORTANT:__ `setLoader` should be called before `installTo`. Otherwise, the `use()` is not defined/replaced in the target object.

### Putting it all together

Below is a full example of the previous components:

__src/app.js:__

```js
require('enclosure').prelude();

var Container = use('Chromabits/Container/Container'),
    Loader = use('Chromabits/Loader/Loader'),
    DirectoryMapper = use('Chromabits/Mapper/DirectoryMapper'),
    EnclosureMap = use('Chromabits/Mapper/EnclosureClassMap');

// Setup class autoloading
var loader = new Loader();
var mapper = new DirectoryMapper(__dirname);

loader.addMap(mapper.generate());
loader.addMap(EnclosureMap);

// Start the service container
var container = new Container();

container.setLoader(loader);
container.installTo(global);

// World should be resolved automatically in Hello
// Also, note that we never registered Hello or World as services
var hello = container.make('Hello');

console.log(hello.say());
>>> 'hello world'
```

__src/Hello.js:__

```js
var Hello = function (World) {
    this.text = 'hello' + World.say();
};

Hello.prototype.say = function () {
    return this.text;
};

module.export = Hello;
```

__src/World.js:__

```js
var World = function () {};

World.prototype.say = function () {
    return 'world';
};

module.exports = World;
```

### use() vs require()

If you installed the container globally (`installTo(global)`), you can use the `use()` function as a replacement of `require()`. This function is also available as `container.use()`.

The main difference between `require` and `use` is that `use` uses your container's loader to find classes. This has the benefit that you can require classes and objects using an absolute path rather than a relative one.

For example, consider the following structure:

```
src/
    Mailer.js
    Controllers/
        ContactController.js
```

If we needed to use `Mailer` inside the contact controller, we would normally write something like:

```js
var Mailer = require('../Mailer');
```
However, with Enclosure we can use the following syntax (Assuming you setup a class mapper with `src` as the base directory):

```js
var Mailer = use('Mailer');
```

If we move the controller file into another directory, such as `src/Controllers/Front/`:

```js
// This now breaks:
var Mailer = require('../Mailer');
// and has to be changed to this:
var Mailer = require('../../Mailer');

// However, this still works:
var Mailer = use('Mailer');
```

Please note that this function does not construct an instance. It actually returns the constructor function (or whatever you exported in your module). If you would like to create an instance, see automatic construction below.

### Automatic construction

As shown in the complete example above, the Container is capable of using a Loader to try to resolve services that are not explicitly bound. Dependency Injection is also performed during this process. So you can use classes with dependencies as services without having to register them. 

Continuing the previous example:

```js
// This gets the constructor function
var Mailer = use('Mailer');
>>> [Function]

// This gets an instance
var mailer = container.make('Mailer');
>>> Object
```

## License

Copyright (c) 2015 Eduardo Trujillo \<ed@chromabits.com\>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
