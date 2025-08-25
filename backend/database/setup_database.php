<?php

$db = new PDO('sqlite:' . __DIR__ . '/database.sqlite');

// Drop tables if they exist
$db->exec('DROP TABLE IF EXISTS bus_routes');
$db->exec('DROP TABLE IF EXISTS routes');
$db->exec('DROP TABLE IF EXISTS buses');

// Create tables
$db->exec('CREATE TABLE routes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
)');

$db->exec('CREATE TABLE buses (
    id INTEGER PRIMARY KEY,
    license_plate TEXT NOT NULL,
    current_lat REAL,
    current_lng REAL
)');

$db->exec('CREATE TABLE bus_routes (
    bus_id INTEGER,
    route_id INTEGER,
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
)');

// Seed data
$routes = [
    ['id' => 1, 'name' => 'Route A'],
    ['id' => 2, 'name' => 'Route B'],
];

$buses = [
    ['id' => 1, 'license_plate' => 'BUS-001', 'current_lat' => -23.5505, 'current_lng' => -46.6333],
    ['id' => 2, 'license_plate' => 'BUS-002', 'current_lat' => -23.5515, 'current_lng' => -46.6343],
    ['id' => 3, 'license_plate' => 'BUS-003', 'current_lat' => -23.5525, 'current_lng' => -46.6353],
];

$bus_routes = [
    ['bus_id' => 1, 'route_id' => 1],
    ['bus_id' => 2, 'route_id' => 1],
    ['bus_id' => 3, 'route_id' => 2],
];

foreach ($routes as $route) {
    $stmt = $db->prepare('INSERT INTO routes (id, name) VALUES (:id, :name)');
    $stmt->execute($route);
}

foreach ($buses as $bus) {
    $stmt = $db->prepare('INSERT INTO buses (id, license_plate, current_lat, current_lng) VALUES (:id, :license_plate, :current_lat, :current_lng)');
    $stmt->execute($bus);
}

foreach ($bus_routes as $bus_route) {
    $stmt = $db->prepare('INSERT INTO bus_routes (bus_id, route_id) VALUES (:bus_id, :route_id)');
    $stmt->execute($bus_route);
}

echo "Database setup complete.\n";
