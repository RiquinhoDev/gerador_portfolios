import type { InvestmentGoal, RiskQuestion, UserData, WizardState } from '../types'

export const WIZARD_TOTAL_STEPS = 4

export const GOAL_OPTIONS: Array<{
  value: InvestmentGoal
  title: string
  description: string
}> = [
  {
    value: 'accumulation',
    title: 'Acumulação de capital',
    description: 'Fazer crescer o teu capital ao longo do tempo.'
  },
  {
    value: 'passive_income',
    title: 'Rendimento extra mensal',
    description: 'Gerar rendimento passivo com consistência.'
  },
  {
    value: 'fire',
    title: 'Liberdade financeira (FIRE)',
    description: 'Atingir independência financeira total.'
  }
]

export const RISK_QUESTIONS: RiskQuestion[] = [
  {
    id: 'p1',
    prompt: 'O teu investimento caiu 20% num mês. O que fazes?',
    options: [
      { label: 'Vendo tudo imediatamente', points: 1 },
      { label: 'Vendo parte para reduzir perdas', points: 2 },
      { label: 'Não faço nada, espero recuperar', points: 3 },
      { label: 'Aproveito para investir mais', points: 4 }
    ]
  },
  {
    id: 'p2',
    prompt: 'Imagina que tens 10.000€ para investir. O que preferes?',
    options: [
      { label: 'Garantir que nunca perco dinheiro, mesmo que cresça pouco', points: 1 },
      { label: 'Crescer de forma estável, aceitando perder um pouco num mau ano', points: 2 },
      { label: 'Arriscar perdas maiores em anos maus para ganhar mais a longo prazo', points: 3 },
      { label: 'Maximizar o crescimento — aceito perdas significativas se o potencial for alto', points: 4 }
    ]
  },
  {
    id: 'p3',
    prompt: 'Há quanto tempo investes?',
    options: [
      { label: 'Nunca investi', points: 1 },
      { label: 'Menos de 1 ano', points: 2 },
      { label: '1-5 anos', points: 3 },
      { label: 'Mais de 5 anos', points: 4 }
    ]
  },
  {
    id: 'p4',
    prompt: 'Imagina que encontras algo que queres muito comprar — uma viagem, um carro, uma remodelação. O que fazes?',
    options: [
      { label: 'Vendo os investimentos para pagar — o dinheiro está lá para isso', points: 1 },
      { label: 'Penso em vender uma parte, mas fico com algum investido', points: 2 },
      { label: 'Só vendo se não houver mesmo outra forma de pagar', points: 3 },
      { label: 'Nunca tocaria nos investimentos — arranjo outra forma', points: 4 }
    ]
  },
  {
    id: 'p5',
    prompt: 'Como descreves os teus conhecimentos de investimento?',
    options: [
      { label: 'Nenhum, sou totalmente iniciante', points: 1 },
      { label: 'Básico, sei o que são ETFs e ações', points: 2 },
      { label: 'Intermédio, invisto regularmente', points: 3 },
      { label: 'Avançado, analiso mercados e faço gestão ativa', points: 4 }
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
    { key: 'monthlyIncome', value: userData.monthlyIncome, label: 'Rendimento líquido mensal' },
    {
      key: 'monthlyInvestment',
      value: userData.monthlyInvestment,
      label: 'Quanto consegues investir por mês'
    },
    { key: 'currentCapital', value: userData.currentCapital, label: 'Capital já investido' }
  ]
}
