<?php

declare(strict_types=1);

namespace App\Application\Actions\Bus;

use App\Application\Actions\Action;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Log\LoggerInterface;
use PDO;

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

        // First, check if the route even exists.
        $stmt = $this->db->prepare('SELECT id FROM routes WHERE id = :id');
        $stmt->execute(['id' => $routeId]);
        $route = $stmt->fetch();

        if (!$route) {
            return $this->respondWithData(['message' => 'Route not found'], 404);
        }

        // Fetch the base data for all buses on the specified route.
        $stmt = $this->db->prepare('
            SELECT b.id, b.license_plate, b.current_lat, b.current_lng
            FROM buses b
            JOIN bus_routes br ON b.id = br.bus_id
            WHERE br.route_id = :route_id
        ');
        $stmt->execute(['route_id' => $routeId]);
        $buses = $stmt->fetchAll();
        
        // --- The "Magic" Starts Here ---
        // Let's make these buses move in a predictable, time-based loop.
        $time = time();
        $simulatedBuses = [];

        foreach ($buses as $bus) {
            // These constants control the simulation.
            $speed = 0.0019; // How fast they move.
            $amplitude = 0.005; // How far from their original point they stray.
            
            // Use the bus ID to give each bus a unique offset in its path,
            // so they don't all move in a single clump.
            $offset = $bus['id'] * M_PI;

            // Calculate the new position using sine and cosine for a smooth circular path.
            // This is a classic trick to simulate movement without complex physics.
            $newLat = $bus['current_lat'] + ($amplitude * sin(($time * $speed) + $offset));
            $newLng = $bus['current_lng'] + ($amplitude * cos(($time * $speed) + $offset));
            
            $simulatedBuses[] = [
                'id' => (int)$bus['id'],
                'license_plate' => $bus['license_plate'],
                'current_lat' => $newLat,
                'current_lng' => $newLng,
            ];
        }

        return $this->respondWithData($simulatedBuses);
    }
}