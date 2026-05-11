import { useState, useMemo } from "react";

const SKILL_DATA = {
  fire: [
    { id: "fire_dmg_01", name: "Fireball", type: "damage", rarity: "common", target_count: "single", cooldown_base: 8, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Launch 2 fireballs, each deals % ATK", base_value: 75, scaling_per_level: 5, unit: "% ATK per ball", hits: 2 }, { trigger: "unlock_level_5", description: "Burn chance", base_value: 10, scaling_per_level: 1, unit: "% chance", status: "burn", duration_fixed: 3 }] },
    { id: "fire_dmg_02", name: "Flame Slash", type: "damage", rarity: "common", target_count: "single", cooldown_base: 6, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Slash 3x, each deals % ATK", base_value: 45, scaling_per_level: 3, unit: "% ATK per slash", hits: 3 }, { trigger: "unlock_level_5", description: "Scorch chance", base_value: 8, scaling_per_level: 0.5, unit: "% chance", status: "scorch", duration_fixed: 3 }] },
    { id: "fire_dmg_03", name: "Ember Burst", type: "damage", rarity: "common", target_count: "aoe", cooldown_base: 10, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "AoE explosion", base_value: 120, scaling_per_level: 4, unit: "% ATK" }] },
    { id: "fire_def_01", name: "Fire Shield", type: "defense", rarity: "common", target_count: "single", cooldown_base: 8, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Reflect % damage to attacker", base_value: 20, scaling_per_level: 1, unit: "% reflect", duration_fixed: 3 }, { trigger: "unlock_level_5", description: "Burn chance on attacker", base_value: 15, scaling_per_level: 0.5, unit: "% chance", status: "burn", duration_fixed: 2 }] },
    { id: "fire_dmg_04", name: "Magma Shot", type: "damage", rarity: "rare", target_count: "single", cooldown_base: 8, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Magma ball explodes on impact", base_value: 160, scaling_per_level: 5, unit: "% ATK" }, { trigger: "always", description: "Burn chance", base_value: 40, scaling_per_level: 1, unit: "% chance", status: "burn", duration_fixed: 4 }] },
    { id: "fire_def_02", name: "Blazing Armor", type: "defense", rarity: "rare", target_count: "single", cooldown_base: 10, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Reduce incoming damage", base_value: 25, scaling_per_level: 1.5, unit: "% reduction", duration_fixed: 4 }, { trigger: "always", description: "Scorch chance on attacker", base_value: 40, scaling_per_level: 1, unit: "% chance", status: "scorch", duration_fixed: 3 }] },
    { id: "fire_utl_01", name: "Flame Rage", type: "utility", rarity: "rare", target_count: "single", cooldown_base: 12, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "ATK boost", base_value: 30, scaling_per_level: 1.5, unit: "% ATK boost", duration_fixed: 6 }, { trigger: "always", description: "Crit Rate boost", base_value: 15, scaling_per_level: 1, unit: "% Crit Rate", duration_fixed: 6 }] },
    { id: "fire_dmg_05", name: "Inferno Strike", type: "damage", rarity: "epic", target_count: "aoe", cooldown_base: 13, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Massive fire pillar", base_value: 250, scaling_per_level: 8, unit: "% ATK" }, { trigger: "always", description: "Burn chance", base_value: 50, scaling_per_level: 2, unit: "% chance", status: "burn", duration_fixed: 5 }] },
    { id: "fire_utl_02", name: "Scorching Aura", type: "utility", rarity: "epic", target_count: "single", cooldown_base: 14, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "All Fire Damage boost", base_value: 50, scaling_per_level: 5, unit: "% Fire Dmg boost", duration_fixed: 8 }, { trigger: "always", description: "Crit Rate boost", base_value: 20, scaling_per_level: 1, unit: "% Crit Rate", duration_fixed: 8 }, { trigger: "always", description: "Crit Damage boost", base_value: 25, scaling_per_level: 5, unit: "% Crit Dmg", duration_fixed: 8 }] },
    { id: "fire_dmg_06", name: "Meteor", type: "damage", rarity: "legendary", target_count: "aoe", cooldown_base: 18, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "1st Meteor always hits", base_value: 300, scaling_per_level: 10, unit: "% ATK" }, { trigger: "unlock_level_4", description: "2nd Meteor chance (40%)", base_value: 200, scaling_per_level: 8, unit: "% ATK" }, { trigger: "unlock_level_8", description: "3rd Meteor chance (20%)", base_value: 100, scaling_per_level: 5, unit: "% ATK" }, { trigger: "always", description: "Burn chance", base_value: 70, scaling_per_level: 3, unit: "% chance", status: "burn", duration_fixed: 6 }] },
    { id: "fire_utl_03", name: "Emperor's Flame", type: "utility", rarity: "legendary", target_count: "single", cooldown_base: 18, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "All Fire Damage boost", base_value: 80, scaling_per_level: 5, unit: "% Fire Dmg boost", duration_fixed: 10 }, { trigger: "always", description: "ASPD boost", base_value: 50, scaling_per_level: 2, unit: "% ASPD", duration_fixed: 10 }, { trigger: "always", description: "Crit Damage boost", base_value: 55, scaling_per_level: 5, unit: "% Crit Dmg", duration_fixed: 10 }, { trigger: "always", description: "Incoming damage reduction", base_value: 25, scaling_per_level: 2, unit: "% reduction", duration_fixed: 10 }] },
  ],
  water: [
    { id: "water_dmg_01", name: "Water Jet", type: "damage", rarity: "common", target_count: "single", cooldown_base: 7, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Pressurized water stream", base_value: 130, scaling_per_level: 4, unit: "% ATK" }, { trigger: "unlock_level_5", description: "Wet chance", base_value: 10, scaling_per_level: 1, unit: "% chance", status: "wet", duration_fixed: 4 }] },
    { id: "water_dmg_02", name: "Tidal Slam", type: "damage", rarity: "common", target_count: "aoe", cooldown_base: 10, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Crash tidal wave", base_value: 120, scaling_per_level: 4, unit: "% ATK" }, { trigger: "unlock_level_5", description: "Freeze chance", base_value: 10, scaling_per_level: 1, unit: "% chance", status: "freeze", duration_fixed: 1.5 }] },
    { id: "water_def_01", name: "Aqua Shield", type: "defense", rarity: "common", target_count: "single", cooldown_base: 9, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Shield equal to % max HP", base_value: 25, scaling_per_level: 2, unit: "% max HP", duration_fixed: 4 }, { trigger: "unlock_level_5", description: "Wet attacker chance", base_value: 15, scaling_per_level: 1, unit: "% chance", status: "wet", duration_fixed: 3 }] },
    { id: "water_utl_01", name: "Tidal Flow", type: "utility", rarity: "common", target_count: "single", cooldown_base: 10, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "ASPD boost", base_value: 20, scaling_per_level: 1.5, unit: "% ASPD", duration_fixed: 5 }] },
    { id: "water_dmg_03", name: "Hydro Cannon", type: "damage", rarity: "rare", target_count: "single", cooldown_base: 9, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Concentrated water blast + push back", base_value: 180, scaling_per_level: 6, unit: "% ATK" }, { trigger: "always", description: "Wet chance", base_value: 35, scaling_per_level: 2, unit: "% chance", status: "wet", duration_fixed: 5 }] },
    { id: "water_def_02", name: "Glacial Wall", type: "defense", rarity: "rare", target_count: "aoe", cooldown_base: 11, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Wall blocking enemy path (4s/4 hits)", base_value: 0, scaling_per_level: 0, unit: "wall" }, { trigger: "on_wall_break", description: "Freeze chance on wall break", base_value: 35, scaling_per_level: 1.5, unit: "% chance", status: "freeze", duration_fixed: 2 }] },
    { id: "water_utl_02", name: "Aqua Surge", type: "utility", rarity: "rare", target_count: "single", cooldown_base: 12, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Heal self", base_value: 100, scaling_per_level: 5, unit: "% ATK as HP" }, { trigger: "always", description: "DEF boost", base_value: 20, scaling_per_level: 1.5, unit: "% DEF", duration_fixed: 6 }] },
    { id: "water_dmg_04", name: "Ice Age", type: "damage", rarity: "epic", target_count: "aoe", cooldown_base: 14, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Massive ice DoT/sec for 3s", base_value: 80, scaling_per_level: 7, unit: "% ATK/sec", duration_fixed: 3 }, { trigger: "unlock_level_5", description: "Ice shatter burst on end (fixed)", base_value: 60, scaling_per_level: 0, unit: "% ATK" }, { trigger: "always", description: "Freeze chance", base_value: 50, scaling_per_level: 2, unit: "% chance", status: "freeze", duration_fixed: 3 }] },
    { id: "water_utl_03", name: "Abyssal Flow", type: "utility", rarity: "epic", target_count: "single", cooldown_base: 14, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "All Water Damage boost", base_value: 50, scaling_per_level: 5, unit: "% Water Dmg boost", duration_fixed: 8 }, { trigger: "always", description: "ASPD boost", base_value: 25, scaling_per_level: 2, unit: "% ASPD", duration_fixed: 8 }, { trigger: "always", description: "Heal every 2s", base_value: 50, scaling_per_level: 3, unit: "% ATK/2s", duration_fixed: 8 }] },
    { id: "water_dmg_05", name: "Abyssal Tsunami", type: "damage", rarity: "legendary", target_count: "aoe", cooldown_base: 20, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Wave 1: AoE + push back", base_value: 150, scaling_per_level: 8, unit: "% ATK" }, { trigger: "always", description: "Wave 2: AoE + push + 70% Wet", base_value: 125, scaling_per_level: 6, unit: "% ATK" }, { trigger: "always", description: "Wave 3: AoE + 60% Freeze", base_value: 125, scaling_per_level: 6, unit: "% ATK" }] },
    { id: "water_utl_04", name: "Ocean's Embrace", type: "utility", rarity: "legendary", target_count: "single", cooldown_base: 18, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "All Water Damage boost", base_value: 80, scaling_per_level: 5, unit: "% Water Dmg boost", duration_fixed: 10 }, { trigger: "always", description: "ASPD boost", base_value: 50, scaling_per_level: 2, unit: "% ASPD", duration_fixed: 10 }, { trigger: "always", description: "Heal every 2s", base_value: 50, scaling_per_level: 3, unit: "% ATK/2s", duration_fixed: 10 }, { trigger: "on_overheal", description: "Overheal converts to Shield", base_value: 0, scaling_per_level: 0, unit: "special" }] },
  ],
  electric: [
    { id: "elec_dmg_01", name: "Lightning Bolt", type: "damage", rarity: "common", target_count: "single", cooldown_base: 7, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Strike single target", base_value: 130, scaling_per_level: 4, unit: "% ATK" }, { trigger: "unlock_level_5", description: "Paralyze chance", base_value: 10, scaling_per_level: 1, unit: "% chance", status: "paralyze", duration_fixed: 1.5 }] },
    { id: "elec_dmg_02", name: "Static Burst", type: "damage", rarity: "common", target_count: "aoe", cooldown_base: 10, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Electric pulse AoE", base_value: 120, scaling_per_level: 4, unit: "% ATK" }, { trigger: "unlock_level_5", description: "Shock chance", base_value: 10, scaling_per_level: 1, unit: "% chance", status: "shock", duration_fixed: 3 }] },
    { id: "elec_utl_01", name: "Volt Dash", type: "utility", rarity: "common", target_count: "single", cooldown_base: 10, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "ASPD boost", base_value: 25, scaling_per_level: 1.5, unit: "% ASPD", duration_fixed: 5 }, { trigger: "always", description: "Crit Rate boost", base_value: 10, scaling_per_level: 1, unit: "% Crit Rate", duration_fixed: 5 }] },
    { id: "elec_utl_02", name: "Charge Up", type: "utility", rarity: "common", target_count: "single", cooldown_base: 8, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "ATK boost", base_value: 30, scaling_per_level: 2, unit: "% ATK", duration_fixed: 4 }, { trigger: "unlock_level_5", description: "Next attack guaranteed Shock", base_value: 0, scaling_per_level: 0, unit: "special", status: "shock", duration_fixed: 3 }] },
    { id: "elec_dmg_03", name: "Thunder Strike", type: "damage", rarity: "rare", target_count: "single", cooldown_base: 9, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Thunder slam", base_value: 180, scaling_per_level: 6, unit: "% ATK" }, { trigger: "always", description: "Paralyze chance", base_value: 35, scaling_per_level: 2, unit: "% chance", status: "paralyze", duration_fixed: 1.5 }] },
    { id: "elec_dmg_04", name: "Storm Strike", type: "damage", rarity: "rare", target_count: "random", cooldown_base: 11, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Storm cloud strikes every 1s for 3s", base_value: 90, scaling_per_level: 3.5, unit: "% ATK per strike", hits: 3 }, { trigger: "per_strike", description: "Shock chance per strike", base_value: 30, scaling_per_level: 1.5, unit: "% chance", status: "shock", duration_fixed: 3 }] },
    { id: "elec_def_01", name: "Static Field", type: "defense", rarity: "rare", target_count: "single", cooldown_base: 11, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Damage reduction", base_value: 25, scaling_per_level: 2, unit: "% reduction", duration_fixed: 4 }, { trigger: "on_hit_received", description: "Shock attacker chance", base_value: 40, scaling_per_level: 1.5, unit: "% chance", status: "shock", duration_fixed: 3 }, { trigger: "on_hit_received", description: "Paralyze attacker chance", base_value: 20, scaling_per_level: 1, unit: "% chance", status: "paralyze", duration_fixed: 1.5 }] },
    { id: "elec_dmg_05", name: "Chain Lightning", type: "damage", rarity: "epic", target_count: "chain_aoe", cooldown_base: 13, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Chain lightning, -15% decay per enemy (max 4)", base_value: 250, scaling_per_level: 6, unit: "% ATK (1st)" }, { trigger: "always", description: "Shock chance per chain", base_value: 45, scaling_per_level: 2, unit: "% chance", status: "shock", duration_fixed: 3 }] },
    { id: "elec_utl_03", name: "Overcharge", type: "utility", rarity: "epic", target_count: "single", cooldown_base: 14, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "All Electric Damage boost", base_value: 50, scaling_per_level: 5, unit: "% Elec Dmg boost", duration_fixed: 8 }, { trigger: "always", description: "ASPD boost", base_value: 30, scaling_per_level: 2, unit: "% ASPD", duration_fixed: 8 }, { trigger: "always", description: "Crit Damage boost", base_value: 25, scaling_per_level: 5, unit: "% Crit Dmg", duration_fixed: 8 }] },
    { id: "elec_dmg_06", name: "God's Wrath", type: "damage", rarity: "legendary", target_count: "single", cooldown_base: 18, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Divine lightning (1st always)", base_value: 350, scaling_per_level: 10, unit: "% ATK" }, { trigger: "unlock_level_4", description: "2nd strike (40% chance)", base_value: 200, scaling_per_level: 8, unit: "% ATK" }, { trigger: "unlock_level_8", description: "3rd strike (20% chance)", base_value: 100, scaling_per_level: 5, unit: "% ATK" }, { trigger: "always", description: "Paralyze chance", base_value: 70, scaling_per_level: 3, unit: "% chance", status: "paralyze", duration_fixed: 2 }] },
    { id: "elec_dmg_07", name: "Plasma Storm", type: "damage", rarity: "legendary", target_count: "aoe", cooldown_base: 20, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Plasma wave AoE", base_value: 350, scaling_per_level: 10, unit: "% ATK" }, { trigger: "always", description: "Guaranteed Shock (DoT 6s)", base_value: 0, scaling_per_level: 0, unit: "special", status: "shock", duration_fixed: 6 }, { trigger: "always", description: "Paralyze chance", base_value: 70, scaling_per_level: 3, unit: "% chance", status: "paralyze", duration_fixed: 2 }] },
  ],
  metal: [
    { id: "metal_dmg_01", name: "Iron Slash", type: "damage", rarity: "common", target_count: "single", cooldown_base: 7, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Metal blade slash", base_value: 130, scaling_per_level: 4, unit: "% ATK" }, { trigger: "unlock_level_5", description: "Bleed chance", base_value: 10, scaling_per_level: 1, unit: "% chance", status: "bleed", duration_fixed: 3 }] },
    { id: "metal_def_01", name: "Iron Wall", type: "defense", rarity: "common", target_count: "single", cooldown_base: 8, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Damage reduction", base_value: 25, scaling_per_level: 2, unit: "% reduction", duration_fixed: 4 }] },
    { id: "metal_def_02", name: "Spike Armor", type: "defense", rarity: "common", target_count: "single", cooldown_base: 9, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Reflect damage to attacker", base_value: 20, scaling_per_level: 2, unit: "% reflect", duration_fixed: 4 }, { trigger: "unlock_level_5", description: "Bleed attacker chance", base_value: 15, scaling_per_level: 1, unit: "% chance", status: "bleed", duration_fixed: 3 }] },
    { id: "metal_utl_01", name: "Fortify", type: "utility", rarity: "common", target_count: "single", cooldown_base: 10, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "DEF boost", base_value: 30, scaling_per_level: 2, unit: "% DEF", duration_fixed: 5 }] },
    { id: "metal_dmg_02", name: "Blade Storm", type: "damage", rarity: "rare", target_count: "aoe", cooldown_base: 10, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Metal blade spin AoE", base_value: 180, scaling_per_level: 6, unit: "% ATK" }, { trigger: "always", description: "Armor Break chance", base_value: 35, scaling_per_level: 2, unit: "% chance", status: "armor_break", duration_fixed: 4 }] },
    { id: "metal_def_03", name: "Fortress Shield", type: "defense", rarity: "rare", target_count: "single", cooldown_base: 11, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Shield equal to % DEF", base_value: 100, scaling_per_level: 5, unit: "% DEF as shield", duration_fixed: 5 }, { trigger: "on_hit_received", description: "Bleed attacker chance", base_value: 30, scaling_per_level: 1.5, unit: "% chance", status: "bleed", duration_fixed: 3 }] },
    { id: "metal_utl_02", name: "Steel Resolve", type: "utility", rarity: "rare", target_count: "single", cooldown_base: 12, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "DEF boost", base_value: 40, scaling_per_level: 2, unit: "% DEF", duration_fixed: 6 }, { trigger: "always", description: "Recovery effect boost", base_value: 20, scaling_per_level: 1.5, unit: "% recovery boost", duration_fixed: 6 }] },
    { id: "metal_dmg_03", name: "Magnetic Trap", type: "damage", rarity: "epic", target_count: "aoe", cooldown_base: 14, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Immobilize + DoT every 0.5s for 2s (4 hits)", base_value: 70, scaling_per_level: 3, unit: "% ATK per hit", hits: 4 }, { trigger: "on_trap_end", description: "Armor Break on all trapped", base_value: 60, scaling_per_level: 2, unit: "% chance", status: "armor_break", duration_fixed: 5 }] },
    { id: "metal_def_04", name: "Titanium Fortress", type: "defense", rarity: "epic", target_count: "aoe", cooldown_base: 14, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Metal wall (200% DEF durability)", base_value: 200, scaling_per_level: 8, unit: "% DEF wall", duration_fixed: 4 }, { trigger: "on_wall_break", description: "Bleed chance on break", base_value: 50, scaling_per_level: 2, unit: "% chance", status: "bleed", duration_fixed: 3 }] },
    { id: "metal_dmg_04", name: "Iron Emperor", type: "damage", rarity: "legendary", target_count: "aoe", cooldown_base: 20, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Summon Metal Titan (AoE/sec for 6s+0.5/lvl)", base_value: 70, scaling_per_level: 2.5, unit: "% ATK/sec" }, { trigger: "on_summon", description: "Guaranteed Armor Break", base_value: 0, scaling_per_level: 0, unit: "special", status: "armor_break", duration_fixed: 6 }, { trigger: "per_titan_hit", description: "Bleed chance per hit", base_value: 60, scaling_per_level: 2, unit: "% chance", status: "bleed", duration_fixed: 4 }] },
    { id: "metal_def_05", name: "Fortress Absolute", type: "defense", rarity: "legendary", target_count: "single", cooldown_base: 18, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Shield equal to % DEF", base_value: 300, scaling_per_level: 10, unit: "% DEF as shield", duration_fixed: 8 }, { trigger: "always", description: "Damage reduction", base_value: 40, scaling_per_level: 2, unit: "% reduction", duration_fixed: 8 }, { trigger: "always", description: "Recovery boost", base_value: 50, scaling_per_level: 3, unit: "% recovery boost", duration_fixed: 8 }, { trigger: "on_hit_received", description: "Bleed attacker chance", base_value: 40, scaling_per_level: 2, unit: "% chance", status: "bleed", duration_fixed: 4 }] },
  ],
  psychic: [
    { id: "psyc_dmg_01", name: "Mind Spike", type: "damage", rarity: "common", target_count: "single", cooldown_base: 7, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Psychic wave damage", base_value: 120, scaling_per_level: 4, unit: "% ATK" }, { trigger: "unlock_level_5", description: "Confuse chance", base_value: 10, scaling_per_level: 1, unit: "% chance", status: "confuse", duration_fixed: 3 }] },
    { id: "psyc_def_01", name: "Psychic Veil", type: "defense", rarity: "common", target_count: "single", cooldown_base: 8, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Psychic damage reduction", base_value: 20, scaling_per_level: 2, unit: "% reduction", duration_fixed: 4 }, { trigger: "unlock_level_5", description: "Mind Break attacker chance", base_value: 15, scaling_per_level: 1, unit: "% chance", status: "mind_break", duration_fixed: 3 }] },
    { id: "psyc_utl_01", name: "Distortion", type: "utility", rarity: "common", target_count: "single", cooldown_base: 8, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Enemy ATK debuff", base_value: -20, scaling_per_level: -1.5, unit: "% ATK reduction", duration_fixed: 5 }] },
    { id: "psyc_dmg_02", name: "Psionic Burst", type: "damage", rarity: "rare", target_count: "aoe", cooldown_base: 10, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Psychic shockwave AoE", base_value: 180, scaling_per_level: 6, unit: "% ATK" }, { trigger: "always", description: "Confuse chance", base_value: 35, scaling_per_level: 2, unit: "% chance", status: "confuse", duration_fixed: 4 }] },
    { id: "psyc_def_02", name: "Echo Shield", type: "defense", rarity: "rare", target_count: "aoe", cooldown_base: 11, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Repel all enemies (3s+0.25/lvl)", base_value: 3, scaling_per_level: 0.25, unit: "sec repel" }, { trigger: "on_repel", description: "Mind Break repelled enemies", base_value: 35, scaling_per_level: 1.5, unit: "% chance", status: "mind_break", duration_fixed: 4 }] },
    { id: "psyc_utl_02", name: "Mind Shatter", type: "utility", rarity: "rare", target_count: "single", cooldown_base: 12, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "ATK debuff", base_value: -35, scaling_per_level: -2, unit: "% ATK reduction", duration_fixed: 6 }, { trigger: "always", description: "ASPD debuff", base_value: -20, scaling_per_level: -1.5, unit: "% ASPD reduction", duration_fixed: 6 }] },
    { id: "psyc_dmg_03", name: "Psychic Storm", type: "damage", rarity: "epic", target_count: "aoe", cooldown_base: 13, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Psychic waves every 1s for 3s", base_value: 80, scaling_per_level: 5, unit: "% ATK per wave", hits: 3 }, { trigger: "per_wave", description: "Confuse chance per wave", base_value: 50, scaling_per_level: 2, unit: "% chance", status: "confuse", duration_fixed: 4 }] },
    { id: "psyc_utl_03", name: "Mind Domination", type: "utility", rarity: "epic", target_count: "single", cooldown_base: 14, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Force attack allies (3s+0.125/lvl, solo=self)", base_value: 3, scaling_per_level: 0.125, unit: "sec domination" }, { trigger: "on_control_end", description: "ATK+DEF debuff after control ends", base_value: -30, scaling_per_level: -2, unit: "% ATK/DEF reduction", duration_fixed: 3 }] },
    { id: "psyc_utl_04", name: "Psychic Collapse", type: "utility", rarity: "legendary", target_count: "single", cooldown_base: 20, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "ALL debuffs: -ATK/-DEF/-ASPD/Confuse/No Heal/No Ability", base_value: -40, scaling_per_level: -2, unit: "% ATK+DEF reduction", duration_fixed: 5 }, { trigger: "on_debuff_end", description: "Vulnerability window (all dmg amplified)", base_value: 50, scaling_per_level: 2, unit: "% dmg amplification", duration_fixed: 3 }] },
  ],
  light: [
    { id: "lght_dmg_01", name: "Holy Bolt", type: "damage", rarity: "common", target_count: "single", cooldown_base: 7, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Holy light bolt", base_value: 120, scaling_per_level: 4, unit: "% ATK" }, { trigger: "unlock_level_5", description: "Blind chance", base_value: 10, scaling_per_level: 1, unit: "% chance", status: "blind", duration_fixed: 3 }] },
    { id: "lght_def_01", name: "Light Barrier", type: "defense", rarity: "common", target_count: "single", cooldown_base: 8, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Holy light damage reduction", base_value: 20, scaling_per_level: 2, unit: "% reduction", duration_fixed: 4 }, { trigger: "unlock_level_5", description: "Purify self (cleanse 1 debuff)", base_value: 0, scaling_per_level: 0, unit: "special" }] },
    { id: "lght_utl_01", name: "Radiance", type: "utility", rarity: "common", target_count: "single", cooldown_base: 9, cooldown_scaling: -0.05, effects: [{ trigger: "always", description: "Heal self", base_value: 50, scaling_per_level: 3, unit: "% ATK as HP" }] },
    { id: "lght_dmg_02", name: "Solar Flare", type: "damage", rarity: "rare", target_count: "aoe", cooldown_base: 10, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Solar burst AoE", base_value: 180, scaling_per_level: 6, unit: "% ATK" }, { trigger: "always", description: "Blind chance", base_value: 35, scaling_per_level: 2, unit: "% chance", status: "blind", duration_fixed: 4 }] },
    { id: "lght_def_02", name: "Holy Shield", type: "defense", rarity: "rare", target_count: "single", cooldown_base: 11, cooldown_scaling: -0.08, effects: [{ trigger: "always", description: "Shield equal to % ATK", base_value: 120, scaling_per_level: 5, unit: "% ATK as shield", duration_fixed: 5 }, { trigger: "on_activate", description: "Purify up to 2 debuffs", base_value: 0, scaling_per_level: 0, unit: "special" }] },
    { id: "lght_utl_02", name: "Blessing", type: "utility", rarity: "rare", target_count: "single", cooldown_base: 12, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Heal self", base_value: 100, scaling_per_level: 5, unit: "% ATK as HP" }, { trigger: "always", description: "Recovery effect boost", base_value: 20, scaling_per_level: 1.5, unit: "% recovery boost", duration_fixed: 6 }] },
    { id: "lght_dmg_03", name: "Divine Judgment", type: "damage", rarity: "epic", target_count: "aoe", cooldown_base: 13, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "4 divine beams simultaneously", base_value: 70, scaling_per_level: 4, unit: "% ATK per beam", hits: 4 }, { trigger: "on_hit", description: "Gain shield = 50% total damage dealt", base_value: 50, scaling_per_level: 0, unit: "% dmg as shield", duration_fixed: 4 }] },
    { id: "lght_dmg_04", name: "Holy Guardian", type: "damage", rarity: "epic", target_count: "aoe", cooldown_base: 15, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Summon Holy Guardian (AoE/sec for 6s+0.5/lvl)", base_value: 60, scaling_per_level: 3, unit: "% ATK/sec" }, { trigger: "per_guardian_hit", description: "Guardian heals Hero every 2s", base_value: 15, scaling_per_level: 2, unit: "% ATK/2s" }, { trigger: "per_guardian_hit", description: "Blind chance per hit", base_value: 50, scaling_per_level: 2, unit: "% chance", status: "blind", duration_fixed: 4 }] },
    { id: "lght_utl_03", name: "Divine Ascension", type: "utility", rarity: "legendary", target_count: "single", cooldown_base: 20, cooldown_scaling: -0.1, effects: [{ trigger: "always", description: "Divine state (8s+0.5/lvl): +Light Dmg/Heal/DR/Debuff Immune/ASPD", base_value: 50, scaling_per_level: 3, unit: "% Light Dmg boost" }, { trigger: "on_state_end", description: "Holy explosion AoE + 100% Blind 5s", base_value: 200, scaling_per_level: 8, unit: "% ATK AoE" }] },
  ],
};

const ELEMENT_CONFIG = {
  fire:     { icon: "🔥", color: "#ff6b35", bg: "#1a0a00", accent: "#ff4500", glow: "#ff6b3555" },
  water:    { icon: "🌊", color: "#4fc3f7", bg: "#00101a", accent: "#0288d1", glow: "#4fc3f755" },
  electric: { icon: "⚡", color: "#ffd740", bg: "#0d0d00", accent: "#ffc400", glow: "#ffd74055" },
  metal:    { icon: "⛓️", color: "#b0bec5", bg: "#0a0d0f", accent: "#78909c", glow: "#b0bec555" },
  psychic:  { icon: "🧠", color: "#ce93d8", bg: "#0d0010", accent: "#ab47bc", glow: "#ce93d855" },
  light:    { icon: "✨", color: "#fff176", bg: "#0d0d00", accent: "#f9a825", glow: "#fff17655" },
};

const RARITY_CONFIG = {
  common:    { color: "#9e9e9e", label: "COMMON",    border: "#424242" },
  rare:      { color: "#42a5f5", label: "RARE",      border: "#1565c0" },
  epic:      { color: "#ab47bc", label: "EPIC",      border: "#6a1b9a" },
  legendary: { color: "#ffa726", label: "LEGENDARY", border: "#e65100" },
};

const TYPE_CONFIG = {
  damage:  { icon: "⚔️", color: "#ef5350" },
  defense: { icon: "🛡️", color: "#42a5f5" },
  utility: { icon: "⚙️", color: "#66bb6a" },
};

function calcAtLevel(base, scaling, level) {
  return base + scaling * (level - 1);
}

function calcCooldown(base, scaling, level) {
  return Math.max(1, base + scaling * (level - 1));
}

function getEffectDisplay(effect, level) {
  if (effect.base_value === 0 && effect.scaling_per_level === 0) return null;
  const val = calcAtLevel(effect.base_value, effect.scaling_per_level, level);
  const hits = effect.hits || 1;
  const total = Math.abs(val) * hits;
  return { val, total, hits };
}

function isUnlocked(trigger, level) {
  if (trigger === "always" || trigger === "on_wall_break" || trigger === "on_trap_end"
    || trigger === "on_hit_received" || trigger === "on_hit" || trigger === "on_activate"
    || trigger === "on_summon" || trigger === "per_titan_hit" || trigger === "per_strike"
    || trigger === "per_wave" || trigger === "per_guardian_hit" || trigger === "on_repel"
    || trigger === "on_control_end" || trigger === "on_debuff_end" || trigger === "on_state_end"
    || trigger === "on_overheal") return true;
  if (trigger === "unlock_level_4") return level >= 4;
  if (trigger === "unlock_level_5") return level >= 5;
  if (trigger === "unlock_level_8") return level >= 8;
  return true;
}

export default function SkillViewer() {
  const [selectedElement, setSelectedElement] = useState("fire");
  const [selectedSkillId, setSelectedSkillId] = useState("fire_dmg_01");
  const [level, setLevel] = useState(1);
  const [filterType, setFilterType] = useState("all");

  const elCfg = ELEMENT_CONFIG[selectedElement];
  const skills = SKILL_DATA[selectedElement] || [];
  const filtered = filterType === "all" ? skills : skills.filter(s => s.type === filterType);
  const skill = skills.find(s => s.id === selectedSkillId) || filtered[0];
  const rCfg = skill ? RARITY_CONFIG[skill.rarity] : RARITY_CONFIG.common;

  const cooldown = skill ? calcCooldown(skill.cooldown_base, skill.cooldown_scaling, level) : 0;
  const affinityPerUse = skill
    ? { common: 0.2, rare: 0.3, epic: 0.5, legendary: 1.0 }[skill.rarity]
    : 0;

  const styles = {
    app: {
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 20% 20%, ${elCfg.glow}, transparent 50%), radial-gradient(ellipse at 80% 80%, ${elCfg.glow}, transparent 50%), #080b10`,
      fontFamily: "'Courier New', monospace",
      color: "#e0e0e0",
      padding: "0",
      transition: "background 0.5s ease",
    },
    header: {
      padding: "16px 20px 12px",
      borderBottom: `1px solid ${elCfg.color}33`,
      background: "#080b10cc",
      backdropFilter: "blur(10px)",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    title: {
      fontSize: "11px",
      letterSpacing: "4px",
      color: elCfg.color,
      margin: "0 0 12px",
      textTransform: "uppercase",
    },
    elementRow: {
      display: "flex",
      gap: "6px",
      flexWrap: "wrap",
    },
    elBtn: (el) => ({
      padding: "5px 10px",
      borderRadius: "4px",
      border: `1px solid ${selectedElement === el ? ELEMENT_CONFIG[el].color : "#333"}`,
      background: selectedElement === el ? `${ELEMENT_CONFIG[el].color}22` : "transparent",
      color: selectedElement === el ? ELEMENT_CONFIG[el].color : "#666",
      cursor: "pointer",
      fontSize: "11px",
      letterSpacing: "1px",
      transition: "all 0.2s",
    }),
    body: {
      display: "grid",
      gridTemplateColumns: "220px 1fr",
      minHeight: "calc(100vh - 90px)",
    },
    sidebar: {
      borderRight: `1px solid ${elCfg.color}22`,
      padding: "12px",
      overflowY: "auto",
    },
    filterRow: {
      display: "flex",
      gap: "4px",
      marginBottom: "10px",
    },
    filterBtn: (t) => ({
      flex: 1,
      padding: "4px",
      fontSize: "9px",
      letterSpacing: "1px",
      border: `1px solid ${filterType === t ? elCfg.color : "#333"}`,
      background: filterType === t ? `${elCfg.color}22` : "transparent",
      color: filterType === t ? elCfg.color : "#555",
      cursor: "pointer",
      borderRadius: "3px",
      textTransform: "uppercase",
    }),
    skillCard: (sk) => ({
      padding: "8px 10px",
      marginBottom: "4px",
      borderRadius: "4px",
      border: `1px solid ${selectedSkillId === sk.id ? RARITY_CONFIG[sk.rarity].color : "#1e1e1e"}`,
      background: selectedSkillId === sk.id ? `${RARITY_CONFIG[sk.rarity].color}15` : "#0e1118",
      cursor: "pointer",
      transition: "all 0.15s",
    }),
    skillCardName: { fontSize: "11px", fontWeight: "bold", marginBottom: "3px" },
    skillCardMeta: { display: "flex", gap: "6px", alignItems: "center" },
    rarityDot: (r) => ({
      width: "6px", height: "6px", borderRadius: "50%",
      background: RARITY_CONFIG[r].color, flexShrink: 0,
    }),
    detail: {
      padding: "20px 24px",
      overflowY: "auto",
    },
    skillHeader: {
      display: "flex",
      alignItems: "flex-start",
      gap: "16px",
      marginBottom: "20px",
    },
    skillIcon: {
      width: "56px", height: "56px",
      borderRadius: "8px",
      border: `2px solid ${rCfg.color}`,
      background: `${rCfg.color}15`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      boxShadow: `0 0 20px ${rCfg.color}44`,
      flexShrink: 0,
    },
    skillName: {
      fontSize: "20px",
      fontWeight: "bold",
      color: rCfg.color,
      marginBottom: "4px",
      letterSpacing: "1px",
    },
    badgeRow: { display: "flex", gap: "6px", flexWrap: "wrap" },
    badge: (color, bg) => ({
      padding: "2px 8px",
      borderRadius: "3px",
      fontSize: "9px",
      letterSpacing: "2px",
      border: `1px solid ${color}`,
      color: color,
      background: bg || "transparent",
      textTransform: "uppercase",
    }),
    levelSection: {
      background: "#0e1118",
      border: `1px solid ${elCfg.color}33`,
      borderRadius: "8px",
      padding: "14px 16px",
      marginBottom: "16px",
    },
    levelLabel: { fontSize: "9px", letterSpacing: "3px", color: "#555", marginBottom: "10px", textTransform: "uppercase" },
    levelRow: { display: "flex", gap: "4px", marginBottom: "10px", flexWrap: "wrap" },
    lvlBtn: (l) => ({
      width: "28px", height: "28px",
      borderRadius: "4px",
      border: `1px solid ${level === l ? elCfg.color : "#2a2a2a"}`,
      background: level === l ? `${elCfg.color}33` : level < l ? "#0a0a0a" : "#141820",
      color: level === l ? elCfg.color : level < l ? "#333" : "#888",
      cursor: "pointer",
      fontSize: "10px",
      fontWeight: level === l ? "bold" : "normal",
      display: "flex", alignItems: "center", justifyContent: "center",
    }),
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
      marginBottom: "16px",
    },
    statBox: {
      background: "#0e1118",
      border: `1px solid #1e2530`,
      borderRadius: "6px",
      padding: "10px 12px",
    },
    statLabel: { fontSize: "8px", letterSpacing: "2px", color: "#555", marginBottom: "4px", textTransform: "uppercase" },
    statValue: (color) => ({ fontSize: "18px", fontWeight: "bold", color: color || elCfg.color }),
    statSub: { fontSize: "9px", color: "#444", marginTop: "2px" },
    effectsSection: { marginBottom: "16px" },
    effectLabel: { fontSize: "9px", letterSpacing: "3px", color: "#555", marginBottom: "8px", textTransform: "uppercase" },
    effectRow: (locked) => ({
      background: locked ? "#0a0a0a" : "#0e1118",
      border: `1px solid ${locked ? "#1a1a1a" : "#1e2530"}`,
      borderRadius: "6px",
      padding: "10px 12px",
      marginBottom: "6px",
      opacity: locked ? 0.4 : 1,
    }),
    effectDesc: { fontSize: "11px", color: "#aaa", marginBottom: "4px" },
    effectVal: { fontSize: "15px", fontWeight: "bold" },
    triggerTag: (locked) => ({
      fontSize: "8px",
      letterSpacing: "1px",
      color: locked ? "#444" : "#555",
      textTransform: "uppercase",
      marginBottom: "4px",
    }),
    outlierBanner: {
      background: "#1a0f00",
      border: "1px solid #ff6b35",
      borderRadius: "6px",
      padding: "10px 12px",
      marginBottom: "16px",
      fontSize: "10px",
      color: "#ff6b35",
      letterSpacing: "0.5px",
    },
  };

  const detectOutlier = (sk, lv) => {
    if (!sk) return null;
    const issues = [];
    const mainEffect = sk.effects[0];
    if (mainEffect && mainEffect.base_value > 0 && mainEffect.unit?.includes("% ATK")) {
      const dmg = calcAtLevel(mainEffect.base_value, mainEffect.scaling_per_level, lv);
      const hits = mainEffect.hits || 1;
      const total = dmg * hits;
      const cd = calcCooldown(sk.cooldown_base, sk.cooldown_scaling, lv);
      const dps = (total / cd).toFixed(1);
      if (sk.rarity === "common" && total > 200) issues.push(`⚠ Total dmg ${total.toFixed(0)}% ATK exceeds Common ceiling (~200%)`);
      if (sk.rarity === "rare" && total > 400) issues.push(`⚠ Total dmg ${total.toFixed(0)}% ATK exceeds Rare ceiling (~400%)`);
      if (sk.rarity === "legendary" && sk.type === "damage" && total < 250) issues.push(`⚠ Total dmg ${total.toFixed(0)}% ATK below Legendary floor (~300%)`);
      if (parseFloat(dps) > 50 && sk.rarity === "common") issues.push(`⚠ DPS ${dps}%/s seems high for Common rarity`);
    }
    return issues.length > 0 ? issues : null;
  };

  const outliers = skill ? detectOutlier(skill, level) : null;

  if (!skill) return <div style={styles.app}><div style={{ padding: 40, color: "#666" }}>Select a skill</div></div>;

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>◈ Idle Cube RPG — Skill Viewer</div>
        <div style={styles.elementRow}>
          {Object.entries(ELEMENT_CONFIG).map(([el, cfg]) => (
            <button key={el} style={styles.elBtn(el)}
              onClick={() => {
                setSelectedElement(el);
                setSelectedSkillId(SKILL_DATA[el][0].id);
                setFilterType("all");
              }}>
              {cfg.icon} {el.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.body}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.filterRow}>
            {["all","damage","defense","utility"].map(t => (
              <button key={t} style={styles.filterBtn(t)} onClick={() => setFilterType(t)}>
                {t === "all" ? "ALL" : TYPE_CONFIG[t]?.icon}
              </button>
            ))}
          </div>
          {filtered.map(sk => (
            <div key={sk.id} style={styles.skillCard(sk)}
              onClick={() => setSelectedSkillId(sk.id)}>
              <div style={{ ...styles.skillCardName, color: selectedSkillId === sk.id ? RARITY_CONFIG[sk.rarity].color : "#ccc" }}>
                {sk.name}
              </div>
              <div style={styles.skillCardMeta}>
                <div style={styles.rarityDot(sk.rarity)} />
                <span style={{ fontSize: "9px", color: "#555", letterSpacing: "1px" }}>
                  {TYPE_CONFIG[sk.type]?.icon} {sk.target_count?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div style={styles.detail}>
          {/* Skill Header */}
          <div style={styles.skillHeader}>
            <div style={styles.skillIcon}>{elCfg.icon}</div>
            <div>
              <div style={styles.skillName}>{skill.name}</div>
              <div style={styles.badgeRow}>
                <span style={styles.badge(rCfg.color)}>{rCfg.label}</span>
                <span style={styles.badge(TYPE_CONFIG[skill.type].color)}>{TYPE_CONFIG[skill.type].icon} {skill.type.toUpperCase()}</span>
                <span style={styles.badge("#555")}>{skill.target_count?.toUpperCase()}</span>
                <span style={styles.badge(elCfg.color)}>{elCfg.icon} {selectedElement.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Outlier Warning */}
          {outliers && (
            <div style={styles.outlierBanner}>
              {outliers.map((o, i) => <div key={i}>{o}</div>)}
            </div>
          )}

          {/* Level Selector */}
          <div style={styles.levelSection}>
            <div style={styles.levelLabel}>Skill Level</div>
            <div style={styles.levelRow}>
              {Array.from({length: 10}, (_, i) => i + 1).map(l => (
                <button key={l} style={styles.lvlBtn(l)} onClick={() => setLevel(l)}>{l}</button>
              ))}
            </div>
          </div>

          {/* Key Stats Grid */}
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Cooldown</div>
              <div style={styles.statValue("#4fc3f7")}>{cooldown.toFixed(2)}<span style={{fontSize:11,color:"#555"}}>s</span></div>
              <div style={styles.statSub}>Base {skill.cooldown_base}s → -{Math.abs(skill.cooldown_scaling * (level-1)).toFixed(2)}s</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Affinity / Use</div>
              <div style={styles.statValue(elCfg.color)}>+{affinityPerUse}</div>
              <div style={styles.statSub}>{skill.rarity} rarity fixed</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Uses / 30s Battle</div>
              <div style={styles.statValue("#66bb6a")}>{Math.floor(30 / cooldown)}</div>
              <div style={styles.statSub}>≈ {(Math.floor(30 / cooldown) * affinityPerUse).toFixed(1)} affinity/battle</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>ID</div>
              <div style={{ fontSize: 10, color: "#444", wordBreak: "break-all", marginTop: 2 }}>{skill.id}</div>
            </div>
          </div>

          {/* Effects */}
          <div style={styles.effectsSection}>
            <div style={styles.effectLabel}>Effects</div>
            {skill.effects.map((eff, i) => {
              const locked = !isUnlocked(eff.trigger, level);
              const calc = getEffectDisplay(eff, level);
              return (
                <div key={i} style={styles.effectRow(locked)}>
                  <div style={styles.triggerTag(locked)}>
                    {locked ? `🔒 ${eff.trigger.replace(/_/g," ")}` : `◆ ${eff.trigger.replace(/_/g," ")}`}
                  </div>
                  <div style={styles.effectDesc}>{eff.description}</div>
                  {calc && (
                    <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                      <span style={{ ...styles.effectVal, color: eff.base_value < 0 ? "#ef5350" : elCfg.color }}>
                        {eff.base_value < 0 ? "" : "+"}{calc.val.toFixed(1)}{eff.unit?.replace("% ATK","").replace("% chance","").replace("% reduction","").replace("% DEF","").replace("% ASPD","") || ""}
                        <span style={{ fontSize: 10, color: "#555" }}> {eff.unit}</span>
                      </span>
                      {calc.hits > 1 && (
                        <span style={{ fontSize: 11, color: "#888" }}>
                          × {calc.hits} hits = <span style={{ color: elCfg.color, fontWeight: "bold" }}>{calc.total.toFixed(0)}% ATK total</span>
                        </span>
                      )}
                      {eff.duration_fixed && (
                        <span style={{ fontSize: 10, color: "#444" }}>• {eff.duration_fixed}s</span>
                      )}
                      {eff.status && (
                        <span style={{ fontSize: 9, letterSpacing: 1, color: "#666", border: "1px solid #333", padding: "1px 5px", borderRadius: 2 }}>
                          {eff.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}
                  {!calc && (
                    <div style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>Special mechanic</div>
                  )}
                  {eff.scaling_per_level !== 0 && (
                    <div style={{ fontSize: 9, color: "#444", marginTop: 4 }}>
                      {eff.base_value < 0 ? "" : "+"}{eff.base_value} base · {eff.scaling_per_level > 0 ? "+" : ""}{eff.scaling_per_level}/level
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
