import type { InvestmentGoal, RiskQuestion, UserData, WizardState } from '../types'

export const WIZARD_TOTAL_STEPS = 4

export const GOAL_OPTIONS: Array<{
  value: InvestmentGoal
  title: string
  description: string
}> = [
  {
    value: 'accumulation',
    title: 'Acumulacao de capital',
    description: 'Fazer crescer o teu capital ao longo do tempo.'
  },
  {
    value: 'passive_income',
    title: 'Rendimento extra mensal',
    description: 'Gerar rendimento passivo com consistencia.'
  },
  {
    value: 'fire',
    title: 'Liberdade financeira (FIRE)',
    description: 'Atingir independencia financeira total.'
  }
]

export const RISK_QUESTIONS: RiskQuestion[] = [
  {
    id: 'p1',
    prompt: 'O teu investimento caiu 20% num mes. O que fazes?',
    options: [
      { label: 'Vendo tudo imediatamente', points: 1 },
      { label: 'Vendo parte para reduzir perdas', points: 2 },
      { label: 'Nao faco nada, espero recuperar', points: 3 },
      { label: 'Aproveito para investir mais', points: 4 }
    ]
  },
  {
    id: 'p2',
    prompt: 'Qual destas opcoes preferes?',
    options: [
      { label: 'Ganho garantido de 3%/ano', points: 1 },
      { label: '70% chance de ganhar 7%/ano, 30% chance de perder 2%', points: 2 },
      { label: '50% chance de ganhar 12%/ano, 50% chance de perder 5%', points: 3 },
      { label: '30% chance de ganhar 25%/ano, 70% chance de perder 10%', points: 4 }
    ]
  },
  {
    id: 'p3',
    prompt: 'Ha quanto tempo investes?',
    options: [
      { label: 'Nunca investi', points: 1 },
      { label: 'Menos de 1 ano', points: 2 },
      { label: '1-5 anos', points: 3 },
      { label: 'Mais de 5 anos', points: 4 }
    ]
  },
  {
    id: 'p4',
    prompt: 'Se precisasses do dinheiro investido em emergencia, como te sentirias?',
    options: [
      { label: 'Preciso de acesso imediato sempre', points: 1 },
      { label: 'Posso esperar algumas semanas', points: 2 },
      { label: 'Consigo esperar meses', points: 3 },
      { label: 'Nao vou precisar deste dinheiro por muitos anos', points: 4 }
    ]
  },
  {
    id: 'p5',
    prompt: 'Como descreves os teus conhecimentos de investimento?',
    options: [
      { label: 'Nenhum, sou totalmente iniciante', points: 1 },
      { label: 'Basico, sei o que sao ETFs e acoes', points: 2 },
      { label: 'Intermedio, invisto regularmente', points: 3 },
      { label: 'Avancado, analiso mercados e faco gestao ativa', points: 4 }
    ]
  }
]

export const INITIAL_WIZARD_STATE: WizardState = {
  userData: {
    name: '',
    age: null,
    monthlyIncome: null,
    monthlyInvestment: null,
    currentCapital: 0
  },
  objectives: {
    goal: null,
    horizonYears: 15,
    fireMonthlyTarget: null
  },
  riskAssessment: {
    answers: Array.from({ length: RISK_QUESTIONS.length }, () => 0),
    rawScore: 0
  }
}

export function getUserDataFields(userData: UserData) {
  return [
    { key: 'name', value: userData.name ?? '', label: 'Nome (opcional)' },
    { key: 'age', value: userData.age, label: 'Idade' },
    { key: 'monthlyIncome', value: userData.monthlyIncome, label: 'Rendimento liquido mensal' },
    {
      key: 'monthlyInvestment',
      value: userData.monthlyInvestment,
      label: 'Quanto consegues investir por mes'
    },
    { key: 'currentCapital', value: userData.currentCapital, label: 'Capital ja investido' }
  ]
}
