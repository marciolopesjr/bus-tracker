<?php
declare(strict_types=1);
namespace App\Application\Actions\Admin\Route;
use App\Application\Actions\Action; use App\Domain\Route\RouteRepository; use Psr\Http\Message\ResponseInterface as Response;
class ListRoutesAction extends Action {
    public function __construct(\Psr\Log\LoggerInterface $logger, private RouteRepository $routeRepository) { parent::__construct($logger); }
    protected function action(): Response { return $this->respondWithData($this->routeRepository->findAll()); }
}