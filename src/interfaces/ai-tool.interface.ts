import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: 'code-assistance' | 'productivity' | 'learning';
  icon: string;
  isActive: boolean;
  backgroundPattern?: string;
  iconBackground?: string;
} 