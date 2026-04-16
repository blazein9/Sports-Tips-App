export type Category = 'Football' | 'Basketball' | 'Tennis';

export interface Tip {
  id: string;
  category: Category;
  title: string;
  description: string;
  value: number;
}

export const SHEET_ID = '1aWsGvx7kX1UZRm6-3y4Mq-FRTf1A3AVZEtbIaedc-t8';
export const SHEET_GID = '0';
export const SHEET_RANGE = 'A2:E';

const normalizeCell = (value: string | undefined) => (value ?? '').trim();

const buildTipFromRow = (row: string[], index: number): Tip => {
  const cells = row.map(normalizeCell);

  if (cells.length >= 5) {
    const [id, category, title, description, valueText] = cells;
    return {
      id: id || `tip-${index + 1}`,
      category: category as Category,
      title,
      description,
      value: Number(valueText) || 0,
    };
  }

  if (cells.length === 4) {
    const [category, title, description, valueText] = cells;
    return {
      id: `${category.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
      category: category as Category,
      title,
      description,
      value: Number(valueText) || 0,
    };
  }

  throw new Error('Unsupported Google Sheet row format. Use 4 or 5 columns with category, title, description, and value.');
};

const parseCsv = (csvText: string): Tip[] => {
  const rows = csvText
    .trim()
    .split(/\r?\n/)
    .map((row) =>
      row
        .split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
        .map((cell) => cell.replace(/^\"|\"$/g, '').trim()),
    );

  if (rows.length === 0) return [];

  const firstRow = rows[0].map((cell) => cell.toLowerCase());
  const hasHeader = firstRow.includes('category') || firstRow.includes('title') || firstRow.includes('description');
  const dataRows = hasHeader ? rows.slice(1) : rows;

  return dataRows.map((row, index) => buildTipFromRow(row, index));
};

const parseGoogleSheetsValues = (values: string[][]): Tip[] => {
  if (values.length === 0) return [];

  const firstRow = values[0].map((cell) => cell.toLowerCase());
  const hasHeader = firstRow.includes('category') || firstRow.includes('title') || firstRow.includes('description');
  const dataRows = hasHeader ? values.slice(1) : values;

  return dataRows.map((row, index) => buildTipFromRow(row, index));
};

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

export const fetchTipsFromGoogleSheet = async (apiKey?: string): Promise<Tip[]> => {
  const sheetId = SHEET_ID;

  if (apiKey) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SHEET_RANGE}?key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Sheets API request failed: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return parseGoogleSheetsValues(json.values || []);
  }

  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${SHEET_GID}`;
  const response = await fetch(csvUrl);

  if (!response.ok) {
    throw new Error('Unable to fetch the sheet. Make sure the Google Sheet is published or provide a valid API key.');
  }

  const csvText = await response.text();
  return parseCsv(csvText);
};
