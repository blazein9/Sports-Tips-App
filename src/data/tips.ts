export type Category = 'Football' | 'Basketball' | 'Tennis';

export interface Tip {
  id: string;
  category: Category;
  title: string;
  description: string;
  value: number;
}

export const tips: Tip[] = [
  {
    id: 'football-1',
    category: 'Football',
    title: 'Home side strong line-up',
    description: 'The home team has key players back from injury and should control midfield.',
    value: 5,
  },
  {
    id: 'football-2',
    category: 'Football',
    title: 'Under 2.5 goals likely',
    description: 'Both teams are defensively disciplined, so goals should be limited.',
    value: 3,
  },
  {
    id: 'football-3',
    category: 'Football',
    title: 'Look for a draw',
    description: 'The away team has been unbeaten in recent away matches, making a draw probable.',
    value: 2,
  },
  {
    id: 'basketball-1',
    category: 'Basketball',
    title: 'Fast-paced clash expected',
    description: 'Both teams score quickly and push the pace, favoring over points.',
    value: 4,
  },
  {
    id: 'basketball-2',
    category: 'Basketball',
    title: 'Home offense has edge',
    description: 'The home team has a strong shooting record from three-point range.',
    value: 5,
  },
  {
    id: 'basketball-3',
    category: 'Basketball',
    title: 'Defensive battle',
    description: 'Recent meetings have been low scoring, so the total may stay under the line.',
    value: 2,
  },
  {
    id: 'tennis-1',
    category: 'Tennis',
    title: 'Top seed should win in straight sets',
    description: 'The favorite has been dominant on this surface all season.',
    value: 5,
  },
  {
    id: 'tennis-2',
    category: 'Tennis',
    title: 'Tiebreak likely',
    description: 'Both players have strong serve numbers and few breaks in recent matches.',
    value: 4,
  },
  {
    id: 'tennis-3',
    category: 'Tennis',
    title: 'Underdog value',
    description: 'The lower-ranked player has improved quickly and may push the favorite hard.',
    value: 3,
  },
];
