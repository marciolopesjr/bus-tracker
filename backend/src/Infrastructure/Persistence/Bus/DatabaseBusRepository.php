<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Bus;

use App\Domain\Bus\Bus;
use App\Domain\Bus\BusRepository;
use PDO;
use DateTime;
use DateTimeZone;

class DatabaseBusRepository implements BusRepository
{
    public function __construct(private PDO $db)
    {
    }

    public function findAll(): array
    {
        $stmt = $this->db->query('SELECT * FROM buses');
        $busesData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $buses = [];
        foreach ($busesData as $busData) {
            $buses[] = $this->mapToBus($busData);
        }
        return $buses;
    }

    public function findById(int $id): ?Bus
    {
        $stmt = $this->db->prepare('SELECT * FROM buses WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $busData = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$busData) {
            return null;
        }
        return $this->mapToBus($busData);
    }

    public function create(string $licensePlate): Bus
    {
        $stmt = $this->db->prepare('INSERT INTO buses (license_plate) VALUES (:license_plate)');
        $stmt->execute(['license_plate' => $licensePlate]);
        $id = (int)$this->db->lastInsertId();
        return $this->findById($id);
    }

    public function update(int $id, string $licensePlate): Bus
    {
        $stmt = $this->db->prepare('UPDATE buses SET license_plate = :license_plate WHERE id = :id');
        $stmt->execute(['id' => $id, 'license_plate' => $licensePlate]);
        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM buses WHERE id = :id');
        return $stmt->execute(['id' => $id]);
    }

    /**
     * {@inheritdoc}
     */
    public function updateLocation(int $id, float $lat, float $lng): ?Bus
    {
        $now = (new DateTime('now', new DateTimeZone('UTC')))->format('Y-m-d H:i:s');
        $stmt = $this->db->prepare(
            'UPDATE buses SET current_lat = :lat, current_lng = :lng, last_seen_at = :now WHERE id = :id'
        );
        $stmt->execute([
            'id' => $id,
            'lat' => $lat,
            'lng' => $lng,
            'now' => $now,
        ]);

        // Return the updated bus object, or null if the ID didn't exist.
        // TherowCount check ensures we don't try to fetch a non-existent bus.
        if ($stmt->rowCount() === 0) {
            return null;
        }
        
        return $this->findById($id);
    }

    /**
     * Helper to map a database row to a Bus domain object.
     */
    private function mapToBus(array $busData): Bus
    {
        return new Bus(
            (int)$busData['id'],
            $busData['license_plate'],
            isset($busData['current_lat']) ? (float)$busData['current_lat'] : null,
            isset($busData['current_lng']) ? (float)$busData['current_lng'] : null,
            $busData['last_seen_at'] ?? null
        );
    }
}