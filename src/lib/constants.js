export const Stats = {
  HP_P: 'HP%',
  ATK_P: 'ATK%',
  DEF_P: 'DEF%',
  SPD_P: 'SPD%',
  HP: 'HP',
  ATK: 'ATK',
  DEF: 'DEF',
  SPD: 'SPD',
  CD: 'CRIT DMG',
  CR: 'CRIT Rate',
  EHR: 'Effect Hit Rate',
  RES: 'Effect RES',
  BE: 'Break Effect',
  ERR: 'Energy Regeneration Rate',
  OHB: 'Outgoing Healing Boost',
  Physical_DMG: 'Physical DMG Boost',
  Fire_DMG: 'Fire DMG Boost',
  Ice_DMG: 'Ice DMG Boost',
  Lightning_DMG: 'Lightning DMG Boost',
  Wind_DMG: 'Wind DMG Boost',
  Quantum_DMG: 'Quantum DMG Boost',
  Imaginary_DMG: 'Imaginary DMG Boost'
}

export const StatsToReadable = {
  [Stats.HP_P]: 'HP %',
  [Stats.ATK_P]: 'ATK %',
  [Stats.DEF_P]: 'DEF %',
  [Stats.SPD_P]: 'SPD %',
  [Stats.HP]: 'HP',
  [Stats.ATK]: 'ATK',
  [Stats.DEF]: 'DEF',
  [Stats.SPD]: 'SPD',
  [Stats.CD]: 'CRIT DMG',
  [Stats.CR]: 'CRIT Rate',
  [Stats.EHR]: 'Effect Hit Rate',
  [Stats.RES]: 'Effect RES',
  [Stats.BE]: 'Break Effect',
  [Stats.ERR]: 'Energy Regen',
  [Stats.OHB]: 'Healing Boost',
  [Stats.Physical_DMG]: 'Physical DMG',
  [Stats.Fire_DMG]: 'Fire DMG',
  [Stats.Ice_DMG]: 'Ice DMG',
  [Stats.Lightning_DMG]: 'Lightning DMG',
  [Stats.Wind_DMG]: 'Wind DMG',
  [Stats.Quantum_DMG]: 'Quantum DMG',
  [Stats.Imaginary_DMG]: 'Imaginary DMG'
}

export var StatsToIndex = {

}
let i = 0;
Object.values(Stats).map(x => StatsToIndex[x] = i++) 

export const Parts = {
  Head: 'Head',
  Hands: 'Hands',
  Body: 'Body',
  Feet: 'Feet',
  PlanarSphere: 'PlanarSphere',
  LinkRope: 'LinkRope'
};
export const PartsToReadable = {
  [Parts.Head]: 'Head',
  [Parts.Hands]: 'Hands',
  [Parts.Body]: 'Body',
  [Parts.Feet]: 'Feet',
  [Parts.PlanarSphere]: 'Planar Sphere',
  [Parts.LinkRope]: 'Link Rope'
};

export const Sets = {
  'BandOfSizzlingThunder': 'Band of Sizzling Thunder',
  'ChampionOfStreetwiseBoxing': 'Champion of Streetwise Boxing',
  'EagleOfTwilightLine': 'Eagle of Twilight Line',
  'FiresmithOfLavaForging': 'Firesmith Of Lava-Forging',
  'GeniusOfBrilliantStars': 'Genius of Brilliant Stars',
  'HunterOfGlacialForest': 'Hunter of Glacial Forest',
  'KnightOfPurityPalace': 'Knight of Purity Palace',
  'MessengerTraversingHackerspace': 'Messenger Traversing Hackerspace',
  'GuardOfWutheringSnow': 'Guard of Wuthering Snow',
  'LongevousDisciple': 'Longevous Disciple',
  'MusketeerOfWildWheat': 'Musketeer of Wild Wheat',
  'PasserbyOfWanderingCloud': 'Passerby of Wandering Cloud',
  'ThiefOfShootingMeteor': 'Thief of Shooting Meteor',
  'WastelanderOfBanditryDesert': 'Wastelander of Banditry Desert',

  'BelobogOfTheArchitects': 'Belobog of the Architects',
  'BrokenKeel': 'Broken Keel',
  'CelestialDifferentiator': 'Celestial Differentiator',
  'FleetOfTheAgeless': 'Fleet of the Ageless',
  'InertSalsotto': 'Inert Salsotto',
  'PanCosmicCommercialEnterprise': 'Pan-Cosmic Commercial Enterprise',
  'RutilantArena': 'Rutilant Arena',
  'SpaceSealingStation': 'Space Sealing Station',
  'SprightlyVonwacq': 'Sprightly Vonwacq',
  'TaliaKingdomOfBanditry': 'Talia: Kingdom of Banditry'
}

export const SetsRelics = {
  'BandOfSizzlingThunder': 'Band of Sizzling Thunder',
  'ChampionOfStreetwiseBoxing': 'Champion of Streetwise Boxing',
  'EagleOfTwilightLine': 'Eagle of Twilight Line',
  'FiresmithOfLavaForging': 'Firesmith Of Lava-Forging',
  'GeniusOfBrilliantStars': 'Genius of Brilliant Stars',
  'HunterOfGlacialForest': 'Hunter of Glacial Forest',
  'KnightOfPurityPalace': 'Knight of Purity Palace',
  'MessengerTraversingHackerspace': 'Messenger Traversing Hackerspace',
  'GuardOfWutheringSnow': 'Guard of Wuthering Snow',
  'LongevousDisciple': 'Longevous Disciple',
  'MusketeerOfWildWheat': 'Musketeer of Wild Wheat',
  'PasserbyOfWanderingCloud': 'Passerby of Wandering Cloud',
  'ThiefOfShootingMeteor': 'Thief of Shooting Meteor',
  'WastelanderOfBanditryDesert': 'Wastelander of Banditry Desert'
}

export const SetsOrnaments = {
  'BelobogOfTheArchitects': 'Belobog of the Architects',
  'BrokenKeel': 'Broken Keel',
  'CelestialDifferentiator': 'Celestial Differentiator',
  'FleetOfTheAgeless': 'Fleet of the Ageless',
  'InertSalsotto': 'Inert Salsotto',
  'PanCosmicCommercialEnterprise': 'Pan-Cosmic Commercial Enterprise',
  'RutilantArena': 'Rutilant Arena',
  'SpaceSealingStation': 'Space Sealing Station',
  'SprightlyVonwacq': 'Sprightly Vonwacq',
  'TaliaKingdomOfBanditry': 'Talia: Kingdom of Banditry'
}

export const SetsRelicsNames = Object.values(SetsRelics)
export const SetsOrnamentsNames = Object.values(SetsOrnaments)

const OrnamentSetToIndex = {}
for (let i = 0; i < SetsOrnamentsNames.length; i++) {
  OrnamentSetToIndex[SetsOrnamentsNames[i]] = i
}

const RelicSetToIndex = {}
for (let i = 0; i < SetsRelicsNames.length; i++) {
  RelicSetToIndex[SetsRelicsNames[i]] = i
}

// let StatMaxes = {
//   [Stats.HP_P]: 43.2,
//   [Stats.ATK_P]: 43.2,
//   [Stats.DEF_P]: 54,
//   [Stats.HP]: 705,
//   [Stats.ATK]: 352,
//   [Stats.CR]: 32.4,
//   [Stats.CD]: 64.8,
//   [Stats.OHB]: 34.5,
//   [Stats.EHR]: 43.2,
//   [Stats.SPD]: 25,
//   [Stats.BE]: 64.8,
//   [Stats.ERR]: 19.4,
//   [Stats.Physical_DMG]: 38.8,
//   [Stats.Fire_DMG]: 38.8,
//   [Stats.Ice_DMG]: 38.8,
//   [Stats.Lightning_DMG]: 38.8,
//   [Stats.Wind_DMG]: 38.8,
//   [Stats.Quantum_DMG]: 38.8,
//   [Stats.Imaginary_DMG]: 38.8,
// }

export const Constants = {
  Sets,
  Parts,
  Stats,
  StatsToIndex,
  SetsOrnaments,
  SetsRelics,
  SetsRelicsNames,
  SetsOrnamentsNames,
  StatsToReadable,
  PartsToReadable,
  RelicSetToIndex,
  OrnamentSetToIndex,
  // StatMaxes,
  MAX_INT: 2147483647,
}