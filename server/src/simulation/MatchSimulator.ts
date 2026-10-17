import {
  MatchState,
  Batsman,
  Bowler,
  DeliveryOutcome,
  OverSummary,
  ExtraType,
  WicketType,
  SocketMessageType,
} from '../types.js';
import { calculateWinProbability, calculateProjectedScore } from './winProbabilityEngine.js';
import { generateCommentary } from './commentaryGenerator.js';

export class MatchSimulator {
  private state!: MatchState;
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: ((type: SocketMessageType, payload: any) => void)[] = [];
  private speedMs: number = 3200; // 3.2 seconds per ball

  constructor() {
    this.resetMatch();
  }

  public subscribe(listener: (type: SocketMessageType, payload: any) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private broadcast(type: SocketMessageType, payload: any) {
    for (const listener of this.listeners) {
      listener(type, payload);
    }
  }

  public getState(): MatchState {
    return { ...this.state };
  }

  public setSpeed(ms: number) {
    this.speedMs = Math.max(800, Math.min(10000, ms));
    this.state.speedMs = this.speedMs;
    if (this.state.isSimulating) {
      this.stop();
      this.start();
    }
    this.broadcast('SIMULATION_STATE', { isSimulating: this.state.isSimulating, speedMs: this.speedMs });
  }

  public togglePlay(): boolean {
    if (this.state.isSimulating) {
      this.stop();
    } else {
      if (this.state.status === 'completed') {
        this.resetMatch();
      }
      this.start();
    }
    this.broadcast('SIMULATION_STATE', { isSimulating: this.state.isSimulating, speedMs: this.speedMs });
    return this.state.isSimulating;
  }

  public start() {
    if (this.intervalId || this.state.status === 'completed') return;
    this.state.isSimulating = true;
    this.state.status = 'live';
    this.intervalId = setInterval(() => {
      this.simulateNextBall();
    }, this.speedMs);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.state.isSimulating = false;
  }

  public restart() {
    this.stop();
    this.resetMatch();
    this.start();
    this.broadcast('MATCH_INIT', this.getState());
  }

  public resetMatch() {
    const battingTeam = {
      id: 'ind',
      name: 'India',
      shortName: 'IND',
      primaryColor: '#1E40AF',
      secondaryColor: '#F97316',
    };

    const bowlingTeam = {
      id: 'aus',
      name: 'Australia',
      shortName: 'AUS',
      primaryColor: '#EAB308',
      secondaryColor: '#15803D',
    };

    // First Innings by Australia: 184/5 in 20.0 Overs
    const firstInningsOvers: OverSummary[] = [
      { overNumber: 1, displayOver: 'Over 1', runsInOver: 8, cumulativeRuns: 8, cumulativeWickets: 0, wicketsInOver: 0, balls: ['1', '0', '4', '1', '1', '1'] },
      { overNumber: 2, displayOver: 'Over 2', runsInOver: 11, cumulativeRuns: 19, cumulativeWickets: 0, wicketsInOver: 0, balls: ['4', '1', '0', '6', '0', '0'] },
      { overNumber: 3, displayOver: 'Over 3', runsInOver: 7, cumulativeRuns: 26, cumulativeWickets: 1, wicketsInOver: 1, balls: ['1', 'W', '0', '4', '1', '1'] },
      { overNumber: 4, displayOver: 'Over 4', runsInOver: 14, cumulativeRuns: 40, cumulativeWickets: 1, wicketsInOver: 0, balls: ['6', '1', '1', '4', '1', '1'] },
      { overNumber: 5, displayOver: 'Over 5', runsInOver: 9, cumulativeRuns: 49, cumulativeWickets: 1, wicketsInOver: 0, balls: ['1', '4', '1', '1', '2', '0'] },
      { overNumber: 6, displayOver: 'Over 6', runsInOver: 12, cumulativeRuns: 61, cumulativeWickets: 1, wicketsInOver: 0, balls: ['4', '1', '1', '4', '1', '1'] },
      { overNumber: 7, displayOver: 'Over 7', runsInOver: 6, cumulativeRuns: 67, cumulativeWickets: 2, wicketsInOver: 1, balls: ['1', '1', 'W', '1', '1', '2'] },
      { overNumber: 8, displayOver: 'Over 8', runsInOver: 9, cumulativeRuns: 76, cumulativeWickets: 2, wicketsInOver: 0, balls: ['1', '2', '1', '4', '0', '1'] },
      { overNumber: 9, displayOver: 'Over 9', runsInOver: 8, cumulativeRuns: 84, cumulativeWickets: 2, wicketsInOver: 0, balls: ['1', '1', '2', '1', '2', '1'] },
      { overNumber: 10, displayOver: 'Over 10', runsInOver: 13, cumulativeRuns: 97, cumulativeWickets: 2, wicketsInOver: 0, balls: ['6', '1', '1', '4', '0', '1'] },
      { overNumber: 11, displayOver: 'Over 11', runsInOver: 7, cumulativeRuns: 104, cumulativeWickets: 3, wicketsInOver: 1, balls: ['1', 'W', '1', '1', '2', '2'] },
      { overNumber: 12, displayOver: 'Over 12', runsInOver: 10, cumulativeRuns: 114, cumulativeWickets: 3, wicketsInOver: 0, balls: ['1', '4', '1', '1', '1', '2'] },
      { overNumber: 13, displayOver: 'Over 13', runsInOver: 11, cumulativeRuns: 125, cumulativeWickets: 3, wicketsInOver: 0, balls: ['4', '1', '1', '1', '4', '0'] },
      { overNumber: 14, displayOver: 'Over 14', runsInOver: 8, cumulativeRuns: 133, cumulativeWickets: 4, wicketsInOver: 1, balls: ['1', '1', 'W', '2', '4', '0'] },
      { overNumber: 15, displayOver: 'Over 15', runsInOver: 12, cumulativeRuns: 145, cumulativeWickets: 4, wicketsInOver: 0, balls: ['1', '6', '1', '1', '1', '2'] },
      { overNumber: 16, displayOver: 'Over 16', runsInOver: 9, cumulativeRuns: 154, cumulativeWickets: 4, wicketsInOver: 0, balls: ['2', '1', '1', '4', '0', '1'] },
      { overNumber: 17, displayOver: 'Over 17', runsInOver: 7, cumulativeRuns: 161, cumulativeWickets: 5, wicketsInOver: 1, balls: ['1', 'W', '1', '1', '2', '2'] },
      { overNumber: 18, displayOver: 'Over 18', runsInOver: 11, cumulativeRuns: 172, cumulativeWickets: 5, wicketsInOver: 0, balls: ['4', '1', '1', '1', '4', '0'] },
      { overNumber: 19, displayOver: 'Over 19', runsInOver: 6, cumulativeRuns: 178, cumulativeWickets: 5, wicketsInOver: 0, balls: ['1', '1', '2', '1', '0', '1'] },
      { overNumber: 20, displayOver: 'Over 20', runsInOver: 6, cumulativeRuns: 184, cumulativeWickets: 5, wicketsInOver: 0, balls: ['1', '2', '1', '1', '1', '0'] },
    ];

    const target = 185;

    // Lineup for India
    const allBatsmen: Batsman[] = [
      { id: 'b1', name: 'Rohit Sharma (c)', shortName: 'R. Sharma', runs: 42, balls: 23, fours: 5, sixes: 2, strikeRate: 182.6, isOut: true, dismissal: 'c Warner b Starc', isStriker: false },
      { id: 'b2', name: 'Yashasvi Jaiswal', shortName: 'Y. Jaiswal', runs: 26, balls: 16, fours: 3, sixes: 1, strikeRate: 162.5, isOut: true, dismissal: 'b Hazlewood', isStriker: false },
      { id: 'b3', name: 'Virat Kohli', shortName: 'V. Kohli', runs: 39, balls: 28, fours: 3, sixes: 1, strikeRate: 139.3, isOut: true, dismissal: 'c & b Zampa', isStriker: false },
      { id: 'b4', name: 'Suryakumar Yadav', shortName: 'S. Yadav', runs: 38, balls: 21, fours: 4, sixes: 2, strikeRate: 180.9, isOut: false, dismissal: null, isStriker: true },
      { id: 'b5', name: 'Rishabh Pant (wk)', shortName: 'R. Pant', runs: 16, balls: 11, fours: 2, sixes: 0, strikeRate: 145.4, isOut: false, dismissal: null, isStriker: false },
      { id: 'b6', name: 'Hardik Pandya', shortName: 'H. Pandya', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, dismissal: null, isStriker: false },
      { id: 'b7', name: 'Ravindra Jadeja', shortName: 'R. Jadeja', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, dismissal: null, isStriker: false },
      { id: 'b8', name: 'Axar Patel', shortName: 'A. Patel', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, dismissal: null, isStriker: false },
      { id: 'b9', name: 'Jasprit Bumrah', shortName: 'J. Bumrah', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, dismissal: null, isStriker: false },
      { id: 'b10', name: 'Arshdeep Singh', shortName: 'A. Singh', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, dismissal: null, isStriker: false },
      { id: 'b11', name: 'Kuldeep Yadav', shortName: 'K. Yadav', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, dismissal: null, isStriker: false },
    ];

    // Bowlers for Australia
    const allBowlers: Bowler[] = [
      { id: 'bw1', name: 'Mitchell Starc', shortName: 'M. Starc', overs: '3.0', legalBalls: 18, maidens: 0, runs: 28, wickets: 1, economy: 9.33 },
      { id: 'bw2', name: 'Josh Hazlewood', shortName: 'J. Hazlewood', overs: '3.0', legalBalls: 18, maidens: 0, runs: 25, wickets: 1, economy: 8.33 },
      { id: 'bw3', name: 'Pat Cummins (c)', shortName: 'P. Cummins', overs: '3.0', legalBalls: 18, maidens: 0, runs: 30, wickets: 0, economy: 10.00 },
      { id: 'bw4', name: 'Adam Zampa', shortName: 'A. Zampa', overs: '4.0', legalBalls: 24, maidens: 0, runs: 32, wickets: 1, economy: 8.00 },
      { id: 'bw5', name: 'Glenn Maxwell', shortName: 'G. Maxwell', overs: '2.0', legalBalls: 12, maidens: 0, runs: 21, wickets: 0, economy: 10.50 },
    ];

    // Initial 2nd innings overs played (Overs 1-15, starting at 15.1)
    const secondInningsOvers: OverSummary[] = [
      { overNumber: 1, displayOver: 'Over 1', runsInOver: 10, cumulativeRuns: 10, cumulativeWickets: 0, wicketsInOver: 0, balls: ['1', '4', '0', '1', '4', '0'] },
      { overNumber: 2, displayOver: 'Over 2', runsInOver: 12, cumulativeRuns: 22, cumulativeWickets: 0, wicketsInOver: 0, balls: ['6', '1', '1', '4', '0', '0'] },
      { overNumber: 3, displayOver: 'Over 3', runsInOver: 8, cumulativeRuns: 30, cumulativeWickets: 0, wicketsInOver: 0, balls: ['1', '2', '1', '1', '2', '1'] },
      { overNumber: 4, displayOver: 'Over 4', runsInOver: 15, cumulativeRuns: 45, cumulativeWickets: 1, wicketsInOver: 1, balls: ['4', '6', 'W', '1', '4', '0'] },
      { overNumber: 5, displayOver: 'Over 5', runsInOver: 9, cumulativeRuns: 54, cumulativeWickets: 1, wicketsInOver: 0, balls: ['1', '1', '4', '1', '1', '1'] },
      { overNumber: 6, displayOver: 'Over 6', runsInOver: 11, cumulativeRuns: 65, cumulativeWickets: 1, wicketsInOver: 0, balls: ['4', '0', '1', '2', '4', '0'] },
      { overNumber: 7, displayOver: 'Over 7', runsInOver: 7, cumulativeRuns: 72, cumulativeWickets: 2, wicketsInOver: 1, balls: ['1', 'W', '1', '1', '2', '2'] },
      { overNumber: 8, displayOver: 'Over 8', runsInOver: 9, cumulativeRuns: 81, cumulativeWickets: 2, wicketsInOver: 0, balls: ['1', '2', '1', '4', '0', '1'] },
      { overNumber: 9, displayOver: 'Over 9', runsInOver: 10, cumulativeRuns: 91, cumulativeWickets: 2, wicketsInOver: 0, balls: ['1', '1', '4', '1', '1', '2'] },
      { overNumber: 10, displayOver: 'Over 10', runsInOver: 8, cumulativeRuns: 99, cumulativeWickets: 2, wicketsInOver: 0, balls: ['1', '2', '1', '1', '2', '1'] },
      { overNumber: 11, displayOver: 'Over 11', runsInOver: 13, cumulativeRuns: 112, cumulativeWickets: 3, wicketsInOver: 1, balls: ['6', 'W', '1', '4', '1', '1'] },
      { overNumber: 12, displayOver: 'Over 12', runsInOver: 9, cumulativeRuns: 121, cumulativeWickets: 3, wicketsInOver: 0, balls: ['1', '4', '1', '1', '1', '1'] },
      { overNumber: 13, displayOver: 'Over 13', runsInOver: 11, cumulativeRuns: 132, cumulativeWickets: 3, wicketsInOver: 0, balls: ['4', '1', '1', '1', '4', '0'] },
      { overNumber: 14, displayOver: 'Over 14', runsInOver: 10, cumulativeRuns: 142, cumulativeWickets: 3, wicketsInOver: 0, balls: ['2', '1', '4', '1', '1', '1'] },
      { overNumber: 15, displayOver: 'Over 15', runsInOver: 12, cumulativeRuns: 154, cumulativeWickets: 3, wicketsInOver: 0, balls: ['1', '6', '1', '2', '1', '1'] },
    ];

    // Recent commentary history (from over 15)
    const initialRecentBalls: DeliveryOutcome[] = [
      {
        id: 'ball-15-6',
        overIndex: 14,
        ballInOver: 6,
        displayBall: '15.0',
        bowlerName: 'Adam Zampa',
        batsmanName: 'Suryakumar Yadav',
        nonStrikerName: 'Rishabh Pant',
        runs: 1,
        extraRuns: 0,
        isWicket: false,
        isBoundary: false,
        isFour: false,
        isSix: false,
        commentary: 'Tapped gently towards mid-on for a quick single to retain strike.',
        scoreAfterBall: '154/3',
        winProbabilityAfter: { battingTeam: 68, bowlingTeam: 32 },
        timestamp: Date.now() - 3000,
      },
      {
        id: 'ball-15-5',
        overIndex: 14,
        ballInOver: 5,
        displayBall: '14.5',
        bowlerName: 'Adam Zampa',
        batsmanName: 'Rishabh Pant',
        nonStrikerName: 'Suryakumar Yadav',
        runs: 1,
        extraRuns: 0,
        isWicket: false,
        isBoundary: false,
        isFour: false,
        isSix: false,
        commentary: 'Pushed down the ground to long-off for an easy run.',
        scoreAfterBall: '153/3',
        winProbabilityAfter: { battingTeam: 66, bowlingTeam: 34 },
        timestamp: Date.now() - 6000,
      },
      {
        id: 'ball-15-4',
        overIndex: 14,
        ballInOver: 4,
        displayBall: '14.4',
        bowlerName: 'Adam Zampa',
        batsmanName: 'Rishabh Pant',
        nonStrikerName: 'Suryakumar Yadav',
        runs: 2,
        extraRuns: 0,
        isWicket: false,
        isBoundary: false,
        isFour: false,
        isSix: false,
        commentary: 'Worked past midwicket with soft hands, brisk hustle back for two.',
        scoreAfterBall: '152/3',
        winProbabilityAfter: { battingTeam: 66, bowlingTeam: 34 },
        timestamp: Date.now() - 9000,
      },
      {
        id: 'ball-15-3',
        overIndex: 14,
        ballInOver: 3,
        displayBall: '14.3',
        bowlerName: 'Adam Zampa',
        batsmanName: 'Suryakumar Yadav',
        nonStrikerName: 'Rishabh Pant',
        runs: 1,
        extraRuns: 0,
        isWicket: false,
        isBoundary: false,
        isFour: false,
        isSix: false,
        commentary: 'Driven firmly along the ground to deep cover for a single.',
        scoreAfterBall: '150/3',
        winProbabilityAfter: { battingTeam: 64, bowlingTeam: 36 },
        timestamp: Date.now() - 12000,
      },
      {
        id: 'ball-15-2',
        overIndex: 14,
        ballInOver: 2,
        displayBall: '14.2',
        bowlerName: 'Adam Zampa',
        batsmanName: 'Suryakumar Yadav',
        nonStrikerName: 'Rishabh Pant',
        runs: 6,
        extraRuns: 0,
        isWicket: false,
        isBoundary: true,
        isFour: false,
        isSix: true,
        commentary: 'DISPATCHED! High, handsome and into the second tier! Suryakumar Yadav with an extraordinary scoop over fine leg for SIX!',
        scoreAfterBall: '149/3',
        winProbabilityAfter: { battingTeam: 64, bowlingTeam: 36 },
        timestamp: Date.now() - 15000,
      },
      {
        id: 'ball-15-1',
        overIndex: 14,
        ballInOver: 1,
        displayBall: '14.1',
        bowlerName: 'Adam Zampa',
        batsmanName: 'Suryakumar Yadav',
        nonStrikerName: 'Rishabh Pant',
        runs: 1,
        extraRuns: 0,
        isWicket: false,
        isBoundary: false,
        isFour: false,
        isSix: false,
        commentary: 'Pushed into the gap at cover for a single to get the over started.',
        scoreAfterBall: '143/3',
        winProbabilityAfter: { battingTeam: 58, bowlingTeam: 42 },
        timestamp: Date.now() - 18000,
      },
    ];

    const currentRuns = 154;
    const currentWickets = 3;
    const legalBalls = 90; // 15 overs completed
    const ballsRemaining = 30; // 5 overs remaining (need 31 runs off 30 balls)
    const requiredRuns = target - currentRuns; // 31
    const crr = parseFloat(((currentRuns / legalBalls) * 6).toFixed(2)); // 10.27
    const rrr = parseFloat(((requiredRuns / ballsRemaining) * 6).toFixed(2)); // 6.20

    const winProb = calculateWinProbability({
      target,
      runs: currentRuns,
      wickets: currentWickets,
      legalBalls,
    });

    const activeStriker = allBatsmen.find((b) => b.isStriker) || allBatsmen[3];
    const activeNonStriker = allBatsmen.find((b) => !b.isOut && !b.isStriker) || allBatsmen[4];
    const currentBowler = allBowlers[0]; // Mitchell Starc to bowl over 16

    this.state = {
      id: 'match-ind-aus-t20-final-2026',
      title: 'IND vs AUS - ICC T20 World Cup Final',
      series: 'ICC Men\'s T20 World Cup Final',
      venue: 'Narendra Modi Stadium, Ahmedabad',
      matchType: 'T20',
      status: 'live',
      statusNote: 'India need 31 runs in 30 balls to win the World Cup',
      battingTeam,
      bowlingTeam,
      innings: 2,
      target,
      runs: currentRuns,
      wickets: currentWickets,
      overs: '15.0',
      completedOvers: 15,
      ballsInCurrentOver: 0,
      totalLegalBalls: legalBalls,
      maxOvers: 20,
      crr,
      rrr,
      requiredRuns,
      ballsRemaining,
      projectedScore: calculateProjectedScore(currentRuns, legalBalls),
      winProbability: winProb,
      striker: activeStriker,
      nonStriker: activeNonStriker,
      currentBowler,
      batsmen: allBatsmen,
      bowlers: allBowlers,
      recentBalls: initialRecentBalls,
      overSummaries: secondInningsOvers,
      firstInningsData: {
        team: bowlingTeam,
        runs: 184,
        wickets: 5,
        overs: '20.0',
        overSummaries: firstInningsOvers,
      },
      isSimulating: false,
      speedMs: this.speedMs,
    };
  }

  public simulateNextBall(): MatchState {
    if (this.state.status === 'completed') {
      this.stop();
      return this.state;
    }

    const { target, maxOvers } = this.state;
    const maxBalls = maxOvers * 6;

    // Check if match is already done
    if (target !== null && this.state.runs >= target) {
      this.finishMatch('India won by ' + (10 - this.state.wickets) + ' wickets');
      return this.state;
    }

    if (this.state.totalLegalBalls >= maxBalls || this.state.wickets >= 10) {
      if (target !== null) {
        if (this.state.runs === target - 1) {
          this.finishMatch('Match Tied! Super Over pending.');
        } else {
          this.finishMatch(`Australia won by ${target - 1 - this.state.runs} runs`);
        }
      }
      return this.state;
    }

    // Determine random outcome for this ball
    // Realistic T20 distribution weights
    const outcome = this.generateBallOutcome();

    let runsScored = outcome.runs;
    let extraRuns = outcome.extraRuns;
    let isLegalBall = outcome.extraType !== 'wide' && outcome.extraType !== 'no-ball';
    let isWicket = outcome.isWicket;
    let wicketType = outcome.wicketType;

    // Update match score
    const totalRunsOnBall = runsScored + extraRuns;
    this.state.runs += totalRunsOnBall;

    if (isLegalBall) {
      this.state.totalLegalBalls += 1;
      this.state.ballsInCurrentOver += 1;
    }

    // Calculate over string (e.g. 15.1, 15.2 ... 15.6)
    const currentCompletedOvers = Math.floor(this.state.totalLegalBalls / 6);
    const ballInThisOver = this.state.totalLegalBalls % 6;
    const displayOver = `${currentCompletedOvers}.${ballInThisOver}`;
    this.state.overs = displayOver;
    this.state.completedOvers = currentCompletedOvers;

    // Update bowler stats
    const bowler = this.state.currentBowler;
    bowler.runs += totalRunsOnBall;
    if (isLegalBall) {
      bowler.legalBalls += 1;
      const bOvers = Math.floor(bowler.legalBalls / 6);
      const bBalls = bowler.legalBalls % 6;
      bowler.overs = `${bOvers}.${bBalls}`;
      bowler.economy = parseFloat(((bowler.runs / bowler.legalBalls) * 6).toFixed(2));
    }
    if (isWicket && wicketType !== 'run-out') {
      bowler.wickets += 1;
    }

    // Update batsman stats
    const striker = this.state.striker;
    if (outcome.extraType !== 'wide') {
      striker.balls += 1;
    }
    striker.runs += runsScored;
    if (outcome.isFour) striker.fours += 1;
    if (outcome.isSix) striker.sixes += 1;
    striker.strikeRate = striker.balls > 0 ? parseFloat(((striker.runs / striker.balls) * 100).toFixed(1)) : 0;

    let outBatsmanName: string | undefined;

    // Handle wicket
    if (isWicket) {
      this.state.wickets += 1;
      striker.isOut = true;
      striker.dismissal = `${wicketType || 'caught'} b ${bowler.shortName}`;
      outBatsmanName = striker.name;

      // Bring in next batsman
      const nextBatsman = this.state.batsmen.find((b) => !b.isOut && b.id !== this.state.nonStriker.id && b.id !== striker.id);
      if (nextBatsman) {
        nextBatsman.isStriker = true;
        striker.isStriker = false;
        this.state.striker = nextBatsman;
      }
      this.broadcast('WICKET_FALL', {
        batsman: striker,
        score: `${this.state.runs}/${this.state.wickets}`,
        overs: displayOver,
      });
    }

    // Update CRR, RRR, Balls remaining
    this.state.ballsRemaining = Math.max(0, maxBalls - this.state.totalLegalBalls);
    if (target !== null) {
      this.state.requiredRuns = Math.max(0, target - this.state.runs);
      this.state.rrr = this.state.ballsRemaining > 0 
        ? parseFloat(((this.state.requiredRuns / this.state.ballsRemaining) * 6).toFixed(2)) 
        : 0;
    }
    this.state.crr = this.state.totalLegalBalls > 0 
      ? parseFloat(((this.state.runs / this.state.totalLegalBalls) * 6).toFixed(2)) 
      : 8.0;
    this.state.projectedScore = calculateProjectedScore(this.state.runs, this.state.totalLegalBalls);

    // Calculate Win Probability
    this.state.winProbability = calculateWinProbability({
      target,
      runs: this.state.runs,
      wickets: this.state.wickets,
      legalBalls: this.state.totalLegalBalls,
    });

    // Generate dynamic commentary
    const commentary = generateCommentary({
      bowlerName: bowler.name,
      batsmanName: striker.name,
      runs: runsScored,
      isWicket,
      wicketType,
      extraRuns,
      extraType: outcome.extraType,
    });

    const ballOutcome: DeliveryOutcome = {
      id: `ball-${this.state.totalLegalBalls}-${Date.now()}`,
      overIndex: currentCompletedOvers,
      ballInOver: ballInThisOver === 0 ? 6 : ballInThisOver,
      displayBall: displayOver,
      bowlerName: bowler.name,
      batsmanName: striker.name,
      nonStrikerName: this.state.nonStriker.name,
      runs: runsScored,
      extraRuns,
      extraType: outcome.extraType,
      isWicket,
      wicketType,
      outBatsman: outBatsmanName,
      isBoundary: outcome.isFour || outcome.isSix,
      isFour: outcome.isFour,
      isSix: outcome.isSix,
      commentary,
      scoreAfterBall: `${this.state.runs}/${this.state.wickets}`,
      winProbabilityAfter: { ...this.state.winProbability },
      timestamp: Date.now(),
    };

    // Prepend to recent deliveries (keep last 35)
    this.state.recentBalls = [ballOutcome, ...this.state.recentBalls.slice(0, 34)];

    // Update or append over summary
    this.recordOverBall(ballOutcome, currentCompletedOvers, ballInThisOver, isLegalBall);

    // Check strike rotation (odd runs swap striker)
    if (!isWicket && (runsScored === 1 || runsScored === 3)) {
      this.swapStrike();
    }

    // Check if over completed
    if (isLegalBall && ballInThisOver === 0) {
      this.handleOverEnd(currentCompletedOvers);
    }

    // Check if match won
    if (target !== null && this.state.runs >= target) {
      this.finishMatch(`India won by ${10 - this.state.wickets} wickets! 🏆`);
    } else if (this.state.totalLegalBalls >= maxBalls || this.state.wickets >= 10) {
      if (target !== null) {
        if (this.state.runs === target - 1) {
          this.finishMatch('Match Tied! Super Over pending.');
        } else {
          this.finishMatch(`Australia won by ${target - 1 - this.state.runs} runs!`);
        }
      }
    } else {
      this.state.statusNote = target 
        ? `India need ${this.state.requiredRuns} runs in ${this.state.ballsRemaining} balls`
        : `Current Run Rate: ${this.state.crr}`;
    }

    // Broadcast update
    this.broadcast('BALL_UPDATE', {
      ball: ballOutcome,
      match: this.getState(),
    });

    return this.state;
  }

  private generateBallOutcome(): {
    runs: number;
    extraRuns: number;
    extraType?: ExtraType;
    isWicket: boolean;
    wicketType?: WicketType;
    isFour: boolean;
    isSix: boolean;
  } {
    const rand = Math.random();

    // 2.5% chance of Extra (Wide / No-ball)
    if (rand < 0.02) {
      return { runs: 0, extraRuns: 1, extraType: 'wide', isWicket: false, isFour: false, isSix: false };
    }
    if (rand < 0.035) {
      return { runs: 1, extraRuns: 1, extraType: 'no-ball', isWicket: false, isFour: false, isSix: false };
    }

    // 4.5% chance of Wicket
    if (rand < 0.08) {
      const wicketTypes: WicketType[] = ['caught', 'bowled', 'lbw', 'caught', 'run-out'];
      const wicketType = wicketTypes[Math.floor(Math.random() * wicketTypes.length)];
      return { runs: 0, extraRuns: 0, isWicket: true, wicketType, isFour: false, isSix: false };
    }

    // 7% chance of 6
    if (rand < 0.15) {
      return { runs: 6, extraRuns: 0, isWicket: false, isFour: false, isSix: true };
    }

    // 13% chance of 4
    if (rand < 0.28) {
      return { runs: 4, extraRuns: 0, isWicket: false, isFour: true, isSix: false };
    }

    // 9% chance of 2 runs
    if (rand < 0.37) {
      return { runs: 2, extraRuns: 0, isWicket: false, isFour: false, isSix: false };
    }

    // 1% chance of 3 runs
    if (rand < 0.38) {
      return { runs: 3, extraRuns: 0, isWicket: false, isFour: false, isSix: false };
    }

    // 34% chance of 1 run
    if (rand < 0.72) {
      return { runs: 1, extraRuns: 0, isWicket: false, isFour: false, isSix: false };
    }

    // 28% Dot ball
    return { runs: 0, extraRuns: 0, isWicket: false, isFour: false, isSix: false };
  }

  private swapStrike() {
    const temp = this.state.striker;
    this.state.striker = this.state.nonStriker;
    this.state.nonStriker = temp;
    this.state.striker.isStriker = true;
    this.state.nonStriker.isStriker = false;
  }

  private recordOverBall(
    ball: DeliveryOutcome,
    completedOvers: number,
    ballInOver: number,
    isLegal: boolean
  ) {
    const targetOverNum = ballInOver === 0 ? completedOvers : completedOvers + 1;
    let over = this.state.overSummaries.find((o) => o.overNumber === targetOverNum);

    let ballSymbol = '•';
    if (ball.isWicket) ballSymbol = 'W';
    else if (ball.isSix) ballSymbol = '6';
    else if (ball.isFour) ballSymbol = '4';
    else if (ball.extraType === 'wide') ballSymbol = 'Wd';
    else if (ball.extraType === 'no-ball') ballSymbol = 'Nb';
    else if (ball.runs > 0) ballSymbol = String(ball.runs);

    if (!over) {
      over = {
        overNumber: targetOverNum,
        displayOver: `Over ${targetOverNum}`,
        runsInOver: ball.runs + ball.extraRuns,
        cumulativeRuns: this.state.runs,
        cumulativeWickets: this.state.wickets,
        wicketsInOver: ball.isWicket ? 1 : 0,
        balls: [ballSymbol],
      };
      this.state.overSummaries.push(over);
    } else {
      over.runsInOver += ball.runs + ball.extraRuns;
      over.cumulativeRuns = this.state.runs;
      over.cumulativeWickets = this.state.wickets;
      if (ball.isWicket) over.wicketsInOver += 1;
      over.balls.push(ballSymbol);
    }
  }

  private handleOverEnd(completedOvers: number) {
    this.state.ballsInCurrentOver = 0;
    // End of over: swap strike
    this.swapStrike();

    // Rotate bowler (pick next bowler who hasn't bowled max 4 overs and isn't current)
    const availableBowlers = this.state.bowlers.filter(
      (b) => b.id !== this.state.currentBowler.id && b.legalBalls < 24
    );
    if (availableBowlers.length > 0) {
      // Pick bowler with fewest legal balls or next in line
      availableBowlers.sort((a, b) => a.legalBalls - b.legalBalls);
      this.state.currentBowler = availableBowlers[0];
    }

    const overSummary = this.state.overSummaries.find((o) => o.overNumber === completedOvers);
    this.broadcast('OVER_COMPLETED', {
      overNumber: completedOvers,
      overSummary,
      match: this.getState(),
    });
  }

  private finishMatch(winnerNote: string) {
    this.stop();
    this.state.status = 'completed';
    this.state.statusNote = winnerNote;
    this.state.winner = winnerNote;
    this.broadcast('MATCH_COMPLETED', {
      winner: winnerNote,
      match: this.getState(),
    });
  }
}
