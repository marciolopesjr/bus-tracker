<?php

declare(strict_types=1);

namespace App\Domain\Bus;

use JsonSerializable;

class Bus implements JsonSerializable
{
    public function __construct(
        private ?int $id,
        private string $license_plate,
        private ?float $current_lat,
        private ?float $current_lng
    ) {
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLicensePlate(): string
    {
        return $this->license_plate;
    }

    public function getCurrentLat(): ?float
    {
        return $this->current_lat;
    }

    public function getCurrentLng(): ?float
    {
        return $this->current_lng;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'license_plate' => $this->license_plate,
            'current_lat' => $this->current_lat,
            'current_lng' => $this->current_lng,
        ];
    }
}