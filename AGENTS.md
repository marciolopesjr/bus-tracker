# Guia para Agentes de IA (Jules)

Este documento fornece o contexto essencial para a automação de tarefas de desenvolvimento neste repositório.

## Visão Geral do Projeto

Este é um monorepo para uma aplicação de rastreamento de ônibus em tempo real, com um `backend` em PHP/SlimPHP e um `frontend` em React/Vite.

## Stack Tecnológica

*   **Backend:** PHP 8.2+, SlimPHP 4, Composer, Phinx (migrations), Ratchet (WebSockets)
*   **Frontend:** Node.js 22+, npm, React 18, Vite, Tailwind CSS
*   **Banco de Dados:** SQLite3

## Ambiente e Comandos Chave

O projeto está dividido em dois diretórios principais: `backend` e `frontend`. Sempre execute os comandos no diretório apropriado.

### Backend (`./backend`)

*   **Instalar dependências:** `composer install`
*   **Rodar migrations:** `vendor/bin/phinx migrate`
*   **Iniciar servidor de desenvolvimento (API):** `php -S localhost:8000 -t public`
*   **Iniciar servidor WebSocket:** `php bin/websocket-server.php` (deve ser executado em um terminal separado)

### Frontend (`./frontend`)

*   **Instalar dependências:** `npm install`
*   **Iniciar servidor de desenvolvimento:** `npm run dev`
*   **Construir para produção:** `npm run build`

## Convenções de Código

*   **Backend:** Siga o padrão PSR-12 para o estilo do código PHP.
*   **Frontend:** Siga as convenções padrão fornecidas pelo ESLint em projetos Vite/React.
