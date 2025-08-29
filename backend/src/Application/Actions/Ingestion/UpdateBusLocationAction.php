<?php
declare(strict_types=1);

namespace App\Application\Actions\Ingestion;

use App\Application\Actions\Action;
use App\Application\WebSocket\WebSocketPusher;
use App\Domain\Bus\BusRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpNotFoundException;

class UpdateBusLocationAction extends Action
{
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        private BusRepository $busRepository,
        private WebSocketPusher $pusher
    ) {
        parent::__construct($logger);
    }

    protected function action(): Response
    {
        $busId = (int)$this->resolveArg('id');
        $data = $this->getFormData();

        $lat = $data['lat'] ?? null;
        $lng = $data['lng'] ?? null;

        if (!isset($lat) || !is_numeric($lat) || !isset($lng) || !is_numeric($lng)) {
            throw new HttpBadRequestException($this->request, 'Fields `lat` and `lng` are required and must be numeric.');
        }

        // The repository now handles updating the timestamp automatically
        $updatedBus = $this->busRepository->updateLocation($busId, (float)$lat, (float)$lng);

        if (!$updatedBus) {
            throw new HttpNotFoundException($this->request, "Bus with id `{$busId}` not found.");
        }
        
        // After successfully updating the database, push the update to the WebSocket server.
        $this->pusher->send([
            'type' => 'position_update',
            'payload' => $updatedBus
        ]);

        $this->logger->info("Location updated for bus id `{$busId}` and pushed to WebSocket.");

        return $this->respondWithData($updatedBus);
    }
}