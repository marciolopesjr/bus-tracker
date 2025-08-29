<?php
declare(strict_types=1);
namespace App\Application\Actions\Admin\Route;
use App\Application\Actions\Action; use App\Domain\Bus\BusRepository; use App\Domain\Route\RouteRepository; use PDO; use Psr\Http\Message\ResponseInterface as Response; use Slim\Exception\HttpBadRequestException; use Slim\Exception\HttpNotFoundException;
class AssignBusToRouteAction extends Action {
    public function __construct(\Psr\Log\LoggerInterface $logger, private PDO $db, private RouteRepository $routeRepository, private BusRepository $busRepository) { parent::__construct($logger); }
    protected function action(): Response {
        $routeId = (int)$this->resolveArg('route_id');
        if (!$this->routeRepository->findById($routeId)) { throw new HttpNotFoundException($this->request, "Route with id `{$routeId}` not found."); }
        $data = $this->getFormData();
        $busId = $data['bus_id'] ?? null;
        if (empty($busId)) { throw new HttpBadRequestException($this->request, "Field 'bus_id' is required."); }
        if (!$this->busRepository->findById($busId)) { throw new HttpNotFoundException($this->request, "Bus with id `{$busId}` not found."); }
        $stmt = $this->db->prepare('INSERT INTO bus_routes (bus_id, route_id) VALUES (:bus_id, :route_id)');
        $stmt->execute(['bus_id' => $busId, 'route_id' => $routeId]);
        return $this->respondWithData(['message' => 'Bus assigned to route successfully.'], 201);
    }
}