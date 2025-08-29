<?php
declare(strict_types=1);
namespace App\Application\Actions\Admin\Bus;
use App\Application\Actions\Action;
use App\Domain\Bus\BusRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;
class CreateBusAction extends Action {
    public function __construct(\Psr\Log\LoggerInterface $logger, private BusRepository $busRepository) { parent::__construct($logger); }
    protected function action(): Response {
        $data = $this->getFormData();
        $licensePlate = $data['license_plate'] ?? null;
        if (empty($licensePlate)) { throw new HttpBadRequestException($this->request, "Field 'license_plate' is required."); }
        $newBus = $this->busRepository->create($licensePlate);
        return $this->respondWithData($newBus, 201);
    }
}