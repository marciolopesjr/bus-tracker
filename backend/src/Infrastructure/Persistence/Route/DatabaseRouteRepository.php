<?php
declare(strict_types=1);
namespace App\Infrastructure\Persistence\Route;
use App\Domain\Route\Route;
use App\Domain\Route\RouteRepository;
use PDO;

class DatabaseRouteRepository implements RouteRepository {
    public function __construct(private PDO $db) {}

    public function findAll(): array {
        $stmt = $this->db->query('SELECT * FROM routes');
        $routesData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $routes = [];
        foreach ($routesData as $route) {
            $routes[] = new Route((int)$route['id'], $route['name']);
        }
        return $routes;
    }

    public function findById(int $id): ?Route {
        $stmt = $this->db->prepare('SELECT * FROM routes WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $routeData = $stmt->fetch(PDO::FETCH_ASSOC);
        return $routeData ? new Route((int)$routeData['id'], $routeData['name']) : null;
    }

    public function create(string $name): Route {
        $stmt = $this->db->prepare('INSERT INTO routes (name) VALUES (:name)');
        $stmt->execute(['name' => $name]);
        $id = (int)$this->db->lastInsertId();
        return $this->findById($id);
    }
    
    public function update(int $id, string $name): Route {
        $stmt = $this->db->prepare('UPDATE routes SET name = :name WHERE id = :id');
        $stmt->execute(['id' => $id, 'name' => $name]);
        return $this->findById($id);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM routes WHERE id = :id');
        return $stmt->execute(['id' => $id]);
    }
}