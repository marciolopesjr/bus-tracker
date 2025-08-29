<?php
declare(strict_types=1);

use App\Application\Settings\SettingsInterface;
use App\Application\WebSocket\WebSocketPusher; // Add this
use DI\ContainerBuilder;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\UidProcessor;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        LoggerInterface::class => function (ContainerInterface $c) {
            // ... (logger definition is unchanged)
            $settings = $c->get(SettingsInterface::class);
            $loggerSettings = $settings->get('logger');
            $logger = new Logger($loggerSettings['name']);
            $processor = new UidProcessor();
            $logger->pushProcessor($processor);
            $handler = new StreamHandler($loggerSettings['path'], $loggerSettings['level']);
            $logger->pushHandler($handler);
            return $logger;
        },
        PDO::class => function (ContainerInterface $c) {
            // ... (PDO definition is unchanged)
            $settings = $c->get(SettingsInterface::class);
            $dbSettings = $settings->get('db');
            $db = new PDO($dbSettings['dsn']);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            return $db;
        },
        // Add the WebSocketPusher to the container
        WebSocketPusher::class => \DI\autowire(WebSocketPusher::class),
    ]);
};