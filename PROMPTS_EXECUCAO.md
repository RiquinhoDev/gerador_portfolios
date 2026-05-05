# Prompts de Execução (1 passo de cada vez)

## Como usar
- Executar **apenas 1 prompt por vez**.
- No fim de cada passo, validar build/testes antes de avançar.
- Se um passo falhar, corrigir no mesmo passo antes de continuar.

## Passo 0 - Decisão de stack
```text
Com base no TASKS.md e no PLANO_INVESTIMENTO_CODEX.md, confirma e fixa a stack oficial deste projeto.

Regras:
- Se escolhermos stack do Front: React 19 + TypeScript + Vite + vite-plugin-ssr + Express + Tailwind + shadcn/ui.
- Se escolhermos stack do plano: Next.js 14+ App Router + TypeScript + Tailwind + shadcn/ui.

Entrega:
1) Atualiza o TASKS.md com a decisão final.
2) Escreve uma secção "Decisão Arquitetural Final" com justificativa curta.
3) Não implementar código ainda.
```

## Passo 1 - Scaffold base do projeto
```text
Implementa o scaffold base do projeto conforme a stack oficial definida no TASKS.md.

Objetivo:
- Projeto a correr localmente.
- Estrutura de pastas pronta para a feature plano-investimento.
- Ferramentas base configuradas (TypeScript, lint, format, tailwind, aliases).

Entrega:
1) Criar estrutura mínima de app.
2) Adicionar scripts de dev/build/test/lint no package.json.
3) Executar build e reportar resultado.
4) Atualizar TASKS.md marcando o que foi concluído.
```

## Passo 2 - Estrutura da feature e tipos
```text
Criar a base da feature "plano-investimento" sem lógica final ainda.

Objetivo:
- Criar pastas e ficheiros:
  - components (InvestmentWizard, steps, ResultsPanel)
  - lib (profiles, calculations, risk-scoring, constants)
  - types/index.ts
- Definir interfaces TypeScript principais do plano.

Entrega:
1) Implementar todos os tipos.
2) Criar componentes placeholder com props tipadas.
3) Garantir que compila sem erros.
4) Atualizar TASKS.md.
```

## Passo 3 - Step 1 (Dados Pessoais)
```text
Implementa o Step 1 completo com validação e UX.

Campos:
- nome (opcional, max 50)
- idade (18-80)
- rendimento mensal (>=0)
- investimento mensal (>=25)
- capital atual (>=0)

Entrega:
1) Componente StepPersonalData funcional.
2) Validação inline com mensagens PT-PT.
3) Estado ligado ao wizard.
4) Teste básico do step.
```

## Passo 4 - Step 2 (Objetivos)
```text
Implementa o Step 2 com:
- objetivo principal (3 opções)
- horizonte temporal (1-40 anos)
- campo FIRE mensal apenas quando objetivo = FIRE

Entrega:
1) UI completa com seleção de objetivo.
2) Slider com labels (curto/médio/longo).
3) Campo condicional FIRE com validação.
4) Atualizar TASKS.md.
```

## Passo 5 - Step 3 (Risco)
```text
Implementa o Step 3 com 5 perguntas de risco (1-4 pontos cada).

Entrega:
1) Perguntas e opções conforme plano.
2) Navegação por pergunta (1/5 ... 5/5).
3) Cálculo de score total (5-20).
4) Guardar respostas no estado global do wizard.
```

## Passo 6 - Lógica de perfil e ajustes
```text
Implementa a lógica de perfil final com ajustes automáticos.

Regras:
- score -> perfil base
- idade > 55 reduz 1 nível
- horizonte < 5 reduz 1 nível
- objetivo FIRE não pode ficar conservador (mínimo moderado)

Entrega:
1) Implementar em lib/risk-scoring.ts
2) Cobrir com testes unitários.
3) Atualizar TASKS.md.
```

## Passo 7 - Alocação por perfil
```text
Implementa a tabela de alocação por perfil e helper para obter alocação final.

Entrega:
1) Implementar lib/profiles.ts com percentagens por perfil.
2) Validar soma 100% para cada perfil.
3) Expor estrutura para UI de resultados.
```

## Passo 8 - Fórmulas financeiras
```text
Implementa cálculos financeiros em lib/calculations.ts.

Incluir:
- juros compostos com aportes mensais
- projeções 5/10/15/20/30 + horizonte do utilizador
- número FIRE
- anos até FIRE (quando aplicável)

Entrega:
1) Funções puras tipadas.
2) Testes unitários dos cálculos principais.
3) Atualizar TASKS.md.
```

## Passo 9 - Ecrã de resultados
```text
Implementa ResultsPanel com:
- badge de perfil + descrição
- score visual
- resumo textual
- disclaimer legal

Sem gráficos ainda (virá no próximo passo).
```

## Passo 10 - Gráficos
```text
Implementa os gráficos com recharts:
- AllocationChart (donut)
- ProjectionChart (area)

Requisitos:
- cores por tokens
- tooltips claros
- linha FIRE quando aplicável
```

## Passo 11 - KPIs
```text
Implementa KpiCards com:
- capital no horizonte
- retorno total estimado
- anos até FIRE (se aplicável)
- renda passiva mensal estimada
- total investido vs acumulado
- simulação de começar 5 anos antes
```

## Passo 12 - Polimento (UX + responsivo + tema)
```text
Fazer polimento final:
- mobile-first
- acessibilidade (labels, foco, teclado)
- dark/light mode consistente
- animações suaves entre steps e resultados
```

## Passo 13 - Validação final
```text
Executa validação final do projeto:
1) lint
2) testes unitários
3) build
4) (se existir) e2e smoke

Entrega:
- resumo do que passou/falhou
- lista curta de pendências
- atualização final do TASKS.md
```
