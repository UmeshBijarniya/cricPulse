/**
 * Win Probability Engine for Cricket (T20 Format)
 * Computes realistic, smooth, dynamic probabilities using a calibrated logistic model
 * based on Target, Required Run Rate, Current Run Rate, Balls Remaining, and Wickets in Hand.
 */

export interface WinProbabilityResult {
  battingTeam: number;
  bowlingTeam: number;
}

export function calculateWinProbability(params: {
  target: number | null;
  runs: number;
  wickets: number;
  legalBalls: number;
  maxBalls?: number;
}): WinProbabilityResult {
  const { target, runs, wickets, legalBalls, maxBalls = 120 } = params;
  const ballsRemaining = Math.max(0, maxBalls - legalBalls);
  const wicketsInHand = Math.max(0, 10 - wickets);

  // If 1st innings (no target yet)
  if (target === null) {
    // In first innings, benchmark against average par score of 175
    const parScore = 175;
    const crr = legalBalls > 0 ? (runs / legalBalls) * 6 : 8.0;
    const projected = legalBalls > 0 ? runs + (crr * (ballsRemaining / 6)) : parScore;
    
    // Base 50-50, adjusted by projected score vs par and wickets preserved
    const scoreDiff = projected - parScore;
    const wicketBonus = (wicketsInHand - (10 - (legalBalls / 12))) * 2.5;
    const logit = (scoreDiff * 0.04) + (wicketBonus * 0.05);
    const probBat = 1 / (1 + Math.exp(-logit));
    const pctBat = Math.min(95, Math.max(5, Math.round(probBat * 100)));
    return {
      battingTeam: pctBat,
      bowlingTeam: 100 - pctBat,
    };
  }

  // 2nd Innings: Chasing Target
  const requiredRuns = target - runs;

  // Immediate terminal states
  if (requiredRuns <= 0) {
    return { battingTeam: 100, bowlingTeam: 0 };
  }
  if (wicketsInHand <= 0 || (ballsRemaining <= 0 && requiredRuns > 0)) {
    return { battingTeam: 0, bowlingTeam: 100 };
  }

  // If only 1 run needed and balls remaining
  if (requiredRuns === 1 && ballsRemaining >= 1 && wicketsInHand >= 1) {
    const batProb = Math.min(99, 92 + wicketsInHand);
    return { battingTeam: batProb, bowlingTeam: 100 - batProb };
  }

  // Required Run Rate (per 6 balls)
  const rrr = (requiredRuns / ballsRemaining) * 6;
  const crr = legalBalls > 0 ? (runs / legalBalls) * 6 : 8.0;

  // Logistic Regression factors
  // Standard benchmark T20 chase: par RRR ~ 8.5
  // Wicket impact increases as fewer balls remain
  const deathOversFactor = (120 - ballsRemaining) / 120; // 0 at start, 1 at end
  const rrrDelta = rrr - 8.5;

  let z = 0;
  // Negative weight for excessive RRR
  z -= rrrDelta * (0.35 + deathOversFactor * 0.25);

  // Positive weight for wickets in hand (standard is 5 wickets in hand)
  z += (wicketsInHand - 5) * (0.32 + deathOversFactor * 0.15);

  // Severe penalty if RRR is unattainable (>24 RPO or > 36 RPO)
  if (rrr > 24) {
    z -= (rrr - 24) * 0.8;
  }
  if (wicketsInHand <= 2 && rrr > 10) {
    z -= 1.5;
  }
  if (wicketsInHand === 1 && rrr > 8) {
    z -= 2.0;
  }

  // Momentum bonus if CRR is high
  if (crr > rrr) {
    z += 0.25;
  }

  // Logistic function
  const rawProb = 1 / (1 + Math.exp(-z));
  let battingPercent = Math.round(rawProb * 100);

  // Clamp within realistic thresholds
  battingPercent = Math.max(1, Math.min(99, battingPercent));

  return {
    battingTeam: battingPercent,
    bowlingTeam: 100 - battingPercent,
  };
}

export function calculateProjectedScore(runs: number, legalBalls: number, maxBalls = 120): number {
  if (legalBalls === 0) return 175;
  const crr = (runs / legalBalls) * 6;
  const ballsRemaining = maxBalls - legalBalls;
  const deathOverBonus = legalBalls > 90 ? 1.15 : 1.0;
  const projected = Math.round(runs + ((crr * ballsRemaining) / 6) * deathOverBonus);
  return Math.max(runs, projected);
}
