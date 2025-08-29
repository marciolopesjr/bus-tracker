<?php
declare(strict_types=1);
namespace App\Domain\Route;

interface RouteRepository {
    public function findAll(): array;
    public function findById(int $id): ?Route;
    public function create(string $name): Route;
    public function update(int $id, string $name): Route;
    public function delete(int $id): bool;
}