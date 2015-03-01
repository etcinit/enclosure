'use strict';

let ServiceProvider = use('Chromabits/Container/ServiceProvider'),
    HelloWorld = use('Example/Support/HelloWorld');

/**
 * Class ExampleProvider
 *
 * An example service provider
 */
class ExampleProvider extends ServiceProvider
{
    /**
     * Register services
     *
     * @param app
     */
    register (app)
    {
        // Register the HelloWorld service
        app.bind('HelloWorld', function (app) {
            let logger = app.make('Example/Support/Logger');

            return new HelloWorld(logger);
        });
    }
}
