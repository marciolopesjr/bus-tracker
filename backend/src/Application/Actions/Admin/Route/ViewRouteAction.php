<?php
declare(strict_types=1);
namespace App\Application\Actions\Admin\Route;
use App\Application\Actions\Action; use App\Domain\Route\RouteRepository; use Psr\Http\Message\ResponseInterface as Response; use Slim\Exception\HttpNotFoundException;
class ViewRouteAction extends Action {
    public function __construct(\Psr\Log\LoggerInterface $logger, private RouteRepository $routeRepository) { parent::__construct($logger); }
    protected function action(): Response {
        $routeId = (int)$this->resolveArg('id');
        $route = $this->routeRepository->findById($routeId);
        if (!$route) { throw new HttpNotFoundException($this->request, "Route with id `{$routeId}` not found."); }
        return $this->respondWithData($route);
    }
}