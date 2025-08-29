<?php

declare(strict_types=1);

namespace App\Application\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Exception\HttpUnauthorizedException;

class AuthMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        // Check if session has started, if not, start it.
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (empty($_SESSION['user_id'])) {
            throw new HttpUnauthorizedException($request, 'Authentication required.');
        }

        // You could add logic here to load the full user object into the request attribute if needed.
        // $request = $request->withAttribute('user_id', $_SESSION['user_id']);

        return $handler->handle($request);
    }
}