<?php

declare(strict_types=1);

// Add these use statements at the top
use App\Domain\Bus\BusRepository;
use App\Infrastructure\Persistence\Bus\DatabaseBusRepository;
use App\Domain\Route\RouteRepository; // Adicione este
use App\Infrastructure\Persistence\Route\DatabaseRouteRepository; // Adicione este
use App\Domain\User\UserRepository;
use App\Infrastructure\Persistence\User\InMemoryUserRepository;
use DI\ContainerBuilder;

return function (ContainerBuilder $containerBuilder) {
    // Here we map our UserRepository interface to its in memory implementation
    $containerBuilder->addDefinitions([
        UserRepository::class => \DI\autowire(InMemoryUserRepository::class),

        // And now we map our new BusRepository to its database implementation
        BusRepository::class => \DI\autowire(DatabaseBusRepository::class),
        RouteRepository::class => \DI\autowire(DatabaseRouteRepository::class), // E adicione esta linha
    ]);
};