<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Bus;

use App\Domain\Bus\Bus;
use App\Domain\Bus\BusRepository;
use PDO;

class DatabaseBusRepository implements BusRepository
{
    public function __construct(private PDO $db)
    {
    }
    public function findAll(): array {
        $stmt = $this->db->query('SELECT * FROM buses');
        $busesData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $buses = [];
        foreach ($busesData as $busData) {
            $buses[] = new Bus(
                (int)$busData['id'],
                $busData['license_plate'],
                (float)$busData['current_lat'],
                (float)$busData['current_lng']
            );
        }
        return $buses;
    }
    public function findById(int $id): ?Bus {
        $stmt = $this->db->prepare('SELECT * FROM buses WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $busData = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$busData) { return null; }
        return new Bus((int)$busData['id'], $busData['license_plate'], (float)$busData['current_lat'], (float)$busData['current_lng']);
    }
    public function create(string $licensePlate): Bus {
        $stmt = $this->db->prepare('INSERT INTO buses (license_plate) VALUES (:license_plate)');
        $stmt->execute(['license_plate' => $licensePlate]);
        $id = (int)$this->db->lastInsertId();
        return $this->findById($id);
    }
    public function update(int $id, string $licensePlate): Bus {
        $stmt = $this->db->prepare('UPDATE buses SET license_plate = :license_plate WHERE id = :id');
        $stmt->execute(['id' => $id, 'license_plate' => $licensePlate]);
        return $this->findById($id);
    }
    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM buses WHERE id = :id');
        return $stmt->execute(['id' => $id]);
    }

    /**
     * {@inheritdoc}
     */
    public function updateLocation(int $id, float $lat, float $lng): ?Bus
    {
        $stmt = $this->db->prepare(
            'UPDATE buses SET current_lat = :lat, current_lng = :lng WHERE id = :id'
        );
        $stmt->execute([
            'id' => $id,
            'lat' => $lat,
            'lng' => $lng,
        ]);
        
        // Return the updated bus object, or null if the ID didn't exist.
        return $this->findById($id);
    }
}