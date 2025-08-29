<?php
declare(strict_types=1);

namespace App\Application\WebSocket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use SplObjectStorage;

class BusSocketServer implements MessageComponentInterface
{
    protected SplObjectStorage $clients;

    public function __construct()
    {
        $this->clients = new SplObjectStorage();
        echo "Bus WebSocket Server started.\n";
    }

    public function onOpen(ConnectionInterface $conn): void
    {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg): void
    {
        // For security, we don't want browsers to be able to send messages to other browsers.
        // This is a one-way broadcast system from the server. So, we do nothing.
    }

    public function onClose(ConnectionInterface $conn): void
    {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected.\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e): void
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    /**
     * This is our custom method to broadcast data received from the internal TCP socket.
     * @param string $data The JSON string of the updated bus.
     */
    public function broadcastUpdate(string $data): void
    {
        echo "Broadcasting update to " . count($this->clients) . " clients: {$data}\n";
        foreach ($this->clients as $client) {
            $client->send($data);
        }
    }
}