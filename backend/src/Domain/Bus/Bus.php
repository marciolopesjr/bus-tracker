<?php

declare(strict_types=1);

namespace App\Domain\Bus;

use JsonSerializable;
use DateTime;
use DateTimeZone;

class Bus implements JsonSerializable
{
    private ?DateTime $last_seen_at;

    public function __construct(
        private ?int $id,
        private string $license_plate,
        private ?float $current_lat,
        private ?float $current_lng,
        ?string $last_seen_at_str
    ) {
        if ($last_seen_at_str) {
            $this->last_seen_at = new DateTime($last_seen_at_str, new DateTimeZone('UTC'));
        } else {
            $this->last_seen_at = null;
        }
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

    public function getLastSeenAt(): ?DateTime
    {
        return $this->last_seen_at;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'license_plate' => $this->license_plate,
            'current_lat' => $this->current_lat,
            'current_lng' => $this->current_lng,
            'last_seen_at' => $this->last_seen_at ? $this->last_seen_at->format(DateTime::ATOM) : null,
        ];
    }
}