# Plano de Desenvolvimento: App de Rastreamento de Frota de Ônibus

Este documento descreve a estratégia e as fases de desenvolvimento para o projeto.

## Fase 1: Fundação e MVP (Minimum Viable Product)

O foco desta fase é entregar a funcionalidade central: a visualização pública da rota.

1.  **Setup do Repositório:** Inicializar um monorepo com estruturas separadas para `backend` (SlimPHP) e `frontend` (React/Vite).
2.  **Schema do Banco de Dados:** Configurar o Phinx e criar as migrations para as tabelas `buses`, `routes`, e `bus_routes`.
3.  **Backend API REST:** Desenvolver os endpoints para consultar a localização dos ônibus em uma determinada rota.
4.  **Backend WebSocket:** Implementar o servidor WebSocket com Ratchet e o endpoint para receber e transmitir as atualizações de localização.
5.  **Frontend UI:** Construir o componente de mapa com React-Leaflet que exibe os marcadores dos ônibus.
6.  **Integração Real-time:** Conectar o frontend ao servidor WebSocket para receber e processar as atualizações de localização em tempo real.

## Fase 2: Painel do Operador (Pós-MVP)

*   Desenvolvimento de uma área autenticada.
*   Visualização de todos os ônibus da frota.
*   CRUD para gerenciamento de ônibus e rotas.

## Fase 3: Produção e Escalabilidade (Pós-MVP)

*   Configuração de pipeline de CI/CD.
*   Migração do banco de dados para uma solução mais robusta (ex: PostgreSQL).
*   Estratégias de deploy para o backend PHP e o servidor WebSocket.
