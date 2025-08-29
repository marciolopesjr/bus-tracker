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
    current_lng REAL,
    last_seen_at DATETIME
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
    ['id' => 1, 'name' => 'Route Beira-Mar'],
    ['id' => 2, 'name' => 'Route Centro-Ponte'],
];

// THE FIX IS HERE: New coordinates for Tramandaí, RS
$buses = [
    // Route Beira-Mar
    ['id' => 1, 'license_plate' => 'BUS-001', 'current_lat' => -29.9876, 'current_lng' => -50.1264], // Near Plataforma de Pesca
    ['id' => 2, 'license_plate' => 'BUS-002', 'current_lat' => -29.9831, 'current_lng' => -50.1225], // Av. Beira Mar North
    ['id' => 3, 'license_plate' => 'BUS-003', 'current_lat' => -29.9928, 'current_lng' => -50.1310], // Av. Beira Mar South
    ['id' => 4, 'license_plate' => 'BUS-004', 'current_lat' => -29.9855, 'current_lng' => -50.1245], // Near Av. da Igreja
    // Route Centro-Ponte
    ['id' => 5, 'license_plate' => 'BUS-005', 'current_lat' => -29.9880, 'current_lng' => -50.1343], // Downtown / Centro
    ['id' => 6, 'license_plate' => 'BUS-006', 'current_lat' => -29.9904, 'current_lng' => -50.1415], // Near Ponte Giuseppe Garibaldi
    ['id' => 7, 'license_plate' => 'BUS-007', 'current_lat' => -29.9842, 'current_lng' => -50.1329], // Near Prefeitura
    ['id' => 8, 'license_plate' => 'BUS-008', 'current_lat' => -29.9925, 'current_lng' => -50.1388], // Near Lagoa do Armazém
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

echo "Database setup complete with 8 buses in Tramandaí and 1 admin user.\n";