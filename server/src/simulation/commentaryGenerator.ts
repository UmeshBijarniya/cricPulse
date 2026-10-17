import { ExtraType, WicketType } from '../types.js';

const FOUR_COMMENTARIES = [
  "Crunched through the covers! Finds the gap with surgical precision and it races to the fence.",
  "Delicate late cut! Plays it extremely late past short third man, no stopping that.",
  "Short and punished! Rocks onto the back foot and pulls it ferociously past midwicket for FOUR!",
  "Pure elegance! Leans into the half-volley and creams the drive straight through extra cover.",
  "Drifting onto the pads, effortlessly flicked past midwicket. Classy boundary!",
  "Full and wide, slapped over backward point with ferocious hand speed for four!",
  "Steered fine into the vacant third man region, races away like a tracer bullet!",
];

const SIX_COMMENTARIES = [
  "DISPATCHED! High, handsome and into the second tier! What a colossal maximum!",
  "Down the track and launched straight back over the bowler's head! Pure brute power!",
  "Swivels into the pull shot and sends it soaring 95 meters over deep square leg!",
  "Picked the slower ball in a flash and deposits it onto the roof over midwicket!",
  "Stand and deliver! Clears the front leg and smokes it straight over long-on for SIX!",
  "Slog sweep executed to perfection! The ball sails deep into the stadium stands!",
];

const WICKET_COMMENTARIES = {
  bowled: [
    "CLEAN BOWLED! What a searing yorker! Speared right into the base of leg stump, woodwork everywhere!",
    "BOWLED HIM! Deceived by the dipping slower ball, through the gate and knocks the off-bail off!",
    "TIMBER! Inside edge onto the stumps! The batter is distraught as the middle stump goes cartwheeling!",
  ],
  caught: [
    "OUT! In the air and taken at long-on! Couldn't get the elevation and holes out directly to the fielder!",
    "OUT! Edged and taken! Feathered behind to the keeper who takes a sharp, tumbling catch!",
    "CAUGHT! Sliced high towards deep backward point, fielder sprints round and takes a sensational diving catch!",
  ],
  lbw: [
    "OUT! Plumb in front! Trapped on the crease by a skiddy nip-backer, finger goes up immediately! LBW!",
    "APPEAL AND GIVEN! Struck right in front of middle and leg. No doubt about that one!",
  ],
  'run-out': [
    "RUN OUT! Direct hit at the striker's end! Desperate dive but the batter is caught well short of the crease!",
    "CHAOS IN THE MIDDLE! Mix-up between the batsmen, fielder throws to the bowler who whips off the bails!",
  ],
  stumped: [
    "STUMPED! Beaten by the flight, dragged out of the crease, and lightning hands from the keeper do the rest!",
  ],
};

const DOT_COMMENTARIES = [
  "Beaten all ends up! Seams away sharply and beats the outside edge by a coat of varnish.",
  "Pitched on a good length, defended solidly with a straight bat right back to the bowler.",
  "Sharp snorting bouncer! Zips past the helmet grille, well ducked by the batsman.",
  "Drives hard on the up, but finds the fielder stationed at cover. No run.",
  "Slower off-cutter gripping the surface, taps it gently towards backward point.",
  "Right on the money! Full, tight on middle stump, squeezed out to mid-on.",
];

const SINGLE_COMMENTARIES = [
  "Pushed gently towards mid-off and they scamper through for a quick single.",
  "Worked off the pads towards deep backward square leg to rotate the strike.",
  "Tapped with soft hands towards cover-point and calls for a sharp single.",
  "Driven firmly along the carpet to long-on for an easy run.",
  "Steered down to third man, comfortable single taken.",
];

const DOUBLE_COMMENTARIES = [
  "Driven into the gap at deep extra cover, loud call for two and they complete it with ease.",
  "Clipped neatly towards deep midwicket, great hustling between the wickets to turn one into two.",
  "Soft hands into the pocket at fine leg, aggressive running gets them two runs safely.",
];

const THREE_COMMENTARIES = [
  "Superb timing through the deep cover gap! Fielder gives chase, slides to reel it in, and they hustle back for THREE!",
  "Drilled into the wide mid-on pocket, long boundary allows them to take three sharp runs.",
];

export function generateCommentary(params: {
  bowlerName: string;
  batsmanName: string;
  runs: number;
  isWicket: boolean;
  wicketType?: WicketType;
  extraRuns: number;
  extraType?: ExtraType;
}): string {
  const { bowlerName, batsmanName, runs, isWicket, wicketType, extraRuns, extraType } = params;

  if (extraType === 'wide') {
    return `${bowlerName} strays down the leg side, signaled WIDE by the umpire. Bonus run added.`;
  }
  if (extraType === 'no-ball') {
    return `NO BALL! ${bowlerName} oversteps the popping crease. Free Hit coming up for ${batsmanName}!`;
  }

  if (isWicket) {
    const type = wicketType || 'caught';
    const list = WICKET_COMMENTARIES[type] || WICKET_COMMENTARIES.caught;
    const item = list[Math.floor(Math.random() * list.length)];
    return `${item} (${batsmanName} departs!)`;
  }

  if (runs === 6) {
    const item = SIX_COMMENTARIES[Math.floor(Math.random() * SIX_COMMENTARIES.length)];
    return `${item} ${batsmanName} with an absolute stunner!`;
  }

  if (runs === 4) {
    const item = FOUR_COMMENTARIES[Math.floor(Math.random() * FOUR_COMMENTARIES.length)];
    return `${item} ${batsmanName} finds the rope effortlessly.`;
  }

  if (runs === 3) {
    return THREE_COMMENTARIES[Math.floor(Math.random() * THREE_COMMENTARIES.length)];
  }

  if (runs === 2) {
    return DOUBLE_COMMENTARIES[Math.floor(Math.random() * DOUBLE_COMMENTARIES.length)];
  }

  if (runs === 1) {
    return SINGLE_COMMENTARIES[Math.floor(Math.random() * SINGLE_COMMENTARIES.length)];
  }

  return DOT_COMMENTARIES[Math.floor(Math.random() * DOT_COMMENTARIES.length)];
}
