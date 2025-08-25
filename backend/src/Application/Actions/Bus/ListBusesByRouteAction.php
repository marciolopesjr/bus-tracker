<?php

declare(strict_types=1);

namespace App\Application\Actions\Bus;

use App\Application\Actions\Action;
use Psr\Http\Message\ResponseInterface as Response;
use Psr/Log\LoggerInterface;
use \PDO;

class ListBusesByRouteAction extends Action
{
    private PDO $db;

    public function __construct(LoggerInterface $logger, PDO $db)
    {
        parent::__construct($logger);
        $this->db = $db;
    }

    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $routeId = (int) $this->resolveArg('route_id');

        $stmt = $this->db->prepare('SELECT id FROM routes WHERE id = :id');
        $stmt->execute(['id' => $routeId]);
        $route = $stmt->fetch();

        if (!$route) {
            return $this->respondWithData(['message' => 'Route not found'], 404);
        }

        $stmt = $this->db->prepare('
            SELECT b.id, b.license_plate, b.current_lat, b.current_lng
            FROM buses b
            JOIN bus_routes br ON b.id = br.bus_id
            WHERE br.route_id = :route_id
        ');
        $stmt->execute(['route_id' => $routeId]);
        $buses = $stmt->fetchAll();

        return $this->respondWithData($buses);
    }
}
