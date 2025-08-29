<?php

declare(strict_types=1);

namespace App\Domain\Bus;

interface BusRepository
{
    public function findAll(): array;

    public function findById(int $id): ?Bus;

    public function create(string $licensePlate): Bus;
    
    public function update(int $id, string $licensePlate): Bus;

    public function delete(int $id): bool;

    // Add this new method
    public function updateLocation(int $id, float $lat, float $lng): ?Bus;
}