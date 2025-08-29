<?php
declare(strict_types=1);
namespace App\Application\Actions\Admin\Route;
use App\Application\Actions\Action; use PDO; use Psr\Http\Message\ResponseInterface as Response;
class UnassignBusFromRouteAction extends Action {
    public function __construct(\Psr\Log\LoggerInterface $logger, private PDO $db) { parent::__construct($logger); }
    protected function action(): Response {
        $routeId = (int)$this->resolveArg('route_id');
        $busId = (int)$this->resolveArg('bus_id');
        $stmt = $this->db->prepare('DELETE FROM bus_routes WHERE bus_id = :bus_id AND route_id = :route_id');
        $stmt->execute(['bus_id' => $busId, 'route_id' => $routeId]);
        return $this->respondWithData(null, 204);
    }
}