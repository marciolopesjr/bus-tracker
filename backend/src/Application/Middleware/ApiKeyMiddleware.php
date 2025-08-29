<?php

declare(strict_types=1);

namespace App\Application\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Exception\HttpUnauthorizedException;

class ApiKeyMiddleware implements MiddlewareInterface
{
    // In a real application, this would come from a secure configuration or environment variable.
    private const FLEET_API_KEY = 'SUPER_SECRET_BUS_API_KEY_12345';

    public function process(Request $request, RequestHandler $handler): Response
    {
        $apiKey = $request->getHeaderLine('X-API-Key');

        if (empty($apiKey) || $apiKey !== self::FLEET_API_KEY) {
            throw new HttpUnauthorizedException($request, 'Invalid or missing API Key.');
        }

        return $handler->handle($request);
    }
}