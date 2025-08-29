<?php
declare(strict_types=1);
namespace App\Application\Actions\Admin\Bus;
use App\Application\Actions\Action;
use App\Domain\Bus\BusRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpNotFoundException;
class DeleteBusAction extends Action {
    public function __construct(\Psr\Log\LoggerInterface $logger, private BusRepository $busRepository) { parent::__construct($logger); }
    protected function action(): Response {
        $busId = (int)$this->resolveArg('id');
        if (!$this->busRepository->findById($busId)) {
            // THE FIX IS HERE
            throw new HttpNotFoundException($this->request, "Bus with id `{$busId}` not found.");
        }
        $this->busRepository->delete($busId);
        return $this->respondWithData(null, 204);
    }
}