import { useState, useEffect, useRef, useCallback } from "react";

const SKILL_DATA = {
  fire: [
    { id:"fire_dmg_01", name:"Fireball",       type:"damage",  rarity:"common",    target_count:"single", cooldown_base:8,  cooldown_scaling:-0.05, effects:[{trigger:"always",base_value:75,scaling_per_level:5,unit:"% ATK",hits:2},{trigger:"unlock_level_5",base_value:10,scaling_per_level:1,unit:"% chance",status:"burn",duration_fixed:3}] },
    { id:"fire_dmg_03", name:"Ember Burst",    type:"damage",  rarity:"common",    target_count:"aoe",    cooldown_base:10, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:120,scaling_per_level:4,unit:"% ATK"}] },
    { id:"fire_def_01", name:"Fire Shield",    type:"defense", rarity:"common",    target_count:"single", cooldown_base:8,  cooldown_scaling:-0.05, effects:[{trigger:"always",base_value:20,scaling_per_level:1,unit:"% reflect",duration_fixed:3,is_defense:true}] },
    { id:"fire_dmg_04", name:"Magma Shot",     type:"damage",  rarity:"rare",      target_count:"single", cooldown_base:8,  cooldown_scaling:-0.08, effects:[{trigger:"always",base_value:160,scaling_per_level:5,unit:"% ATK"},{trigger:"always",base_value:40,scaling_per_level:1,unit:"% chance",status:"burn",duration_fixed:4}] },
    { id:"fire_utl_01", name:"Flame Rage",     type:"utility", rarity:"rare",      target_count:"single", cooldown_base:12, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:30,scaling_per_level:1.5,unit:"% ATK boost",duration_fixed:6,is_buff:true}] },
    { id:"fire_dmg_05", name:"Inferno Strike", type:"damage",  rarity:"epic",      target_count:"aoe",    cooldown_base:13, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:250,scaling_per_level:8,unit:"% ATK"},{trigger:"always",base_value:50,scaling_per_level:2,unit:"% chance",status:"burn",duration_fixed:5}] },
    { id:"fire_dmg_06", name:"Meteor",         type:"damage",  rarity:"legendary", target_count:"aoe",    cooldown_base:18, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:300,scaling_per_level:10,unit:"% ATK"}] },
  ],
  water: [
    { id:"water_dmg_01", name:"Water Jet",      type:"damage",  rarity:"common",    target_count:"single", cooldown_base:7,  cooldown_scaling:-0.05, effects:[{trigger:"always",base_value:130,scaling_per_level:4,unit:"% ATK"},{trigger:"unlock_level_5",base_value:10,scaling_per_level:1,unit:"% chance",status:"wet",duration_fixed:4}] },
    { id:"water_dmg_02", name:"Tidal Slam",     type:"damage",  rarity:"common",    target_count:"aoe",    cooldown_base:10, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:120,scaling_per_level:4,unit:"% ATK"},{trigger:"unlock_level_5",base_value:10,scaling_per_level:1,unit:"% chance",status:"freeze",duration_fixed:1.5}] },
    { id:"water_def_01", name:"Aqua Shield",    type:"defense", rarity:"common",    target_count:"single", cooldown_base:9,  cooldown_scaling:-0.05, effects:[{trigger:"always",base_value:25,scaling_per_level:2,unit:"% max HP",duration_fixed:4,is_shield:true}] },
    { id:"water_dmg_03", name:"Hydro Cannon",   type:"damage",  rarity:"rare",      target_count:"single", cooldown_base:9,  cooldown_scaling:-0.08, effects:[{trigger:"always",base_value:180,scaling_per_level:6,unit:"% ATK"},{trigger:"always",base_value:35,scaling_per_level:2,unit:"% chance",status:"wet",duration_fixed:5}], push:true },
    { id:"water_def_02", name:"Glacial Wall",   type:"defense", rarity:"rare",      target_count:"aoe",    cooldown_base:11, cooldown_scaling:-0.08, effects:[{trigger:"always",base_value:0,scaling_per_level:0,unit:"wall",is_wall:true}], wall:true },
    { id:"water_dmg_04", name:"Ice Age",        type:"damage",  rarity:"epic",      target_count:"aoe",    cooldown_base:14, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:80,scaling_per_level:7,unit:"% ATK",hits:3},{trigger:"always",base_value:50,scaling_per_level:2,unit:"% chance",status:"freeze",duration_fixed:3}] },
    { id:"water_dmg_05", name:"Abyssal Tsunami",type:"damage",  rarity:"legendary", target_count:"aoe",    cooldown_base:20, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:150,scaling_per_level:8,unit:"% ATK"},{trigger:"always",base_value:60,scaling_per_level:3,unit:"% chance",status:"freeze",duration_fixed:3}], push:true },
  ],
  electric: [
    { id:"elec_dmg_01", name:"Lightning Bolt",  type:"damage",  rarity:"common",    target_count:"single", cooldown_base:7,  cooldown_scaling:-0.05, effects:[{trigger:"always",base_value:130,scaling_per_level:4,unit:"% ATK"},{trigger:"unlock_level_5",base_value:10,scaling_per_level:1,unit:"% chance",status:"paralyze",duration_fixed:1.5}] },
    { id:"elec_dmg_02", name:"Static Burst",    type:"damage",  rarity:"common",    target_count:"aoe",    cooldown_base:10, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:120,scaling_per_level:4,unit:"% ATK"},{trigger:"unlock_level_5",base_value:10,scaling_per_level:1,unit:"% chance",status:"shock",duration_fixed:3}] },
    { id:"elec_utl_01", name:"Volt Dash",       type:"utility", rarity:"common",    target_count:"single", cooldown_base:10, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:25,scaling_per_level:1.5,unit:"% ASPD",duration_fixed:5,is_buff:true}] },
    { id:"elec_dmg_03", name:"Thunder Strike",  type:"damage",  rarity:"rare",      target_count:"single", cooldown_base:9,  cooldown_scaling:-0.08, effects:[{trigger:"always",base_value:180,scaling_per_level:6,unit:"% ATK"},{trigger:"always",base_value:35,scaling_per_level:2,unit:"% chance",status:"paralyze",duration_fixed:1.5}] },
    { id:"elec_dmg_05", name:"Chain Lightning", type:"damage",  rarity:"epic",      target_count:"aoe",    cooldown_base:13, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:250,scaling_per_level:6,unit:"% ATK"},{trigger:"always",base_value:45,scaling_per_level:2,unit:"% chance",status:"shock",duration_fixed:3}] },
    { id:"elec_dmg_06", name:"God's Wrath",     type:"damage",  rarity:"legendary", target_count:"single", cooldown_base:18, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:350,scaling_per_level:10,unit:"% ATK"},{trigger:"always",base_value:70,scaling_per_level:3,unit:"% chance",status:"paralyze",duration_fixed:2}] },
  ],
  metal: [
    { id:"metal_dmg_01", name:"Iron Slash",     type:"damage",  rarity:"common",    target_count:"single", cooldown_base:7,  cooldown_scaling:-0.05, effects:[{trigger:"always",base_value:130,scaling_per_level:4,unit:"% ATK"},{trigger:"unlock_level_5",base_value:10,scaling_per_level:1,unit:"% chance",status:"bleed",duration_fixed:3}] },
    { id:"metal_def_01", name:"Iron Wall sk",   type:"defense", rarity:"common",    target_count:"single", cooldown_base:8,  cooldown_scaling:-0.05, effects:[{trigger:"always",base_value:25,scaling_per_level:2,unit:"% reduction",duration_fixed:4,is_defense:true}] },
    { id:"metal_dmg_02", name:"Blade Storm",    type:"damage",  rarity:"rare",      target_count:"aoe",    cooldown_base:10, cooldown_scaling:-0.08, effects:[{trigger:"always",base_value:180,scaling_per_level:6,unit:"% ATK"},{trigger:"always",base_value:35,scaling_per_level:2,unit:"% chance",status:"armor_break",duration_fixed:4}] },
    { id:"metal_dmg_03", name:"Magnetic Trap",  type:"damage",  rarity:"epic",      target_count:"aoe",    cooldown_base:14, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:70,scaling_per_level:3,unit:"% ATK",hits:4},{trigger:"always",base_value:60,scaling_per_level:2,unit:"% chance",status:"armor_break",duration_fixed:5}] },
    { id:"metal_dmg_04", name:"Iron Emperor",   type:"damage",  rarity:"legendary", target_count:"aoe",    cooldown_base:20, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:350,scaling_per_level:8,unit:"% ATK"},{trigger:"always",base_value:60,scaling_per_level:2,unit:"% chance",status:"bleed",duration_fixed:4}] },
  ],
  psychic: [
    { id:"psyc_dmg_01", name:"Mind Spike",     type:"damage",  rarity:"common",    target_count:"single", cooldown_base:7,  cooldown_scaling:-0.05, effects:[{trigger:"always",base_value:120,scaling_per_level:4,unit:"% ATK"},{trigger:"unlock_level_5",base_value:10,scaling_per_level:1,unit:"% chance",status:"confuse",duration_fixed:3}] },
    { id:"psyc_utl_01", name:"Distortion",     type:"utility", rarity:"common",    target_count:"single", cooldown_base:8,  cooldown_scaling:-0.05, effects:[{trigger:"always",base_value:-20,scaling_per_level:-1.5,unit:"% ATK reduction",duration_fixed:5,is_debuff:true}] },
    { id:"psyc_dmg_02", name:"Psionic Burst",  type:"damage",  rarity:"rare",      target_count:"aoe",    cooldown_base:10, cooldown_scaling:-0.08, effects:[{trigger:"always",base_value:180,scaling_per_level:6,unit:"% ATK"},{trigger:"always",base_value:35,scaling_per_level:2,unit:"% chance",status:"confuse",duration_fixed:4}] },
    { id:"psyc_def_02", name:"Echo Shield",    type:"defense", rarity:"rare",      target_count:"aoe",    cooldown_base:11, cooldown_scaling:-0.08, effects:[{trigger:"always",base_value:3,scaling_per_level:0.25,unit:"sec repel",is_repel:true}], repel:true },
    { id:"psyc_dmg_03", name:"Psychic Storm",  type:"damage",  rarity:"epic",      target_count:"aoe",    cooldown_base:13, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:80,scaling_per_level:5,unit:"% ATK",hits:3},{trigger:"always",base_value:50,scaling_per_level:2,unit:"% chance",status:"confuse",duration_fixed:4}] },
  ],
  light: [
    { id:"lght_dmg_01", name:"Holy Bolt",       type:"damage",  rarity:"common",    target_count:"single", cooldown_base:7,  cooldown_scaling:-0.05, effects:[{trigger:"always",base_value:120,scaling_per_level:4,unit:"% ATK"},{trigger:"unlock_level_5",base_value:10,scaling_per_level:1,unit:"% chance",status:"blind",duration_fixed:3}] },
    { id:"lght_utl_01", name:"Radiance",        type:"utility", rarity:"common",    target_count:"single", cooldown_base:9,  cooldown_scaling:-0.05, effects:[{trigger:"always",base_value:50,scaling_per_level:3,unit:"% ATK as HP",is_heal:true}] },
    { id:"lght_dmg_02", name:"Solar Flare",     type:"damage",  rarity:"rare",      target_count:"aoe",    cooldown_base:10, cooldown_scaling:-0.08, effects:[{trigger:"always",base_value:180,scaling_per_level:6,unit:"% ATK"},{trigger:"always",base_value:35,scaling_per_level:2,unit:"% chance",status:"blind",duration_fixed:4}] },
    { id:"lght_utl_02", name:"Blessing",        type:"utility", rarity:"rare",      target_count:"single", cooldown_base:12, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:100,scaling_per_level:5,unit:"% ATK as HP",is_heal:true}] },
    { id:"lght_dmg_03", name:"Divine Judgment", type:"damage",  rarity:"epic",      target_count:"aoe",    cooldown_base:13, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:70,scaling_per_level:4,unit:"% ATK",hits:4}] },
    { id:"lght_utl_03", name:"Divine Ascension",type:"utility", rarity:"legendary", target_count:"single", cooldown_base:20, cooldown_scaling:-0.1,  effects:[{trigger:"always",base_value:50,scaling_per_level:3,unit:"% Light Dmg",duration_fixed:8,is_buff:true}] },
  ],
};

const ELEMENT_CONFIG = {
  fire:     { icon:"🔥", color:"#ff6b35", glow:"#ff6b3540", light:"#ff9a6c", bg:"#3a1a0a" },
  water:    { icon:"🌊", color:"#4fc3f7", glow:"#4fc3f740", light:"#80d8ff", bg:"#0a1a2a" },
  electric: { icon:"⚡", color:"#ffd740", glow:"#ffd74040", light:"#ffee80", bg:"#1a1a0a" },
  metal:    { icon:"⛓️", color:"#b0bec5", glow:"#b0bec540", light:"#cfd8dc", bg:"#0f1215" },
  psychic:  { icon:"🧠", color:"#ce93d8", glow:"#ce93d840", light:"#e1bee7", bg:"#1a0a2a" },
  light:    { icon:"✨", color:"#fff176", glow:"#fff17640", light:"#fffde7", bg:"#1a1a00" },
};

const RARITY_CONFIG = {
  common:    { color:"#9e9e9e", affinity_gain:0.2 },
  rare:      { color:"#42a5f5", affinity_gain:0.3 },
  epic:      { color:"#ab47bc", affinity_gain:0.5 },
  legendary: { color:"#ffa726", affinity_gain:1.0 },
};

const STATUS_CFG = {
  burn:        { color:"#ff6b35", icon:"🔥", label:"BURN"    },
  wet:         { color:"#4fc3f7", icon:"💧", label:"WET"     },
  freeze:      { color:"#80deea", icon:"❄",  label:"FREEZE"  },
  shock:       { color:"#ffd740", icon:"⚡", label:"SHOCK"   },
  paralyze:    { color:"#ffee58", icon:"⚡", label:"PARA"    },
  bleed:       { color:"#ef5350", icon:"🩸", label:"BLEED"   },
  armor_break: { color:"#b0bec5", icon:"🛡", label:"A.BRK"   },
  confuse:     { color:"#ce93d8", icon:"😵", label:"CONFUSE" },
  blind:       { color:"#fff176", icon:"👁",  label:"BLIND"   },
};

const STAGES = [
  { stage:1, wave:1, enemies:[{hp:300,atk:22,def:10,element:"fire",   speed:25,name:"Ember Slug",   icon:"🔥"}] },
  { stage:1, wave:2, enemies:[{hp:280,atk:20,def:8, element:"fire",   speed:30,name:"Cinder Imp",   icon:"😈"},{hp:320,atk:25,def:12,element:"fire",speed:22,name:"Flame Bat",icon:"🦇"}] },
  { stage:1, wave:3, enemies:[{hp:700,atk:45,def:22,element:"fire",   speed:18,name:"Blaze Golem",  icon:"🗿"},{hp:250,atk:18,def:8,element:"fire",speed:32,name:"Ash Fairy",icon:"✨"}] },
  { stage:2, wave:1, enemies:[{hp:450,atk:30,def:14,element:"water",  speed:24,name:"Tide Sprite",  icon:"💧"}] },
  { stage:2, wave:2, enemies:[{hp:420,atk:28,def:16,element:"water",  speed:20,name:"Frost Crab",   icon:"🦀"},{hp:480,atk:32,def:14,element:"water",speed:26,name:"Aqua Slime",icon:"🫧"}] },
  { stage:2, wave:3, enemies:[{hp:1000,atk:60,def:35,element:"water", speed:16,name:"Tsunami Lord", icon:"🌊"}] },
  { stage:3, wave:1, enemies:[{hp:600,atk:45,def:20,element:"electric",speed:32,name:"Zap Fairy",   icon:"⚡"}] },
  { stage:3, wave:2, enemies:[{hp:650,atk:48,def:22,element:"electric",speed:28,name:"Volt Drake",  icon:"🐉"},{hp:580,atk:42,def:18,element:"electric",speed:34,name:"Spark Wolf",icon:"🐺"}] },
  { stage:3, wave:3, enemies:[{hp:1400,atk:90,def:50,element:"electric",speed:15,name:"Storm Titan",icon:"⛈"}] },
];

let _uid = 0;
const uid = () => ++_uid;

function calcCooldown(skill, level) {
  return Math.max(1, skill.cooldown_base + skill.cooldown_scaling * (level - 1));
}

function calcDmg(effect, level, atk) {
  const pct  = effect.base_value + effect.scaling_per_level * (level - 1);
  const hits = effect.hits || 1;
  return (atk * pct / 100) * hits;
}

function applyDef(raw, def) { return raw * (100 / (100 + def)); }
const ELEMENT_ADVANTAGE = {
  fire:["water"], water:["electric"], electric:["metal"],
  metal:["light"], light:["psychic"], psychic:["metal"],
};
function elementMod(attackerEl, defenderEl) {
  if (ELEMENT_ADVANTAGE[attackerEl]?.includes(defenderEl)) return 1.2;
  if (ELEMENT_ADVANTAGE[defenderEl]?.includes(attackerEl)) return 0.8;
  return 1.0;
}
// ─── EXP & LEVEL SYSTEM ─────────────────────────────────────────────────
// EXP required per level: 100 + floor(level/10) × 10
// Lv1→2: 100, Lv11→12: 110, Lv21→22: 120, etc.
function expRequired(level) {
  return 100 + Math.floor(level / 10) * 10;
}

// EXP gain per kill: Region(1) × Stage × BaseEXP
// Stage = current stage number (1-based), boss = 100 base, normal = 25 base
// Pack multiplier: multiply by enemy count in wave
function calcExpGain(stageNum, isBoss, enemyCount) {
  const regionMult = 1.0; // Region 1 hardcoded for now, formula: 0.5 + (N-1)*0.5
  const base = isBoss ? 100 : 25;
  return Math.round(regionMult * stageNum * base * enemyCount);
}

// Gold per wave WIN: Region × Stage × BaseGold
function calcGoldGain(stageNum, isBoss, enemyCount) {
  const regionMult = 1.0;
  const base = 10; // R1 base
  const bossMult = isBoss ? 2 : 1;
  return Math.round(regionMult * stageNum * base * enemyCount * bossMult);
}

// ─── STAT SYSTEM ────────────────────────────────────────────────────────
// 4 stat points per level, player-allocated
// ATK:+2/pt | DEF:+1/pt | HP:+10/pt | ASPD:+0.002/pt | CritR:+0.01/pt | CritD:+0.25%/pt
const STAT_PER_POINT = {
  atk:   2,
  def:   1,
  hp:    10,
  aspd:  0.002,
  critR: 0.01,
  critD: 0.25,
};

const BASE_STATS = {
  atk:   50,
  def:   20,
  hp:    300,
  aspd:  1.0,
  critR: 5,   // %
  critD: 50,  // %
};

function calcStats(allocation) {
  return {
    atk:   BASE_STATS.atk   + (allocation.atk   || 0) * STAT_PER_POINT.atk,
    def:   BASE_STATS.def   + (allocation.def   || 0) * STAT_PER_POINT.def,
    hp:    BASE_STATS.hp    + (allocation.hp    || 0) * STAT_PER_POINT.hp,
    aspd:  Math.min(2.0, BASE_STATS.aspd  + (allocation.aspd  || 0) * STAT_PER_POINT.aspd),
    critR: Math.min(100,  BASE_STATS.critR + (allocation.critR || 0) * STAT_PER_POINT.critR),
    critD: BASE_STATS.critD + (allocation.critD || 0) * STAT_PER_POINT.critD,
  };
}

function rollStatus(effect, level) {
  if (!effect.status) return null;
  const unlock = effect.trigger === "unlock_level_5" ? 5 : 1;
  if (level < unlock) return null;
  const chance = (effect.base_value + effect.scaling_per_level * (level - 1)) / 100;
  return Math.random() < chance ? effect.status : null;
}

const allSkills = Object.values(SKILL_DATA).flat();
const getSkill  = (id) => allSkills.find(s => s.id === id);

export default function BattleScene() {
  const [cubeElement, setCubeElement] = useState("fire");
  const [skillSlots, setSkillSlots]   = useState([
    { skillId:"fire_dmg_04", level:5 },
    { skillId:"fire_def_01", level:3 },
    { skillId:"fire_utl_01", level:4 },
  ]);

  // ── Cube level & EXP state ───────────────────────────────────────────
  const [cubeLevel,    setCubeLevel]    = useState(1);
  const [cubeExp,      setCubeExp]      = useState(0);
  const [pendingPoints, setPendingPoints] = useState(0);
  const [allocation,   setAllocation]   = useState({ atk:0, def:0, hp:0, aspd:0, critR:0, critD:0 });
  const [lockedAlloc,  setLockedAlloc]  = useState({ atk:0, def:0, hp:0, aspd:0, critR:0, critD:0 });
  const [showStatAlloc, setShowStatAlloc] = useState(false);
  const [levelUpAnn,   setLevelUpAnn]   = useState("");
  const [elementAffinity, setElementAffinity] = useState({ fire:0, water:0, electric:0, metal:0, psychic:0, light:0 });
  
  const cubeStats   = calcStats(allocation);
  const cubeMaxHp   = cubeStats.hp;
  const cubeAtk     = cubeStats.atk;
  const cubeDef     = cubeStats.def;
  const cubeCritR   = cubeStats.critR;
  const cubeCritD   = cubeStats.critD;
  const totalPoints = cubeLevel * 4; // total earned
  const spentPoints = Object.values(allocation).reduce((a,b) => a+b, 0);

  // Level up handler
  const gainExp = useCallback((amount) => {
    setCubeExp(prev => {
      let exp     = prev + amount;
      let level   = cubeLevel;
      let newPts  = 0;
      // Loop in case multiple levels gained at once
      while (exp >= expRequired(level)) {
        exp    -= expRequired(level);
        level  += 1;
        newPts += 4;
      }
      if (newPts > 0) {
        setCubeLevel(level);
        setPendingPoints(p => p + newPts);
        setShowStatAlloc(true);
        setLevelUpAnn(`LV UP! → ${level}`);
        setTimeout(() => setLevelUpAnn(""), 2000);
      }
      return exp;
    });
  }, [cubeLevel]);

  // Allocate 1 point to a stat
  const allocate = (stat) => {
    if (pendingPoints <= 0) return;
    setAllocation(a => ({ ...a, [stat]: (a[stat] || 0) + 1 }));
    setPendingPoints(p => p - 1);
  };

  const [cubeHP,       setCubeHP]       = useState(cubeMaxHp);
  const [cubeDead,     setCubeDead]    = useState(false);
  const [enemies,      setEnemies]      = useState([]);
  const [walls,        setWalls]        = useState([]);
  const [floats,       setFloats]       = useState([]);
  const [cooldowns,    setCooldowns]    = useState([0, 0, 0]);
  const [stageIdx,     setStageIdx]     = useState(0);
  const [waveCleared,  setWaveCleared]  = useState(false);
  const [waveAnn,      setWaveAnn]      = useState("");
  const [speed,        setSpeed]        = useState(1);
  const [tab,          setTab]          = useState("stats");
  const [cubeState,    setCubeState]    = useState("idle");
  const [dmgDealt,     setDmgDealt]     = useState(0);
  const [kills,        setKills]        = useState(0);
  const [healed,       setHealed]       = useState(0);
  const [coins,        setCoins]        = useState(0);
  const [soundOn,      setSoundOn]      = useState(true);

  const elCfg      = ELEMENT_CONFIG[cubeElement];
  const hpPct      = cubeHP / cubeMaxHp;
  const hpColor    = hpPct > 0.6 ? "#4caf50" : hpPct > 0.3 ? "#ff9800" : "#ef5350";
  const curStage   = STAGES[stageIdx];

  const spawnFloat = useCallback((text, x, y, color, big = false) => {
    const id = uid();
    setFloats(p => [...p, { id, text, x, y, color, big }]);
    setTimeout(() => setFloats(p => p.filter(f => f.id !== id)), 1100);
  }, []);

  const spawnWave = useCallback((idx) => {
    const s = STAGES[idx % STAGES.length];
    const newEnemies = s.enemies.map((e, i) => ({
      ...e, id: uid(),
      currentHp: e.hp, maxHp: e.hp,
      x: 84 + i * 14,
      statuses: [], dead: false, attackTimer: 2.5 + i * 0.8,
    }));
    setEnemies(newEnemies);
    setWalls([]);
    setWaveCleared(false);
    const ann = `STAGE ${s.stage}  ·  WAVE ${s.wave}`;
    setWaveAnn(ann);
    setTimeout(() => setWaveAnn(""), 2000);
  }, []);

  useEffect(() => {
    setCubeHP(cubeMaxHp);
    spawnWave(0);
  }, []);

  // ── Main game loop ───────────────────────────────────────────────────
  useEffect(() => {
    const TICK = 100;
    const interval = setInterval(() => {
      if (cubeDead) return;
      const dt = (TICK / 1000) * speed;

      // Cooldown tick
      setCooldowns(prev => prev.map(cd => Math.max(0, cd - dt)));

      // Enemy tick
      setEnemies(prev => {
        if (!prev.length) return prev;
        let next = prev.map(e => {
          if (e.dead) return e;
          const frozen    = e.statuses.some(s => (s.type === "freeze" || s.type === "paralyze") && s.remaining > 0);
          const newSt     = e.statuses.map(s => ({...s, remaining: s.remaining - dt})).filter(s => s.remaining > 0);
          let dotDmg = 0;
          newSt.forEach(s => {
            if (["burn","bleed","shock"].includes(s.type)) dotDmg += e.maxHp * 0.025 * dt;
          });
          const newHp  = Math.max(0, e.currentHp - dotDmg);
          let   newX   = e.x;
          if (!frozen) newX = Math.max(20, e.x - e.speed * dt * 0.07);
          const newAt  = e.attackTimer - dt;
          let   atked  = false;
          if (newX <= 23 && newAt <= 0) { atked = true; }
          return { ...e, x: newX, currentHp: newHp, statuses: newSt, attackTimer: atked ? 2.5 : newAt, _atk: atked };
        });

        // Enemy attacks cube
        next.forEach(e => {
          if (e._atk && !e.dead) {
            const dmg = Math.max(1, e.atk * (100 / (100 + cubeDef)));
            setCubeHP(hp => {
              const newHp = Math.max(0, hp - dmg);
              if (newHp <= 0) setCubeDead(true);
              return newHp;
            });
            spawnFloat(`-${Math.round(dmg)}`, 13, 38, "#ef5350", true);
            setCubeState("hit");
            setTimeout(() => setCubeState("idle"), 280);
          }
        });

        // Kill check
        next = next.map(e => {
          if (e.currentHp <= 0 && !e.dead) {
            const isBoss     = curStage?.wave === 3; // wave 3 = boss wave (simplified)
            const waveCount  = next.filter(x => !x.dead).length;
            const goldGain   = calcGoldGain(curStage?.stage || 1, isBoss, 1);
            const expGain    = calcExpGain(curStage?.stage || 1, isBoss, 1);
            spawnFloat("💀", e.x - 2, 28, "#ffa726");
            spawnFloat(`+${goldGain}🪙`, e.x - 2, 22, "#ffd740");
            setKills(k => k + 1);
            setCoins(c => c + goldGain);
            gainExp(expGain);
            return { ...e, dead: true, currentHp: 0 };
          }
          return e;
        });

        if (next.length > 0 && next.every(e => e.dead)) setWaveCleared(true);
        return next;
      });

      // Auto-skill firing
      setCooldowns(prev => {
        const next = [...prev];
        skillSlots.forEach((slot, i) => {
          if (next[i] > 0) return;
          const sk = getSkill(slot.skillId);
          if (!sk) return;
          const cd   = calcCooldown(sk, slot.level);
          next[i]    = cd;

          setEnemies(ep => {
            const alive = ep.filter(e => !e.dead);
            if (!alive.length) return ep;
            const isAoe    = sk.target_count === "aoe" || sk.target_count === "chain_aoe";
            const targets  = isAoe ? alive : [alive[0]];
            let   updated  = [...ep];

            sk.effects.forEach(eff => {
              // Damage
              if (eff.unit?.includes("% ATK") && !eff.is_defense && !eff.is_buff && !eff.is_debuff && !eff.is_heal && !eff.is_shield && eff.base_value > 0) {
                targets.forEach(t => {
                  const raw   = calcDmg(eff, slot.level, cubeAtk);
const elMod = elementMod(cubeElement, t.element);
const fin   = applyDef(raw * elMod, t.def);
                  const crit  = Math.random() < cubeCritR / 100;
                  const dealt = Math.round(crit ? fin * (1 + cubeCritD / 100) : fin);
                  updated = updated.map(e => e.id === t.id ? {...e, currentHp: Math.max(0, e.currentHp - dealt)} : e);
                  spawnFloat(crit ? `-${dealt}★` : `-${dealt}`, t.x - 2, 28, crit ? "#ffd740" : "#ff6b35", crit);
                  setDmgDealt(d => d + dealt);
                });
              }
              // Status
              if (eff.status) {
                targets.forEach(t => {
                  const applied = rollStatus(eff, slot.level);
                  if (applied) {
                    const dur = eff.duration_fixed || 3;
                    updated = updated.map(e => {
                      if (e.id !== t.id || e.statuses.some(s => s.type === applied)) return e;
                      spawnFloat(STATUS_CFG[applied]?.label || applied, t.x - 2, 20, STATUS_CFG[applied]?.color || "#aaa");
                      return {...e, statuses: [...e.statuses, {type: applied, remaining: dur}]};
                    });
                  }
                });
              }
              // Wall
              if (eff.is_wall || sk.wall) {
                setWalls(w => [...w, {id: uid(), x: 55, hp: 4, maxHp: 4}]);
                spawnFloat("🧱 WALL", 55, 30, "#b0bec5");
              }
              // Push / repel
              if (sk.push || eff.is_repel || sk.repel) {
                const pushX = sk.repel ? 22 : 14;
                targets.forEach(t => {
                  updated = updated.map(e => e.id === t.id ? {...e, x: Math.min(84, e.x + pushX)} : e);
                  spawnFloat(sk.repel ? "↩ REPEL" : "↩ PUSH", t.x, 22, "#4fc3f7");
                });
              }
              // Heal
              if (eff.is_heal) {
                const amt = Math.round(cubeAtk * eff.base_value / 100);
                setCubeHP(hp => Math.min(cubeMaxHp, hp + amt));
                setHealed(h => h + amt);
                spawnFloat(`+${amt}`, 13, 30, "#66bb6a", true);
              }
            });

            setCubeState("attack");
            setTimeout(() => setCubeState("idle"), 350);

            const gain = RARITY_CONFIG[sk.rarity]?.affinity_gain || 0.2;
const skEl = sk.id.startsWith("fire") ? "fire"
  : sk.id.startsWith("water") ? "water"
  : sk.id.startsWith("elec") ? "electric"
  : sk.id.startsWith("metal") ? "metal"
  : sk.id.startsWith("psyc") ? "psychic"
  : "light";
setElementAffinity(ea => ({...ea, [skEl]: Math.min(100, (ea[skEl]||0) + gain)}));

            return updated;
          });
        });
        return next;
      });
    }, TICK);
    return () => clearInterval(interval);
  }, [speed, skillSlots, cubeElement, cubeAtk, cubeDef, cubeMaxHp, cubeCritR, cubeCritD, cubeDead, spawnFloat, gainExp, curStage]);

  const retryWave = () => {
    setCubeDead(false);
    setCubeHP(cubeMaxHp);
    spawnWave(stageIdx); // respawn same wave, retreat = already handled by stageIdx
  };

  const nextWave = () => {
    const n = stageIdx + 1;
    setStageIdx(n);
    spawnWave(n);
    setCubeHP(cubeMaxHp);
    setCubeDead(false);
    setDmgDealt(0);
  };

  const typeIcon = (sk) => {
    if (!sk) return "?";
    return sk.type === "damage" ? "⚔️" : sk.type === "defense" ? "🛡️" : "⚙️";
  };

  return (
    <div style={{
      width:"100%", height:"100vh", display:"flex", flexDirection:"column",
      background:"#07090f", fontFamily:"'Courier New', monospace",
      color:"#c8d0e0", overflow:"hidden", userSelect:"none",
    }}>
      <style>{`
        @keyframes floatUp {
          0%   { opacity:1; transform:translate(-50%,-50%) scale(1); }
          100% { opacity:0; transform:translate(-50%,-300%) scale(0.8); }
        }
        @keyframes fadeInOut {
          0%   { opacity:0; transform:translateX(-50%) scale(0.85); }
          15%  { opacity:1; transform:translateX(-50%) scale(1.08); }
          70%  { opacity:1; transform:translateX(-50%) scale(1); }
          100% { opacity:0; transform:translateX(-50%) scale(0.95); }
        }
        @keyframes bob {
          0%,100% { transform:translateY(0px); }
          50%     { transform:translateY(-5px); }
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 6px var(--glow); }
          50%     { box-shadow: 0 0 14px var(--glow); }
        }
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#080b14}
        ::-webkit-scrollbar-thumb{background:#1e3050;border-radius:2px}
      `}</style>

      {/* ════════════ BATTLE SCENE ════════════ */}
      <div style={{
        flex:"0 0 58%", position:"relative", overflow:"hidden",
        background:`linear-gradient(180deg, #1a2d4a 0%, #2a4060 35%, #4a6830 68%, #324020 100%)`,
        borderBottom:`2px solid ${elCfg.color}44`,
      }}>
        {/* Ambient glow from cube element */}
        <div style={{
          position:"absolute", left:0, top:0, width:"35%", height:"100%",
          background:`radial-gradient(ellipse at 15% 65%, ${elCfg.glow}, transparent 60%)`,
          pointerEvents:"none",
        }} />

        {/* Ground strip */}
        <div style={{
          position:"absolute", bottom:"22%", left:0, right:0, height:2,
          background:`linear-gradient(90deg, ${elCfg.color}55, ${elCfg.color}22, transparent)`,
        }} />
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:"22%",
          background:"linear-gradient(180deg, #2a3a18, #1a2410)",
        }} />

        {/* ── HUD bar ── */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, zIndex:10,
          display:"flex", alignItems:"center", gap:8, padding:"5px 10px",
          background:"#00000066", backdropFilter:"blur(6px)",
        }}>
          {/* Cube HP */}
          <span style={{fontSize:9, color:elCfg.color, fontWeight:"bold", whiteSpace:"nowrap"}}>
            {elCfg.icon} Lv{cubeLevel}
          </span>
          <div style={{flex:1, height:13, background:"#0a0f18", border:`1px solid ${elCfg.color}44`, borderRadius:7, overflow:"hidden", position:"relative"}}>
            <div style={{height:"100%", width:`${hpPct*100}%`, background:hpColor, borderRadius:7, transition:"width 0.15s"}} />
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",letterSpacing:1}}>
              {Math.round(cubeHP)} / {cubeMaxHp}
            </div>
          </div>
          {/* Shield */}
          {cubeShield > 0 && (
            <span style={{fontSize:9,color:"#42a5f5"}}>🛡{cubeShield}</span>
          )}
          {/* Stage */}
          <span style={{fontSize:8, color:"#3a6090", letterSpacing:1, whiteSpace:"nowrap"}}>
            S{curStage?.stage}-W{curStage?.wave}
          </span>
          {/* Speed */}
          <div style={{display:"flex",gap:3}}>
            {[1,2,3].map(s => (
              <button key={s} onClick={() => setSpeed(s)} style={{
                fontSize:8, padding:"2px 6px",
                border:`1px solid ${speed===s ? elCfg.color : "#1e3050"}`,
                background: speed===s ? `${elCfg.color}22` : "transparent",
                color: speed===s ? elCfg.color : "#2a5070",
                cursor:"pointer", borderRadius:3, fontFamily:"'Courier New', monospace",
              }}>×{s}</button>
            ))}
          </div>
          {/* Economy */}
          <span style={{fontSize:8,color:"#ffd740"}}>🪙{coins}</span>
          <span style={{fontSize:8,color:elCfg.color}}>LV{cubeLevel}</span>
        </div>

        {/* ── Cube ── */}
        <div style={{
          position:"absolute", left:"9%", bottom:"22%",
          display:"flex", flexDirection:"column", alignItems:"center",
          animation: cubeState === "idle" ? "bob 2s ease-in-out infinite" : "none",
          transform: cubeState === "hit" ? "translateY(5px)" : cubeState === "attack" ? "translateY(-8px) translateX(6px)" : "none",
          transition: "transform 0.12s",
          zIndex:5,
        }}>
          <div style={{
            width:62, height:62, borderRadius:12,
            background:`linear-gradient(145deg, ${elCfg.light}cc, ${elCfg.color}88)`,
            border:`2px solid ${elCfg.color}`,
            boxShadow:`0 0 20px ${elCfg.glow}, 0 4px 12px #00000066, inset 0 0 10px ${elCfg.color}22`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28, position:"relative",
            filter: cubeState === "hit" ? "brightness(2) saturate(0.5)" : "none",
            transition:"filter 0.1s",
          }}>
            <span style={{fontSize:22, lineHeight:1}}>
              {cubeState === "hit" ? "😵" : cubeState === "attack" ? "😤" : "🙂"}
            </span>
          </div>
        </div>

        {/* ── Skill slots (bottom-left of scene) ── */}
        <div style={{
          position:"absolute", left:"2%", bottom:"2%",
          display:"flex", gap:5, zIndex:6,
        }}>
          {skillSlots.map((slot, i) => {
            const sk   = getSkill(slot.skillId);
            const rCfg = sk ? RARITY_CONFIG[sk.rarity] : RARITY_CONFIG.common;
            const cdMax = sk ? calcCooldown(sk, slot.level) : 8;
            const cdLeft = cooldowns[i];
            const ready  = cdLeft <= 0;
            const cdPct  = ready ? 1 : 1 - cdLeft / cdMax;
            return (
              <div key={i} style={{
                width:44, height:44, borderRadius:7, position:"relative", overflow:"hidden",
                border:`1.5px solid ${ready ? rCfg.color : rCfg.color + "55"}`,
                background:`${rCfg.color}18`,
                boxShadow: ready ? `0 0 10px ${rCfg.color}66` : "none",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {/* CD overlay */}
                <div style={{
                  position:"absolute", bottom:0, left:0, right:0,
                  height:`${(1-cdPct)*100}%`,
                  background:"#00000088",
                  transition:"height 0.1s",
                }} />
                <span style={{fontSize:18, zIndex:1}}>{typeIcon(sk)}</span>
                {!ready && (
                  <span style={{
                    position:"absolute", bottom:1, right:2,
                    fontSize:7, color:"#fff", zIndex:2,
                  }}>{cdLeft.toFixed(1)}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Walls ── */}
        {walls.filter(w => w.hp > 0).map(w => (
          <div key={w.id} style={{
            position:"absolute", left:`${w.x}%`, bottom:"22%",
            transform:"translateX(-50%)",
            width:10, height:56, zIndex:4,
            background:"linear-gradient(180deg, #90a4ae, #546e7a)",
            border:"2px solid #b0bec5",
            borderRadius:4,
            boxShadow:"0 0 14px #b0bec588",
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", gap:3,
          }}>
            {[...Array(w.maxHp)].map((_,i) => (
              <div key={i} style={{width:5,height:5,borderRadius:"50%",background: i<w.hp ? "#eceff1" : "#37474f"}} />
            ))}
          </div>
        ))}

        {/* ── Enemies ── */}
        {enemies.map(e => {
          const eCfg = ELEMENT_CONFIG[e.element] || ELEMENT_CONFIG.fire;
          return (
            <div key={e.id} style={{
              position:"absolute", left:`${e.x}%`, bottom:"22%",
              transform:"translateX(-50%)",
              display:"flex", flexDirection:"column", alignItems:"center",
              width:58, zIndex:3,
              opacity: e.dead ? 0 : 1,
              transition: e.dead ? "opacity 0.6s" : "left 0.1s linear",
              pointerEvents: e.dead ? "none" : "auto",
            }}>
              {/* Status badges */}
              <div style={{display:"flex",gap:2,marginBottom:2,flexWrap:"wrap",justifyContent:"center",maxWidth:62}}>
                {e.statuses.map((s,si) => (
                  <div key={si} style={{
                    fontSize:7, padding:"0 3px",
                    background:`${STATUS_CFG[s.type]?.color || "#555"}33`,
                    border:`1px solid ${STATUS_CFG[s.type]?.color || "#555"}`,
                    borderRadius:2, color: STATUS_CFG[s.type]?.color || "#aaa",
                  }}>
                    {STATUS_CFG[s.type]?.icon || s.type[0]}
                  </div>
                ))}
              </div>
              {/* HP bar */}
              <div style={{width:50,height:4,background:"#0a0f18",border:"1px solid #1a2a3a",borderRadius:3,overflow:"hidden",marginBottom:3}}>
                <div style={{
                  height:"100%", width:`${(e.currentHp/e.maxHp)*100}%`,
                  background: e.currentHp/e.maxHp > 0.5 ? "#ef5350" : "#ff8a65",
                  borderRadius:3, transition:"width 0.08s",
                }} />
              </div>
              {/* Body */}
              <div style={{
                width:52, height:52, borderRadius:"50% 50% 38% 38%",
                background:`radial-gradient(circle at 35% 35%, ${eCfg.light}, ${eCfg.color})`,
                border:`2px solid ${eCfg.color}`,
                boxShadow:`0 0 12px ${eCfg.glow}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:24,
              }}>
                {e.icon}
              </div>
              <div style={{fontSize:7,color:"#8aa",marginTop:2,whiteSpace:"nowrap"}}>{e.name}</div>
              <div style={{fontSize:7,color:"#ef9a9a"}}>{Math.round(e.currentHp)}/{e.maxHp}</div>
            </div>
          );
        })}

        {/* ── Floating texts ── */}
        {floats.map(f => (
          <div key={f.id} style={{
            position:"absolute", left:`${f.x}%`, top:`${f.y}%`,
            transform:"translate(-50%,-50%)",
            color:f.color, fontSize: f.big ? 15 : 10,
            fontWeight:"bold",
            animation:"floatUp 1.1s ease-out forwards",
            pointerEvents:"none", whiteSpace:"nowrap", zIndex:20,
            textShadow:`0 0 8px ${f.color}, 0 1px 3px #000`,
          }}>{f.text}</div>
        ))}

        {/* ── Wave announce ── */}
        {waveAnn && (
          <div style={{
            position:"absolute", top:"38%", left:"50%",
            animation:"fadeInOut 2s ease forwards",
            pointerEvents:"none", zIndex:30,
            fontSize:18, fontWeight:"bold", letterSpacing:4,
            color:"#fff", whiteSpace:"nowrap",
            textShadow:`0 0 24px ${elCfg.color}, 0 2px 4px #000`,
          }}>{waveAnn}</div>
        )}

        {/* ── Cube death overlay ── */}
        {cubeDead && (
          <div style={{
            position:"absolute", inset:0, background:"#000000cc",
            display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:10, zIndex:25,
          }}>
            <div style={{fontSize:22,color:"#ef5350",fontWeight:"bold",letterSpacing:3,textShadow:"0 0 24px #ef5350"}}>
              ✖ DEFEATED
            </div>
            <div style={{fontSize:9,color:"#aaa",letterSpacing:1}}>Retreat 1 layer — no gold earned</div>
            <button onClick={retryWave} style={{
              padding:"8px 28px", fontSize:11, letterSpacing:3,
              background:"#ef535022", border:"1px solid #ef5350",
              color:"#ef5350", cursor:"pointer", borderRadius:5,
              fontFamily:"'Courier New', monospace", marginTop:4,
            }}>RETRY ↩</button>
          </div>
        )}

        {/* ── Wave clear overlay ── */}
        {waveCleared && (
          <div style={{
            position:"absolute", inset:0, background:"#000000aa",
            display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:10, zIndex:25,
          }}>
            <div style={{fontSize:20,color:"#ffd740",fontWeight:"bold",letterSpacing:4,textShadow:"0 0 24px #ffd740"}}>
              ✦ WAVE CLEARED ✦
            </div>
            <div style={{fontSize:9,color:"#aaa",letterSpacing:1}}>
              +{calcGoldGain(curStage?.stage||1, curStage?.wave===3, curStage?.enemies?.length||1)} GOLD  ·  +{calcExpGain(curStage?.stage||1, curStage?.wave===3, curStage?.enemies?.length||1)} EXP
            </div>
            <button onClick={nextWave} style={{
              padding:"8px 28px", fontSize:11, letterSpacing:3,
              background:`${elCfg.color}22`, border:`1px solid ${elCfg.color}`,
              color:elCfg.color, cursor:"pointer", borderRadius:5,
              fontFamily:"'Courier New', monospace", marginTop:4,
            }}>NEXT WAVE →</button>
          </div>
        )}
      </div>

      {/* ════════════ BOTTOM PANEL ════════════ */}
      <div style={{flex:"0 0 42%", display:"flex", flexDirection:"column", background:"#0b0e18", overflow:"hidden"}}>

        {/* Tab bar */}
        <div style={{display:"flex", borderBottom:"1px solid #1a2030", background:"#080b14"}}>
          {[
            {id:"stats",    label:"📊 Stats"},
            {id:"skills",   label:"⚔ Skills"},
            {id:"settings", label:"⚙ Settings"},
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, padding:"8px 4px",
              fontSize:9, letterSpacing:2, textTransform:"uppercase",
              border:"none",
              borderBottom:`2px solid ${tab===t.id ? elCfg.color : "transparent"}`,
              background: tab===t.id ? `${elCfg.color}11` : "transparent",
              color: tab===t.id ? elCfg.color : "#2a4060",
              cursor:"pointer", fontFamily:"'Courier New', monospace",
              transition:"all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{flex:1, overflowY:"auto", padding:"10px 12px"}}>

          {/* ── STATS TAB ── */}
          {tab === "stats" && (
            <>
              {/* EXP & Level bar */}
              <div style={{background:"#0e1320",border:`1px solid ${elCfg.color}44`,borderRadius:5,padding:"8px 10px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <div>
                    <span style={{fontSize:14,fontWeight:"bold",color:elCfg.color}}>LV {cubeLevel}</span>
                    <span style={{fontSize:8,color:"#2a5070",marginLeft:6}}>T0 · MAX LV 100</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:9,color:"#4a7090"}}>{cubeExp} / {expRequired(cubeLevel)} EXP</div>
                    {pendingPoints > 0 && (
                      <div style={{fontSize:8,color:"#ffa726",fontWeight:"bold",animation:"none"}}>
                        ✦ {pendingPoints} pts pending
                      </div>
                    )}
                  </div>
                </div>
                {/* EXP bar */}
                <div style={{height:6,background:"#0a0d14",border:"1px solid #1a2030",borderRadius:3,overflow:"hidden"}}>
                  <div style={{
                    height:"100%",
                    width:`${(cubeExp / expRequired(cubeLevel)) * 100}%`,
                    background:`linear-gradient(90deg, ${elCfg.color}88, ${elCfg.color})`,
                    borderRadius:3, transition:"width 0.2s",
                  }} />
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                  <span style={{fontSize:7,color:"#1e3050"}}>Stat pts: {spentPoints} / {totalPoints} used</span>
                  {pendingPoints > 0 && (
                    <button onClick={() => setShowStatAlloc(true)} style={{
                      fontSize:7, padding:"1px 8px",
                      border:"1px solid #ffa726", background:"#1a0a00",
                      color:"#ffa726", borderRadius:3, cursor:"pointer",
                      fontFamily:"'Courier New', monospace",
                    }}>ALLOCATE</button>
                  )}
                </div>
              </div>

              {/* Stat cards */}
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:6}}>
                {[
                  ["ATK",       cubeAtk,                   "#ef5350", `base ${BASE_STATS.atk} +${allocation.atk*STAT_PER_POINT.atk}`],
                  ["DEF",       cubeDef,                   "#42a5f5", `base ${BASE_STATS.def} +${allocation.def*STAT_PER_POINT.def}`],
                  ["HP",        `${Math.round(cubeHP)}/${cubeMaxHp}`, hpColor, `${(hpPct*100).toFixed(0)}% remaining`],
                  ["Crit Rate", `${cubeCritR.toFixed(1)}%`, "#ffd740", `base ${BASE_STATS.critR}% +${(allocation.critR*STAT_PER_POINT.critR).toFixed(1)}%`],
                  ["Crit Dmg",  `+${cubeCritD}%`,           "#ffa726", `×${(1+cubeCritD/100).toFixed(2)} on crit`],
                  ["ASPD",      cubeStats.aspd.toFixed(3),  "#66bb6a", `max 2.0`],
                ].map(([label, val, color, sub]) => (
                  <div key={label} style={{
                    background:"#0e1320", border:`1px solid ${color}33`,
                    borderRadius:5, padding:"7px 10px",
                  }}>
                    <div style={{fontSize:7,letterSpacing:2,color:"#2a4060",textTransform:"uppercase",marginBottom:3}}>{label}</div>
                    <div style={{fontSize:17,fontWeight:"bold",color}}>{val}</div>
                    <div style={{fontSize:7,color:"#1e3050",marginTop:2}}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* Battle summary */}
              <div style={{marginTop:8,background:"#0e1320",border:"1px solid #1a2030",borderRadius:5,padding:"8px 10px"}}>
                <div style={{fontSize:7,letterSpacing:2,color:"#2a4060",marginBottom:6,textTransform:"uppercase"}}>This Session</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
                  {[
                    ["DMG",    dmgDealt.toLocaleString(), "#ef5350"],
                    ["KILLS",  kills,                     "#ffd740"],
                    ["HEALED", healed.toLocaleString(),   "#66bb6a"],
                  ].map(([l,v,c]) => (
                    <div key={l} style={{textAlign:"center"}}>
                      <div style={{fontSize:7,color:"#2a4060",letterSpacing:1}}>{l}</div>
                      <div style={{fontSize:14,fontWeight:"bold",color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── SKILLS TAB ── */}
          {tab === "skills" && (
            <>
              {skillSlots.map((slot, i) => {
                const sk    = getSkill(slot.skillId);
                if (!sk) return null;
                const rCfg  = RARITY_CONFIG[sk.rarity];
                const cdMax = calcCooldown(sk, slot.level);
                const cdLeft = cooldowns[i];
                const cdPct  = Math.max(0, 1 - cdLeft / cdMax);
                const dmgEff = sk.effects.find(e => e.unit?.includes("% ATK") && e.base_value > 0 && !e.is_defense);
                const dmgVal = dmgEff ? ((dmgEff.base_value + dmgEff.scaling_per_level*(slot.level-1))*(dmgEff.hits||1)).toFixed(0) : null;
                const statusEff = sk.effects.find(e => e.status);
                return (
                  <div key={i} style={{
                    background:"#0e1320", border:"1px solid #1a2030",
                    borderRadius:5, padding:"9px 10px", marginBottom:7,
                  }}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                      <div>
                        <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:2}}>
                          <span style={{fontSize:14}}>{typeIcon(sk)}</span>
                          <span style={{fontSize:12,color:rCfg.color,fontWeight:"bold"}}>{sk.name}</span>
                          <span style={{fontSize:7,padding:"1px 5px",border:`1px solid ${rCfg.color}55`,color:rCfg.color,borderRadius:3}}>
                            {sk.rarity[0].toUpperCase()}
                          </span>
                          <span style={{fontSize:8,color:"#2a5070"}}>Lv{slot.level}</span>
                        </div>
                        <div style={{fontSize:8,color:"#2a5070"}}>
                          {sk.type.toUpperCase()} · {sk.target_count.toUpperCase()}
                          {dmgVal && ` · ${dmgVal}% ATK`}
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:10,color: cdLeft<=0 ? "#66bb6a" : "#3a6090", fontWeight:"bold"}}>
                          {cdLeft<=0 ? "READY" : `${cdLeft.toFixed(1)}s`}
                        </div>
                        <div style={{fontSize:7,color:"#1e3050"}}>CD {cdMax.toFixed(1)}s</div>
                      </div>
                    </div>
                    {/* Cooldown progress */}
                    <div style={{height:3,background:"#0a0d14",border:"1px solid #1a2030",borderRadius:2,overflow:"hidden",marginBottom:6}}>
                      <div style={{height:"100%",width:`${cdPct*100}%`,background:elCfg.color,borderRadius:2,transition:"width 0.1s"}} />
                    </div>
                    {/* Affinity per element */}
<div style={{fontSize:7,color:"#1e3050",letterSpacing:1,marginBottom:4}}>ELEMENT AFFINITY</div>
<div style={{display:"flex",flexDirection:"column",gap:3}}>
  {Object.entries(elementAffinity).map(([el, val]) => {
    const eCfg = ELEMENT_CONFIG[el];
    return (
      <div key={el} style={{display:"flex",alignItems:"center",gap:5}}>
        <span style={{fontSize:9,width:14}}>{eCfg.icon}</span>
        <div style={{flex:1,height:4,background:"#0a0d14",border:"1px solid #1a2030",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${val}%`,background:eCfg.color,borderRadius:2,transition:"width 0.3s"}} />
        </div>
        <span style={{fontSize:7,color: val>=100 ? "#ffa726" : eCfg.color,width:28,textAlign:"right"}}>
          {val>=100 ? "MAX" : val.toFixed(0)}
        </span>
      </div>
    );
  })}
</div>
                    {/* Status unlock hint */}
                    {statusEff && statusEff.trigger === "unlock_level_5" && (
                      <div style={{fontSize:7,color:slot.level>=5?"#66bb6a":"#2a4060",marginTop:4}}>
                        {slot.level>=5 ? "✓" : "🔒"} {statusEff.status?.toUpperCase()} status (unlock Lv5)
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === "settings" && (
            <>
              {/* Speed */}
              <div style={{background:"#0e1320",border:"1px solid #1a2030",borderRadius:5,padding:"10px 12px",marginBottom:8}}>
                <div style={{fontSize:7,color:"#2a4060",letterSpacing:2,marginBottom:8,textTransform:"uppercase"}}>Battle Speed</div>
                <div style={{display:"flex",gap:6}}>
                  {[1,2,3].map(s => (
                    <button key={s} onClick={() => setSpeed(s)} style={{
                      flex:1, padding:"9px 4px", fontSize:14,
                      border:`1px solid ${speed===s ? elCfg.color : "#1e2a3a"}`,
                      background: speed===s ? `${elCfg.color}22` : "#0a0d14",
                      color: speed===s ? elCfg.color : "#2a5070",
                      borderRadius:5, cursor:"pointer", fontFamily:"'Courier New', monospace",
                    }}>×{s}</button>
                  ))}
                </div>
              </div>

              {/* Sound */}
              <div style={{background:"#0e1320",border:"1px solid #1a2030",borderRadius:5,padding:"10px 12px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:10,color:"#6ab0f5"}}>Sound Effects</div>
                    <div style={{fontSize:7,color:"#1e3050",marginTop:2}}>BGM & battle SFX</div>
                  </div>
                  <button onClick={() => setSoundOn(s=>!s)} style={{
                    width:42, height:24, borderRadius:12,
                    background: soundOn ? "#1a3a1a" : "#1a1a1a",
                    border:`1px solid ${soundOn ? "#66bb6a" : "#333"}`,
                    cursor:"pointer", fontSize:13,
                  }}>{soundOn ? "🔊" : "🔇"}</button>
                </div>
              </div>

              {/* Swap cube element */}
              <div style={{background:"#0e1320",border:"1px solid #1a2030",borderRadius:5,padding:"10px 12px",marginBottom:8}}>
                <div style={{fontSize:7,color:"#2a4060",letterSpacing:2,marginBottom:8,textTransform:"uppercase"}}>Swap Cube Element</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {Object.entries(ELEMENT_CONFIG).map(([el,cfg]) => (
                    <button key={el} onClick={() => setCubeElement(el)} style={{
                      padding:"5px 9px", fontSize:11,
                      border:`1px solid ${cubeElement===el ? cfg.color : "#1e2a3a"}`,
                      background: cubeElement===el ? `${cfg.color}22` : "#0a0d14",
                      color: cubeElement===el ? cfg.color : "#2a5070",
                      borderRadius:5, cursor:"pointer", fontFamily:"'Courier New', monospace",
                    }}>{cfg.icon} {el}</button>
                  ))}
                </div>
                <div style={{fontSize:7,color:"#1e3050",marginTop:6}}>⚠ Battle continues during swap (idle mode)</div>
              </div>

              {/* Navigate */}
              <div style={{background:"#0e1320",border:"1px solid #1a2030",borderRadius:5,padding:"10px 12px"}}>
                <div style={{fontSize:7,color:"#2a4060",letterSpacing:2,marginBottom:8,textTransform:"uppercase"}}>Navigate — Idle Continues</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {[["🎰 Gacha","#ffa726"],["⚗ Evolve","#ce93d8"],["🗺 Dungeon","#42a5f5"],["🏠 Home","#66bb6a"]].map(([label,color]) => (
                    <button key={label} style={{
                      padding:"9px 4px", fontSize:10,
                      border:`1px solid ${color}44`,
                      background:`${color}11`, color,
                      borderRadius:5, cursor:"pointer",
                      fontFamily:"'Courier New', monospace",
                    }}>{label}</button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* ════════ LEVEL UP ANNOUNCE ════════ */}
      {levelUpAnn && (
        <div style={{
          position:"fixed", top:"20%", left:"50%",
          transform:"translateX(-50%)",
          zIndex:200, pointerEvents:"none",
          fontSize:22, fontWeight:"bold", letterSpacing:4,
          color:"#ffd740",
          textShadow:"0 0 30px #ffd740, 0 2px 6px #000",
          animation:"fadeInOut 2s ease forwards",
        }}>{levelUpAnn}</div>
      )}

      {/* ════════ STAT ALLOCATION MODAL ════════ */}
      {showStatAlloc && pendingPoints > 0 && (
        <div style={{
          position:"fixed", inset:0, zIndex:150,
          background:"#000000bb", backdropFilter:"blur(4px)",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <div style={{
            width:320, background:"#0b0e18",
            border:`1px solid ${elCfg.color}66`,
            borderRadius:10, padding:"20px 18px",
            boxShadow:`0 0 40px ${elCfg.glow}`,
          }}>
            {/* Header */}
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:"bold",color:elCfg.color,letterSpacing:3}}>
                LEVEL UP! — LV {cubeLevel}
              </div>
              <div style={{fontSize:10,color:"#2a5070",marginTop:3}}>
                {pendingPoints} stat {pendingPoints === 1 ? "point" : "points"} to allocate
              </div>
            </div>

            {/* Stat rows */}
            {[
              { key:"atk",   label:"ATK",       color:"#ef5350", unit:"+2 per pt",    val: cubeStats.atk   },
              { key:"def",   label:"DEF",       color:"#42a5f5", unit:"+1 per pt",    val: cubeStats.def   },
              { key:"hp",    label:"HP",        color:"#66bb6a", unit:"+10 per pt",   val: cubeStats.hp    },
              { key:"critR", label:"CRIT RATE", color:"#ffd740", unit:"+0.01% per pt",val: `${cubeStats.critR.toFixed(1)}%` },
              { key:"critD", label:"CRIT DMG",  color:"#ffa726", unit:"+0.25% per pt",val: `+${cubeStats.critD}%` },
              { key:"aspd",  label:"ASPD",      color:"#ce93d8", unit:"+0.002 per pt",val: cubeStats.aspd.toFixed(3) },
            ].map(({ key, label, color, unit, val }) => (
              <div key={key} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"7px 0", borderBottom:"1px solid #1a2030",
              }}>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,color,fontWeight:"bold"}}>{label}</div>
                  <div style={{fontSize:7,color:"#1e3050"}}>{unit}</div>
                </div>
                <div style={{fontSize:12,color,fontWeight:"bold",width:60,textAlign:"center"}}>{val}</div>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={() => {
                    // Bug 2: can only reduce points added THIS session (above locked floor)
                    if (allocation[key] > lockedAlloc[key]) {
                      setAllocation(a => ({...a, [key]: a[key]-1}));
                      setPendingPoints(p => p+1);
                    }
                  }} disabled={allocation[key] <= lockedAlloc[key]} style={{
                    width:24, height:24, borderRadius:4,
                    border:`1px solid ${allocation[key]>0 ? "#3a5070" : "#1a2030"}`,
                    background:"#0a0d14",
                    color: allocation[key]>0 ? "#6ab0f5" : "#1e3050",
                    cursor: allocation[key]>0 ? "pointer" : "not-allowed",
                    fontSize:14, fontWeight:"bold",
                  }}>−</button>
                  <span style={{width:24,textAlign:"center",fontSize:11,color:"#6ab0f5",lineHeight:"24px"}}>
                    {allocation[key]}
                  </span>
                  <button onClick={() => allocate(key)} disabled={pendingPoints<=0} style={{
                    width:24, height:24, borderRadius:4,
                    border:`1px solid ${pendingPoints>0 ? elCfg.color : "#1a2030"}`,
                    background: pendingPoints>0 ? `${elCfg.color}22` : "#0a0d14",
                    color: pendingPoints>0 ? elCfg.color : "#1e3050",
                    cursor: pendingPoints>0 ? "pointer" : "not-allowed",
                    fontSize:14, fontWeight:"bold",
                  }}>+</button>
                </div>
              </div>
            ))}

            {/* Confirm — Bug 3: show summary panel after all points spent */}
            {pendingPoints === 0 ? (
              <div style={{marginTop:12}}>
                <div style={{
                  background:"#0a1a0a", border:"1px solid #66bb6a44",
                  borderRadius:5, padding:"8px 10px", marginBottom:10,
                }}>
                  <div style={{fontSize:8,color:"#66bb6a",letterSpacing:1,marginBottom:5}}>ALLOCATION SUMMARY</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {Object.entries(allocation).filter(([,v])=>v>0).map(([k,v]) => (
                      <span key={k} style={{fontSize:8,padding:"1px 6px",background:"#1a3a1a",border:"1px solid #66bb6a33",borderRadius:3,color:"#66bb6a"}}>
                        {k.toUpperCase()} +{v}pt
                      </span>
                    ))}
                    {Object.values(allocation).every(v=>v===0) && (
                      <span style={{fontSize:8,color:"#2a4060"}}>No points allocated</span>
                    )}
                  </div>
                </div>
                <button onClick={() => {
                  setLockedAlloc({...allocation});
                  setShowStatAlloc(false);
                }} style={{
                  width:"100%", padding:"10px",
                  border:`1px solid ${elCfg.color}`,
                  background:`${elCfg.color}22`,
                  color:elCfg.color,
                  borderRadius:6, cursor:"pointer",
                  fontFamily:"'Courier New', monospace", fontSize:11, letterSpacing:2,
                }}>CONFIRM & CONTINUE BATTLE ✓</button>
              </div>
            ) : (
              <div style={{
                width:"100%", marginTop:14, padding:"10px",
                border:"1px solid #1a2030", background:"#0a0d14",
                color:"#2a4060", borderRadius:6, textAlign:"center",
                fontSize:11, letterSpacing:2,
              }}>
                ALLOCATE {pendingPoints} MORE POINT{pendingPoints>1?"S":""}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
