<?php
declare(strict_types=1);

use App\Application\Middleware\ApiKeyMiddleware;
use App\Application\Actions\Ingestion\UpdateBusLocationAction;
use App\Application\Actions\Auth\LoginAction;
use App\Application\Actions\Auth\LogoutAction;
use App\Application\Actions\Bus\ListBusesByRouteAction;
use App\Application\Actions\Admin\Bus\ListBusesAction;
use App\Application\Actions\Admin\Bus\ViewBusAction;
use App\Application\Actions\Admin\Bus\CreateBusAction;
use App\Application\Actions\Admin\Bus\UpdateBusAction;
use App\Application\Actions\Admin\Bus\DeleteBusAction;
use App\Application\Actions\Admin\Route\ListRoutesAction;
use App\Application\Actions\Admin\Route\ViewRouteAction;
use App\Application\Actions\Admin\Route\CreateRouteAction;
use App\Application\Actions\Admin\Route\UpdateRouteAction;
use App\Application\Actions\Admin\Route\DeleteRouteAction;
use App\Application\Actions\Admin\Route\AssignBusToRouteAction;
use App\Application\Actions\Admin\Route\UnassignBusFromRouteAction;
use App\Application\Middleware\AuthMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {
    $app->add(function (Request $request, \Psr\Http\Server\RequestHandlerInterface $handler) {
        if (session_status() === PHP_SESSION_NONE) { session_start(); }
        return $handler->handle($request);
    });
    
    $app->options('/{routes:.*}', fn(Request $request, Response $response) => $response);
    $app->get('/', fn(Request $request, Response $response) => $response->getBody()->write('Bus Tracker API') && $response);

    // Public API group
    $app->group('/api', function (Group $group) {
        // Public endpoint to view moving buses
        $group->get('/routes/{route_id}/buses', ListBusesByRouteAction::class);

        // Service endpoint for buses to report their location
        $group->post('/buses/{id:[0-9]+}/location', UpdateBusLocationAction::class)
              ->add(ApiKeyMiddleware::class); // Protected by our new bouncer
    });

    // Authentication group
    $app->group('/api/auth', function (Group $group) {
        $group->post('/login', LoginAction::class);
        $group->post('/logout', LogoutAction::class)->add(AuthMiddleware::class);
    });

    // Admin/Operator group
    $app->group('/api/admin', function (Group $group) {
        $group->group('/buses', function (Group $busGroup) {
            $busGroup->get('', ListBusesAction::class);
            $busGroup->post('', CreateBusAction::class);
            // THE FIX IS HERE: Corrected the regex from the alien artifact to the proper [0-9]+
            $busGroup->get('/{id:[0-9]+}', ViewBusAction::class);
            $busGroup->put('/{id:[0-9]+}', UpdateBusAction::class);
            $busGroup->delete('/{id:[0-9]+}', DeleteBusAction::class);
        });
        $group->group('/routes', function (Group $routeGroup) {
            $routeGroup->get('', ListRoutesAction::class);
            $routeGroup->post('', CreateRouteAction::class);
            $routeGroup->get('/{id:[0-9]+}', ViewRouteAction::class);
            $routeGroup->put('/{id:[0-9]+}', UpdateRouteAction::class);
            $routeGroup->delete('/{id:[0-9]+}', DeleteRouteAction::class);
            $routeGroup->post('/{route_id:[0-9]+}/buses', AssignBusToRouteAction::class);
            $routeGroup->delete('/{route_id:[0-9]+}/buses/{bus_id:[0-9]+}', UnassignBusFromRouteAction::class);
        });
    })->add(AuthMiddleware::class);
};