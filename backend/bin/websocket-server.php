<?php
require dirname(__DIR__) . '/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use React\EventLoop\Factory as LoopFactory;
use React\Socket\Server as Reactor;
use App\Application\WebSocket\BusSocketServer;

// --- Configuration ---
$public_ws_port = 8090;
$internal_tcp_port = 8091;

// --- Setup ---
$loop = LoopFactory::create();
$busSocketServer = new BusSocketServer();

// --- Internal TCP Server (for receiving updates from the HTTP server) ---
$internalSocket = new Reactor('0.0.0.0:' . $internal_tcp_port, $loop);
$internalSocket->on('connection', function (\React\Socket\ConnectionInterface $connection) use ($busSocketServer) {
    $connection->on('data', function ($data) use ($busSocketServer) {
        // When data comes in from the internal socket, broadcast it.
        $busSocketServer->broadcastUpdate((string)$data);
    });
});

// --- Public WebSocket Server (for browsers) ---
$webSocket = new WsServer($busSocketServer);
$httpServer = new HttpServer($webSocket);
$ioServer = new IoServer($httpServer, new Reactor('0.0.0.0:' . $public_ws_port, $loop), $loop);

echo "Starting WebSocket server on port {$public_ws_port}...\n";
echo "Starting internal TCP listener on port {$internal_tcp_port}...\n";

$loop->run();