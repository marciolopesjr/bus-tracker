<?php
declare(strict_types=1);
namespace App\Application\Actions\Admin\Route;
use App\Application\Actions\Action; use App\Domain\Route\RouteRepository; use Psr\Http\Message\ResponseInterface as Response; use Slim\Exception\HttpBadRequestException;
class CreateRouteAction extends Action {
    public function __construct(\Psr\Log\LoggerInterface $logger, private RouteRepository $routeRepository) { parent::__construct($logger); }
    protected function action(): Response {
        $data = $this->getFormData();
        $name = $data['name'] ?? null;
        if (empty($name)) { throw new HttpBadRequestException($this->request, "Field 'name' is required."); }
        $newRoute = $this->routeRepository->create($name);
        return $this->respondWithData($newRoute, 201);
    }
}