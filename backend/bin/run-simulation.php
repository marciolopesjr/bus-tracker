<?php

// This script is a standalone simulator.
// It will run in a continuous loop, calculate the position of all buses
// using the same simulation logic as the public API, and push the updates
// to the WebSocket server for real-time broadcasting.

use App\Application\Settings\SettingsInterface;
use App\Application\WebSocket\WebSocketPusher;
use App\Domain\Bus\BusRepository;
use DI\ContainerBuilder;

// Bootstrap the application's container
require __DIR__ . '/../vendor/autoload.php';
$containerBuilder = new ContainerBuilder();
$settings = require __DIR__ . '/../app/settings.php';
$settings($containerBuilder);
$dependencies = require __DIR__ . '/../app/dependencies.php';
$dependencies($containerBuilder);
$repositories = require __DIR__ . '/../app/repositories.php';
$repositories($containerBuilder);
$container = $containerBuilder->build();

// --- Main Simulation Logic ---

// Pull the necessary services from the container
$busRepository = $container->get(BusRepository::class);
$pusher = $container->get(WebSocketPusher::class);
$logger = $container->get(\Psr\Log\LoggerInterface::class);

// How old a bus's last update can be before the simulator takes over.
const IDLE_THRESHOLD_SECONDS = 30;

echo "Starting bus location simulation...\n";
echo "Will simulate idle buses not seen for " . IDLE_THRESHOLD_SECONDS . " seconds.\n";
echo "Press Ctrl+C to stop.\n";

// Infinite loop to keep the simulation running
while (true) {
    try {
        // Fetch the base data for ALL buses from the database
        $buses = $busRepository->findAll();
        $time = time();

        if (empty($buses)) {
            echo "No buses found in the database. Waiting...\n";
            sleep(5);
            continue;
        }

        $simulatedCount = 0;
        foreach ($buses as $bus) {
            $lastSeen = $bus->getLastSeenAt();

            // *** THE CRITICAL LOGIC ***
            // If the bus has been seen recently, it's "live". Skip it and leave it alone.
            if ($lastSeen && ($time - $lastSeen->getTimestamp()) < IDLE_THRESHOLD_SECONDS) {
                continue;
            }

            $simulatedCount++;

            // These constants control the simulation.
            $speed = 0.0139; // How fast they move.
            $amplitude = 0.0008; // How far from their original point they stray. (Reduced for more realistic city movement)
            $offset = $bus->getId() * M_PI;

            // *** THE UPGRADE IS HERE ***
            // Base the simulation on the bus's OWN last known coordinates from the database.
            $originalLat = $bus->getCurrentLat();
            $originalLng = $bus->getCurrentLng();
            
            // If a bus somehow has no coordinates, skip it.
            if ($originalLat === null || $originalLng === null) {
                continue;
            }

            $newLat = $originalLat + ($amplitude * sin(($time * $speed) + $offset));
            $newLng = $originalLng + ($amplitude * cos(($time * $speed) + $offset));

            $simulatedBusData = [
                'id' => $bus->getId(),
                'license_plate' => $bus->getLicensePlate(),
                'current_lat' => $newLat,
                'current_lng' => $newLng,
            ];

            $payload = [
                'type' => 'position_update',
                'payload' => $simulatedBusData
            ];

            $pusher->send($payload);
        }

        if ($simulatedCount > 0) {
             $logger->info('Pushed position updates for ' . $simulatedCount . ' idle buses.');
             echo "S"; // Visual feedback for simulated buses
        } else {
             echo "."; // Visual feedback for a loop with no simulated buses
        }

    } catch (\Exception $e) {
        $logger->error("Simulator Error: " . $e->getMessage());
        echo "An error occurred: " . $e->getMessage() . "\n";
    }
    
    sleep(1);
}