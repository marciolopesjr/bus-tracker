<?php

$db = new PDO('sqlite:' . __DIR__ . '/database.sqlite');

// Drop tables if they exist
$db->exec('DROP TABLE IF EXISTS bus_routes');
$db->exec('DROP TABLE IF EXISTS routes');
$db->exec('DROP TABLE IF EXISTS buses');
$db->exec('DROP TABLE IF EXISTS users'); // Drop the old users table too

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

// A proper users table with a password column
$db->exec('CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL
)');

// --- Seed Data ---
$routes = [
    ['id' => 1, 'name' => 'Route A'],
    ['id' => 2, 'name' => 'Route B'],
];

$buses = [
    ['id' => 1, 'license_plate' => 'BUS-001', 'current_lat' => -23.5505, 'current_lng' => -46.6333],
    ['id' => 2, 'license_plate' => 'BUS-002', 'current_lat' => -23.5515, 'current_lng' => -46.6343],
    ['id' => 3, 'license_plate' => 'BUS-003', 'current_lat' => -23.5525, 'current_lng' => -46.6353],
    ['id' => 4, 'license_plate' => 'BUS-004', 'current_lat' => -23.5495, 'current_lng' => -46.6323],
    ['id' => 5, 'license_plate' => 'BUS-005', 'current_lat' => -23.5580, 'current_lng' => -46.6400],
    ['id' => 6, 'license_plate' => 'BUS-006', 'current_lat' => -23.5590, 'current_lng' => -46.6410],
    ['id' => 7, 'license_plate' => 'BUS-007', 'current_lat' => -23.5600, 'current_lng' => -46.6420],
    ['id' => 8, 'license_plate' => 'BUS-008', 'current_lat' => -23.5610, 'current_lng' => -46.6430],
];

$bus_routes = [
    ['bus_id' => 1, 'route_id' => 1], ['bus_id' => 2, 'route_id' => 1], ['bus_id' => 3, 'route_id' => 1], ['bus_id' => 4, 'route_id' => 1],
    ['bus_id' => 5, 'route_id' => 2], ['bus_id' => 6, 'route_id' => 2], ['bus_id' => 7, 'route_id' => 2], ['bus_id' => 8, 'route_id' => 2],
];

// Create an admin user. The password is 'password'. Don't do this in production.
$users = [
    [
        'id' => 1,
        'username' => 'admin',
        'first_name' => 'Fleet',
        'last_name' => 'Operator',
        'password' => password_hash('password', PASSWORD_DEFAULT)
    ]
];

// --- Insert Data ---
foreach ($routes as $route) { $db->prepare('INSERT INTO routes (id, name) VALUES (:id, :name)')->execute($route); }
foreach ($buses as $bus) { $db->prepare('INSERT INTO buses (id, license_plate, current_lat, current_lng) VALUES (:id, :license_plate, :current_lat, :current_lng)')->execute($bus); }
foreach ($bus_routes as $bus_route) { $db->prepare('INSERT INTO bus_routes (bus_id, route_id) VALUES (:bus_id, :route_id)')->execute($bus_route); }
foreach ($users as $user) { $db->prepare('INSERT INTO users (id, username, first_name, last_name, password) VALUES (:id, :username, :first_name, :last_name, :password)')->execute($user); }

echo "Database setup complete with 8 buses and 1 admin user.\n";