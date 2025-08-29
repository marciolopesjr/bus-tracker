<?php
declare(strict_types=1);
namespace App\Application\Actions\Admin\Bus;
use App\Application\Actions\Action;
use App\Domain\Bus\BusRepository;
use Psr\Http\Message\ResponseInterface as Response;
class ListBusesAction extends Action {
    public function __construct(\Psr\Log\LoggerInterface $logger, private BusRepository $busRepository) { parent::__construct($logger); }
    protected function action(): Response {
        $buses = $this->busRepository->findAll();
        return $this->respondWithData($buses);
    }
}