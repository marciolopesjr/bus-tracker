<?php

declare(strict_types=1);

namespace App\Application\Actions\Auth;

use App\Application\Actions\Action;
use Psr\Http\Message\ResponseInterface as Response;
use PDO;
use Slim\Exception\HttpUnauthorizedException;

class LoginAction extends Action
{
    private PDO $db;

    public function __construct(\Psr\Log\LoggerInterface $logger, PDO $db)
    {
        parent::__construct($logger);
        $this->db = $db;
    }

    protected function action(): Response
    {
        $data = $this->getFormData();
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        $stmt = $this->db->prepare('SELECT * FROM users WHERE username = :username');
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            throw new HttpUnauthorizedException($this->request, 'Invalid username or password.');
        }

        // It's good practice to regenerate the session ID on login to prevent session fixation attacks.
        session_regenerate_id(true);
        $_SESSION['user_id'] = (int)$user['id'];
        $_SESSION['username'] = $user['username'];

        // THE FIX IS HERE. Using the modern, non-deprecated syntax.
        $this->logger->info("User `{$username}` logged in successfully.");

        return $this->respondWithData(['message' => 'Login successful', 'user' => ['id' => $user['id'], 'username' => $user['username']]]);
    }
}