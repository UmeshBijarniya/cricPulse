export type ExtraType = 'wide' | 'no-ball' | 'bye' | 'leg-bye';
export type WicketType = 'bowled' | 'caught' | 'lbw' | 'run-out' | 'stumped';

export interface Batsman {
  id: string;
  name: string;
  shortName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissal: string | null;
  isStriker: boolean;
}

export interface Bowler {
  id: string;
  name: string;
  shortName: string;
  overs: string; // e.g. "3.2"
  legalBalls: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface DeliveryOutcome {
  id: string;
  overIndex: number; // 0 to 19
  ballInOver: number; // 1 to 6
  displayBall: string; // e.g. "16.4"
  bowlerName: string;
  batsmanName: string;
  nonStrikerName: string;
  runs: number;
  extraRuns: number;
  extraType?: ExtraType;
  isWicket: boolean;
  wicketType?: WicketType;
  outBatsman?: string;
  isBoundary: boolean;
  isFour: boolean;
  isSix: boolean;
  commentary: string;
  scoreAfterBall: string; // e.g. "164/3"
  winProbabilityAfter: {
    battingTeam: number;
    bowlingTeam: number;
  };
  timestamp: number;
}

export interface OverSummary {
  overNumber: number; // 1 to 20
  displayOver: string; // e.g. "Over 17"
  runsInOver: number;
  cumulativeRuns: number;
  cumulativeWickets: number;
  wicketsInOver: number;
  balls: string[]; // e.g. ["1", "4", "•", "W", "6", "2"]
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface FirstInningsData {
  team: Team;
  runs: number;
  wickets: number;
  overs: string;
  overSummaries: OverSummary[];
}

export interface MatchState {
  id: string;
  title: string;
  series: string;
  venue: string;
  matchType: 'T20';
  status: 'live' | 'completed' | 'paused';
  statusNote: string;
  battingTeam: Team;
  bowlingTeam: Team;
  innings: 1 | 2;
  target: number | null;
  runs: number;
  wickets: number;
  overs: string; // e.g. "16.4"
  completedOvers: number;
  ballsInCurrentOver: number;
  totalLegalBalls: number;
  maxOvers: number;
  crr: number;
  rrr: number | null;
  requiredRuns: number | null;
  ballsRemaining: number;
  projectedScore: number;
  winProbability: {
    battingTeam: number;
    bowlingTeam: number;
  };
  striker: Batsman;
  nonStriker: Batsman;
  currentBowler: Bowler;
  batsmen: Batsman[];
  bowlers: Bowler[];
  recentBalls: DeliveryOutcome[]; // recent ~30 deliveries for commentary
  overSummaries: OverSummary[]; // 1 to 20 for Worm chart
  firstInningsData?: FirstInningsData;
  isSimulating: boolean;
  speedMs: number;
  winner?: string;
  summaryText?: string;
}

export type SocketMessageType =
  | 'MATCH_INIT'
  | 'BALL_UPDATE'
  | 'OVER_COMPLETED'
  | 'WICKET_FALL'
  | 'MATCH_COMPLETED'
  | 'SIMULATION_STATE'
  | 'PING'
  | 'PONG';

export interface SocketMessage {
  type: SocketMessageType;
  payload: any;
  timestamp: number;
}
