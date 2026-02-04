
import React from 'react';
import { ScenarioType } from './types';

export const APP_NAME = "Sustainability Council";

export const PERSONA_DEFINITIONS = [
  { id: 'climate_scientist', title: 'Climate Scientist', care: 'Long-term climate impact and physical risks.' },
  { id: 'carbon_analyst', title: 'Carbon Footprint Analyst', care: 'Direct and indirect greenhouse gas emissions metrics.' },
  { id: 'biodiversity_ecologist', title: 'Biodiversity Ecologist', care: 'Ecosystem health, habitat preservation, and local flora/fauna.' },
  { id: 'community_rep', title: 'Community Representative', care: 'Local jobs, health, equity, and public acceptance.' },
  { id: 'urban_planner', title: 'Urban Planner', care: 'Infrastructure resilience, land use efficiency, and zoning.' },
  { id: 'csr_lead', title: 'Business Strategy / CSR Lead', care: 'ESG brand value, stakeholder reporting, and market alignment.' },
  { id: 'finance_officer', title: 'Public Finance / Budget Officer', care: 'Capital efficiency, ROI, and long-term economic viability.' }
];

export const PRESET_SCENARIOS = [
  {
    title: "Cool City District Retrofit",
    type: ScenarioType.CITIES,
    scenario: "Proposed redevelopment of a 50-acre industrial site into a car-free residential district with 40% green cover, local energy production, and rainwater harvesting in a high-density urban core. Budget is moderate but timeline is aggressive (5 years).",
    featured: true
  },
  {
    title: "Net Zero Campus Energy",
    type: ScenarioType.ENERGY,
    scenario: "Transitioning a university campus to 100% renewable energy by 2030 through rooftop solar, ground-source heat pumps, and a centralized battery storage system. Needs to maintain service for 20,000 students."
  },
  {
    title: "Coastal Defense Strategy",
    type: ScenarioType.WATER,
    scenario: "A municipality debating between building a sea wall (engineered) or restoring 200 hectares of mangroves and dunes (nature-based) to protect against rising sea levels and storm surges. Costs and maintenance differ significantly."
  }
];

export const COUNCIL_SYSTEM_PROMPT = `
You are Sustainability Council, a multi-persona AI assistant evaluating a sustainability project through Environmental, Social, and Governance/Economic (CSR framework).

Personas (7):
1. Climate Scientist
2. Carbon Footprint Analyst
3. Biodiversity Ecologist
4. Community Representative
5. Urban Planner / Infrastructure Engineer
6. Business Strategy / CSR Lead
7. Public Finance / Budget Officer

CRITICAL SAFETY RULES:
- Avoid generating harmful, abusive, or illegal content.
- Do not return or infer personally identifiable information about real individuals.
- Frame all recommendations as advisory; the user remains responsible for decisions.

Your response MUST be valid JSON matching this schema:
{
  "scenario_summary": "Short summary of what was proposed",
  "assumptions": ["bullet point list of key assumptions"],
  "personas": [
    {
      "id": "persona_id",
      "title": "Persona Title",
      "primary_concerns": ["emissions", "resilience", "..."],
      "statement": "Summary of this persona's perspective"
    }
  ],
  "csr_assessment": {
    "environmental": { "rating": "High" | "Medium" | "Low", "key_points": ["..."] },
    "social": { "rating": "High" | "Medium" | "Low", "key_points": ["..."] },
    "governance_economic": { "rating": "High" | "Medium" | "Low", "key_points": ["..."] }
  },
  "options_and_recommendation": {
    "option_summaries": [
      {
        "option_name": "Option Name",
        "description": "Brief description",
        "csr_implications": {
          "environmental": "Implications text",
          "social": "Implications text",
          "governance_economic": "Implications text"
        }
      }
    ],
    "recommended_option": {
      "name": "Option Name",
      "reasoning": "Explain why this option is most balanced and sustainable."
    }
  }
}
`;

export const LogoIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" />
    <path d="M50 20C40 40 40 60 50 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M50 20C60 40 60 60 50 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <circle cx="50" cy="35" r="5" fill="currentColor" />
    <circle cx="35" cy="55" r="5" fill="currentColor" />
    <circle cx="65" cy="55" r="5" fill="currentColor" />
    <path d="M35 55L50 35L65 55" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
  </svg>
);
