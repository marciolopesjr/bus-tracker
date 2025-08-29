<?php
declare(strict_types=1);
namespace App\Application\Actions\Admin\Bus;
use App\Application\Actions\Action;
use App\Domain\Bus\BusRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpNotFoundException;
class ViewBusAction extends Action {
    public function __construct(\Psr\Log\LoggerInterface $logger, private BusRepository $busRepository) { parent::__construct($logger); }
    protected function action(): Response {
        $busId = (int)$this->resolveArg('id');
        $bus = $this->busRepository->findById($busId);
        if (!$bus) {
            // THE FIX IS HERE
            throw new HttpNotFoundException($this->request, "Bus with id `{$busId}` not found.");
        }
        return $this->respondWithData($bus);
    }
}