<?php
declare(strict_types=1);
namespace App\Domain\Route;
use JsonSerializable;

class Route implements JsonSerializable {
    public function __construct(private ?int $id, private string $name) {}
    public function getId(): ?int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function jsonSerialize(): array {
        return ['id' => $this->id, 'name' => $this->name];
    }
}