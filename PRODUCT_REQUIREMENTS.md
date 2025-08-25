# Requisitos do Produto: App de Rastreamento de Frota de Ônibus

## 1. Visão Geral

O objetivo deste projeto é desenvolver uma aplicação web para o rastreamento em tempo real de uma frota de ônibus. A aplicação terá duas interfaces principais: uma visualização pública para passageiros e, futuramente, um painel de controle para operadores de frota.

## 2. Personas de Usuário

*   **Passageiro:** Deseja saber a localização atual dos ônibus em uma rota específica para minimizar o tempo de espera.
*   **Operador de Frota:** Deseja monitorar a localização de todos os ônibus para garantir a eficiência operacional e a pontualidade.

## 3. Funcionalidades Chave (MVP)

*   **Visualização de Mapa Público:** Uma página web acessível publicamente que exibe um mapa.
*   **Exibição de Ônibus:** Marcadores no mapa representarão cada ônibus ativo em uma rota pré-definida.
*   **Atualizações em Tempo Real:** As posições dos marcadores dos ônibus devem ser atualizadas em tempo real no mapa, sem a necessidade de recarregar a página.
*   **API de Ingestão de Dados:** Um endpoint para que os sistemas de GPS dos ônibus possam enviar suas coordenadas.

## 4. Stack Tecnológica (Restrições)

*   **Frontend:** React, Vite, Tailwind CSS V3
*   **Backend:** PHP, SlimPHP
*   **Comunicação em Tempo Real:** WebSockets (ex: Ratchet)
*   **Banco de Dados:** SQLite3
