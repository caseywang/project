
// Fix: Import React to resolve React.ReactNode namespace error
import React from 'react';

export enum ToolType {
  HOME = 'HOME',
  STRATEGY_MATRIX = 'STRATEGY_MATRIX',
  INTELLIGENCE_CARD = 'INTELLIGENCE_CARD',
  EMAIL_TEMPLATES = 'EMAIL_TEMPLATES',
  AI_PROMPTS = 'AI_PROMPTS',
  SUBTEXT_DECODER = 'SUBTEXT_DECODER',
  SETTINGS = 'SETTINGS'
}

export interface NavItem {
  id: ToolType;
  label: string;
  icon: React.ReactNode;
}

export interface StrategyPoint {
  title: string;
  goal: string;
  items: string[];
}

export interface Strategy3R {
  recognize: StrategyPoint;
  review: StrategyPoint;
  realign: StrategyPoint;
}
