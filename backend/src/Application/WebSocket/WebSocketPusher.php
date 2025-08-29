<?php
declare(strict_types=1);

namespace App\Application\WebSocket;

class WebSocketPusher
{
    private string $host;
    private int $port;

    public function __construct(string $host = '127.0.0.1', int $port = 8091)
    {
        $this->host = $host;
        $this->port = $port;
    }

    public function send(array $data): void
    {
        // Use fsockopen for a simple, low-overhead client socket.
        // The '@' suppresses warnings if the connection fails, which we handle manually.
        $socket = @fsockopen($this->host, $this->port, $errno, $errstr, 1);

        if ($socket) {
            fwrite($socket, json_encode($data));
            fclose($socket);
        } else {
            // In a real app, you would log this error properly.
            error_log("WebSocketPusher Error: {$errno} - {$errstr}");
        }
    }
}