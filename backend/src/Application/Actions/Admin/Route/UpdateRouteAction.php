<?php
declare(strict_types=1);
namespace App\Application\Actions\Admin\Route;
use App\Application\Actions\Action; use App\Domain\Route\RouteRepository; use Psr\Http\Message\ResponseInterface as Response; use Slim\Exception\HttpBadRequestException; use Slim\Exception\HttpNotFoundException;
class UpdateRouteAction extends Action {
    public function __construct(\Psr\Log\LoggerInterface $logger, private RouteRepository $routeRepository) { parent::__construct($logger); }
    protected function action(): Response {
        $routeId = (int)$this->resolveArg('id');
        if (!$this->routeRepository->findById($routeId)) { throw new HttpNotFoundException($this->request, "Route with id `{$routeId}` not found."); }
        $data = $this->getFormData();
        $name = $data['name'] ?? null;
        if (empty($name)) { throw new HttpBadRequestException($this->request, "Field 'name' is required."); }
        return $this->respondWithData($this->routeRepository->update($routeId, $name));
    }
}