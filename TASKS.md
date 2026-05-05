# TASKS - Gerador de Portfolios

## Contexto

Objetivo: usar mesma stack do projeto `Front`.

Stack oficial:
- React 19 + TypeScript 5
- Vite 6 + `@vitejs/plugin-react-swc`
- SSR com `vite-plugin-ssr` + Express
- Tailwind CSS + shadcn/ui + Radix + lucide-react

## Plano Investimento OGI

Produto:
- Wizard 3 steps + ecrã de resultados
- Perfil de risco, alocação, projeções e FIRE
- 100% client-side
- UI em PT-PT

## MVP

- [x] Estruturar app/feature com wizard multi-step
- [x] Implementar formulários dos 3 steps com validação
- [x] Implementar lógica de scoring de risco (5-20)
- [x] Implementar ajustes de perfil (idade, horizonte, objetivo FIRE)
- [x] Implementar tabela de alocação por perfil
- [x] Implementar fórmulas financeiras (FV, FIRE, inflação/impostos)
- [x] Implementar gráfico donut (alocação)
- [x] Implementar gráfico de área (projeção)
- [x] Implementar cards KPI no resultado
- [x] Implementar dark/light e responsividade mobile-first
- [x] Adicionar disclaimer legal

## Fase 2

- [ ] Exportar PDF
- [ ] Partilha de resultado (imagem/link)
- [ ] Simulação motivacional "se começasse X anos antes"
- [ ] Slider para ajustar alocação manual

## Status de Execução (Prompts)

- [x] Passo 0 - Decisão de stack
- [x] Passo 1 - Scaffold base do projeto
- [x] Passo 2 - Estrutura da feature e tipos
- [x] Passo 3 - Step 1 (Dados Pessoais)
- [x] Passo 4 - Step 2 (Objetivos)
- [x] Passo 5 - Step 3 (Risco)
- [x] Passo 6 - Perfil final e ajustes automáticos
- [x] Passo 7 - Alocação por perfil
- [x] Passo 8 - Fórmulas financeiras
- [x] Passo 10 - Gráficos
- [x] Passo 11 - KPIs
- [x] Passo 12 - Polimento UX, acessibilidade e tema
