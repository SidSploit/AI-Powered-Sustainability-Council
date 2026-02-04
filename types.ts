
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface User {
  name: string;
  email: string;
  loggedIn: boolean;
}

export interface Persona {
  id: string;
  title: string;
  primary_concerns: string[];
  statement: string;
}

export interface CSRMetric {
  rating: 'High' | 'Medium' | 'Low';
  key_points: string[];
}

export interface CSRAssessment {
  environmental: CSRMetric;
  social: CSRMetric;
  governance_economic: CSRMetric;
}

export interface OptionSummary {
  option_name: string;
  description: string;
  csr_implications: {
    environmental: string;
    social: string;
    governance_economic: string;
  };
}

export interface RecommendedOption {
  name: string;
  reasoning: string;
}

export interface CouncilOutput {
  scenario_summary: string;
  assumptions: string[];
  personas: Persona[];
  csr_assessment: CSRAssessment;
  options_and_recommendation: {
    option_summaries: OptionSummary[];
    recommended_option: RecommendedOption;
  };
}

export interface RiskOpportunity {
  label: string;
  description: string;
  horizon: 'short-term' | 'medium-term' | 'long-term';
}

export interface RisksAndOpportunitiesOutput {
  risks: RiskOpportunity[];
  opportunities: RiskOpportunity[];
}

export interface ImprovementSuggestion {
  text: string;
  dimensions: string[];
  trade_offs?: string;
}

export interface ImprovementOutput {
  intro: string;
  suggestions: ImprovementSuggestion[];
}

export interface SimpleExplanationOutput {
  explanation: string;
  role_based_summary: string;
}

export enum ScenarioType {
  ENERGY = 'Energy & Renewables',
  WATER = 'Water & Drought',
  CITIES = 'Cities & Transport',
  BUILDINGS = 'Buildings & Cooling',
  WASTE = 'Waste & Materials',
  OTHER = 'Other'
}
