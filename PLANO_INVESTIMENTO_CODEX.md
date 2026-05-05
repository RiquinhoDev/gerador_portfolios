# Plano de Investimento OGI — Especificação para Codex

## Contexto do Projeto

Criar uma aplicação web **standalone** (single-page React app) chamada **"Plano de Investimento OGI"** que funciona como ferramenta de perfilagem de investidor. O utilizador preenche os seus dados e recebe um perfil de investidor com alocação de ativos recomendada, projeções futuras e cálculo FIRE.

A aplicação deve ser **genérica** (não personalizada a um utilizador específico) para servir os membros da comunidade OGI.

---

## Stack Técnico

- **Framework**: Next.js 14+ (App Router) com TypeScript
- **Styling**: Tailwind CSS com o sistema de design tokens do projeto `Comunidade_login`
- **Componentes UI**: shadcn/ui (Card, Slider, Select, Input, Tabs, Badge, Progress)
- **Ícones**: lucide-react
- **Gráficos**: recharts (já disponível no projeto)
- **Temas**: next-themes (dark/light mode, consistente com Comunidade_login)
- **Estado**: React hooks (useState, useMemo) — sem necessidade de store externo
- **Deploy**: Integrar como nova página/rota no projeto Comunidade_login existente

---

## Sistema de Design (basear no Comunidade_login)

### Variáveis CSS (oklch — já definidas no projeto):

```css
/* Light */
--background: oklch(1 0 0);
--foreground: oklch(0.129 0.042 264.695);
--primary: oklch(0.208 0.042 265.755);
--card: oklch(1 0 0);
--muted: oklch(0.968 0.007 247.896);
--border: oklch(0.929 0.013 255.508);

/* Dark */
--background: oklch(0.129 0.042 264.695);
--foreground: oklch(0.984 0.003 247.858);
--card: oklch(0.208 0.042 265.755);

/* Custom tokens adicionais para esta app */
--success: oklch(0.6 0.2 145);       /* verde — ETFs/seguro */
--chart-1: oklch(0.646 0.222 41.116); /* laranja — ações */
--chart-2: oklch(0.6 0.118 184.704);  /* teal — obrigações */
--chart-3: oklch(0.398 0.07 227.392); /* azul escuro — ouro */
--chart-4: oklch(0.828 0.189 84.429); /* amarelo — cripto/risco */
--chart-5: oklch(0.769 0.188 70.08);  /* amber — REITs */
```

### Estilo visual:
- Glassmorphism subtil nos cards principais (backdrop-blur, border translúcido)
- Gradientes azul/índigo no header/hero
- Transições suaves (300ms ease)
- Border-radius: 12px nos cards, 8px nos inputs
- Sombras suaves em light mode, bordas subtis em dark mode

---

## Estrutura da Aplicação

### Rota: `/plano-investimento`

A app é composta por **3 fases** (wizard multi-step) + **1 ecrã de resultados**:

```
[STEP 1: Dados Pessoais] → [STEP 2: Objetivos] → [STEP 3: Tolerância ao Risco] → [RESULTADOS]
```

Navegação com botões "Anterior" / "Seguinte", barra de progresso no topo.

---

## STEP 1 — Dados Pessoais

### Campos:

| Campo | Tipo | Validação |
|---|---|---|
| **Nome** (opcional) | Text input | Max 50 chars |
| **Idade** | Number input | 18–80 |
| **Rendimento líquido mensal** | Number input (€) | Min 0 |
| **Quanto consegue investir por mês** | Number input (€) | Min 25€ |
| **Já tem capital investido?** | Number input (€) | Default 0 |

### UI:
- Card com glassmorphism
- Inputs com ícones (User, Calendar, Wallet, PiggyBank, Landmark)
- Validação inline com mensagens de erro suaves
- Helper text a cinza claro por baixo de cada campo

---

## STEP 2 — Objetivos

### Campos:

| Campo | Tipo | Opções |
|---|---|---|
| **Objetivo principal** | Radio cards (selecionar 1) | Acumulação de capital · Rendimento extra mensal · Liberdade financeira (FIRE) |
| **Horizonte temporal** | Slider | 1–40 anos (com labels: Curto <5, Médio 5-15, Longo >15) |
| **Se FIRE**: Quanto quer receber por mês em renda passiva | Number input (€) | Só aparece se objetivo = FIRE |

### UI:
- Objetivo como 3 cards lado a lado, cada um com ícone e descrição curta:
  - **Acumulação**: ícone TrendingUp — "Fazer crescer o teu capital ao longo do tempo"
  - **Rendimento Extra**: ícone HandCoins — "Gerar rendimento passivo mensal"
  - **FIRE**: ícone Flame — "Atingir independência financeira total"
- Slider estilizado com valor visível e cor que muda (verde → amarelo → vermelho com o horizonte)
- Campo FIRE com animação de entrada (slide-down)

---

## STEP 3 — Tolerância ao Risco

### Método: 5 perguntas rápidas (scoring)

Cada pergunta vale 1-4 pontos. Total: 5-20 pontos.

#### Perguntas:

**P1: "O teu investimento caiu 20% num mês. O que fazes?"**
- (1) Vendo tudo imediatamente
- (2) Vendo parte para reduzir perdas
- (3) Não faço nada, espero recuperar
- (4) Aproveito para investir mais

**P2: "Qual destas opções preferes?"**
- (1) Ganho garantido de 3%/ano
- (2) 70% chance de ganhar 7%/ano, 30% chance de perder 2%
- (3) 50% chance de ganhar 12%/ano, 50% chance de perder 5%
- (4) 30% chance de ganhar 25%/ano, 70% chance de perder 10%

**P3: "Há quanto tempo investes?"**
- (1) Nunca investi
- (2) Menos de 1 ano
- (3) 1-5 anos
- (4) Mais de 5 anos

**P4: "Se precisasses do dinheiro investido em emergência, como te sentirias?"**
- (1) Preciso de acesso imediato sempre
- (2) Posso esperar algumas semanas
- (3) Consigo esperar meses
- (4) Não vou precisar deste dinheiro por muitos anos

**P5: "Como descreves os teus conhecimentos de investimento?"**
- (1) Nenhum — sou totalmente iniciante
- (2) Básico — sei o que são ETFs e ações
- (3) Intermédio — invisto regularmente
- (4) Avançado — analiso mercados e faço gestão ativa

### UI:
- Uma pergunta por card, com opções como radio buttons estilizados
- Barra de progresso das perguntas (1/5, 2/5...)
- Animação de transição entre perguntas (slide horizontal)

---

## Lógica de Perfil de Investidor

### Scoring → Perfil:

| Pontuação | Perfil | Descrição |
|---|---|---|
| 5-8 | **Conservador** | Prioridade: preservar capital com crescimento modesto |
| 9-12 | **Moderado** | Equilíbrio entre crescimento e segurança |
| 13-16 | **Dinâmico** | Aceita volatilidade para retornos superiores |
| 17-20 | **Agressivo** | Maximizar retorno, confortável com alto risco |

### Ajustes automáticos ao perfil baseados em:
- **Idade**: Se idade > 55 → reduzir 1 nível de risco (máx)
- **Horizonte**: Se horizonte < 5 anos → reduzir 1 nível de risco (máx)
- **Objetivo FIRE**: Se FIRE → manter no mínimo perfil Moderado (não pode ser Conservador para FIRE realista)

---

## Alocação de Ativos por Perfil

### Tabela de alocação base (método inspirado no "Ser Riquinho"):

| Classe de Ativo | Conservador | Moderado | Dinâmico | Agressivo |
|---|---|---|---|---|
| **ETFs Globais** (ex: VWCE, IWDA) | 50% | 55% | 50% | 40% |
| **Obrigações/Bonds** (ex: ETF obrigações) | 30% | 15% | 5% | 0% |
| **Ações individuais** | 5% | 15% | 25% | 35% |
| **Ouro** (ex: ETF ouro) | 10% | 8% | 5% | 5% |
| **REITs** | 5% | 5% | 5% | 5% |
| **Ativos de alto risco** (cripto, etc.) | 0% | 2% | 10% | 15% |

### Exemplos de ativos a sugerir por classe:

| Classe | Exemplos sugeridos |
|---|---|
| ETFs Globais | VWCE (Vanguard FTSE All-World), IWDA (iShares MSCI World) |
| Obrigações | AGGH (iShares Global Aggregate Bond), EUNA (iShares Euro Govt Bond) |
| Ações | "Baseado na tua análise própria ou sugestões da comunidade OGI" |
| Ouro | IGLN (iShares Physical Gold), GLD |
| REITs | IPRP (iShares European Property), VNQ |
| Alto Risco | BTC, ETH — "máx 5-15% do portfólio, nunca mais do que estás disposto a perder" |

> **NOTA LEGAL** (mostrar em rodapé): "Esta ferramenta é meramente educativa e não constitui aconselhamento financeiro. Consulta um profissional antes de investir."

---

## Projeções Financeiras

### Fórmulas:

**Retorno anual esperado por perfil:**
| Perfil | Retorno estimado (líquido de inflação) |
|---|---|
| Conservador | 4% |
| Moderado | 6% |
| Dinâmico | 8% |
| Agressivo | 10% |

**Fórmula de juros compostos com reforços mensais:**
```
FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
```
Onde:
- `FV` = valor futuro
- `PV` = capital inicial (já investido)
- `r` = taxa mensal (retorno_anual / 12)
- `n` = número de meses (horizonte × 12)
- `PMT` = reforço mensal

### Mostrar projeções para:
- **5 anos**
- **10 anos**
- **15 anos**
- **20 anos**
- **30 anos**
- **Horizonte definido pelo utilizador**

Cada projeção mostra:
- Capital total acumulado
- Total investido (contribuições)
- Ganhos (juros compostos)
- Se objetivo = FIRE: anos estimados até atingir o número FIRE

### Cálculo FIRE (se aplicável):
```
Número FIRE = (Renda passiva mensal desejada × 12) / 0.04
```
Regra dos 4% — igual à calculadora existente na imagem.

Ajuste à inflação (2% anual) e impostos (28% sobre rendimentos de capital em Portugal) — exatamente como na calculadora Excel existente.

---

## Ecrã de Resultados

### Layout (4 secções verticais):

#### 1. Header do Perfil
- Badge grande com o nome do perfil (ex: "DINÂMICO") com cor associada
- Frase descritiva do perfil
- Score de risco visual (barra de 5-20)

#### 2. Alocação de Ativos
- **Donut chart** (recharts PieChart) com as percentagens por classe
- Cores consistentes com os chart tokens CSS
- Lista ao lado do gráfico com cada classe, percentagem e exemplos de ativos
- Cada item clicável para expandir com mais info

#### 3. Projeção de Crescimento
- **Area chart** (recharts AreaChart) com eixo X = anos, eixo Y = valor €
- Duas áreas empilhadas: "Capital investido" (cor sólida) + "Retorno" (cor gradiente)
- Marcadores nos pontos chave (5, 10, 15, 20, 30 anos)
- Se FIRE: linha horizontal a tracejado no valor FIRE com label "Meta FIRE"
- Tooltip com detalhes ao hover

#### 4. Resumo / KPIs
- Grid de 4-6 cards com:
  - 💰 Capital em X anos (horizonte do utilizador)
  - 📈 Retorno total estimado
  - 🔥 Anos até FIRE (se aplicável)
  - 💵 Renda passiva mensal estimada (4% rule / 12)
  - 📊 Total investido vs total acumulado (ratio)
  - ⏱️ Se começasse 5 anos antes, teria: X€ (efeito motivacional)

#### 5. Disclaimer
- Card com fundo muted
- Texto legal: ferramenta educativa, não aconselhamento financeiro
- Menção ao método "Ser Riquinho" como inspiração
- Link para a comunidade OGI

### Ações:
- Botão "Refazer Plano" → volta ao step 1
- Botão "Partilhar Resultado" → gera imagem/screenshot ou copia link (futuro)
- Botão "Descarregar PDF" → gera PDF com o resumo (futuro, nice-to-have)

---

## Estrutura de Ficheiros

```
src/
├── app/
│   └── plano-investimento/
│       └── page.tsx                    # Página principal (wrapper)
├── features/
│   └── plano-investimento/
│       ├── components/
│       │   ├── InvestmentWizard.tsx     # Wizard container (state machine)
│       │   ├── StepPersonalData.tsx     # Step 1
│       │   ├── StepObjectives.tsx       # Step 2
│       │   ├── StepRiskTolerance.tsx    # Step 3
│       │   ├── ResultsPanel.tsx         # Ecrã de resultados (container)
│       │   ├── ProfileBadge.tsx         # Badge do perfil com cor
│       │   ├── AllocationChart.tsx      # Donut chart de alocação
│       │   ├── ProjectionChart.tsx      # Area chart de projeção
│       │   ├── KpiCards.tsx             # Grid de KPIs
│       │   ├── ProgressBar.tsx          # Barra de progresso do wizard
│       │   └── RiskQuestion.tsx         # Componente de pergunta individual
│       ├── lib/
│       │   ├── profiles.ts             # Definições de perfil e alocação
│       │   ├── calculations.ts         # Fórmulas financeiras (FV, FIRE, etc.)
│       │   ├── risk-scoring.ts         # Lógica de scoring e ajustes
│       │   └── constants.ts            # Constantes (perguntas, retornos, etc.)
│       └── types/
│           └── index.ts                # TypeScript interfaces
```

---

## TypeScript Interfaces Principais

```typescript
interface UserData {
  name?: string;
  age: number;
  monthlyIncome: number;
  monthlyInvestment: number;
  currentCapital: number;
}

type InvestmentGoal = 'accumulation' | 'passive_income' | 'fire';

interface Objectives {
  goal: InvestmentGoal;
  horizonYears: number;
  fireMonthlyTarget?: number; // só se goal === 'fire'
}

type RiskProfile = 'conservative' | 'moderate' | 'dynamic' | 'aggressive';

interface RiskAssessment {
  answers: number[]; // 5 respostas, cada uma 1-4
  rawScore: number;
  adjustedProfile: RiskProfile;
}

interface AssetAllocation {
  globalETFs: number;
  bonds: number;
  stocks: number;
  gold: number;
  reits: number;
  highRisk: number;
}

interface Projection {
  year: number;
  totalInvested: number;
  totalValue: number;
  returns: number;
}

interface InvestmentPlan {
  userData: UserData;
  objectives: Objectives;
  riskAssessment: RiskAssessment;
  profile: RiskProfile;
  allocation: AssetAllocation;
  projections: Projection[];
  fireNumber?: number;
  yearsToFire?: number;
}
```

---

## Notas para Implementação

1. **Mobile-first**: Muitos utilizadores OGI acedem por telemóvel. O wizard deve funcionar bem em ecrãs pequenos. Cards de objetivo empilham verticalmente em mobile.

2. **Internacionalização**: Toda a UI em **Português (PT-PT)**. Formatação numérica: `1.000,00 €` (ponto para milhares, vírgula para decimais).

3. **Performance**: Cálculos de projeção em `useMemo` — só recalcular quando inputs mudam.

4. **Acessibilidade**: Labels em todos os inputs, foco visível, navegação por teclado no wizard.

5. **Animações**: Transições entre steps (slide ou fade), entrada suave dos resultados, contagem animada nos KPIs (count-up effect).

6. **Sem backend**: Tudo client-side. Nenhum dado é guardado ou enviado. Mencionar isto para confiança do utilizador.

7. **Consistência com Comunidade_login**: Usar exatamente os mesmos design tokens (oklch), componentes shadcn/ui, e padrão de dark/light mode com next-themes.

---

## Prioridades de Implementação

### MVP (obrigatório):
- [ ] Wizard 3 steps + resultados
- [ ] Perfil de investidor com scoring
- [ ] Donut chart de alocação
- [ ] Projeção com area chart
- [ ] Cálculo FIRE (se aplicável)
- [ ] KPI cards
- [ ] Responsive mobile
- [ ] Dark/light mode

### Nice-to-have (fase 2):
- [ ] Exportar PDF com resultados
- [ ] Partilhar resultado (screenshot/link)
- [ ] Comparação "e se começasse X anos antes"
- [ ] Slider interativo para ajustar alocação manualmente
- [ ] Integração com calculadora FIRE existente (link)
