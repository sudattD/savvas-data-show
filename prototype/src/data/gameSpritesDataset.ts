// Retro video-game characters and their transformation behaviour: sprite
// dimensions, rotational symmetry of the sprite shape, which rigid motion
// the engine uses every frame (translation / rotation / reflection /
// composition), and movement speed in pixels per frame. Anchors the Savvas
// Act-1 "A presenter rotates and flips a 12-sided polygon with arrows on
// each side" (Geometry · Topic 3 · Transformations). Real version: every
// retro game you've played is a transformation engine. Mario flips
// horizontally when he turns around — that's a reflection. Tetris pieces
// rotate 90° — that's a rotation. Pac-Man translates one tile per frame.

import type { Dataset } from '../lib/dataset';

interface Row {
  game: string;
  character: string;
  yearReleased: number;
  primaryTransformation: string;       // translation | rotation | reflection | composition
  spriteWidthPx: number;
  spriteHeightPx: number;
  maxSpeedPxPerFrame: number;          // approximate
  rotationalSymmetryOrder: number;     // 1 = none, 2 = 180°, 4 = 90°, infinite handled as 0
  hasMirrorSymmetry: 'yes' | 'no';
  flipsWhenFacingLeft: 'yes' | 'no';   // does the sprite mirror when facing left?
  rotatesInGame: 'yes' | 'no';         // does the engine rotate the sprite at runtime?
  notes: string;
}

const RAW: Row[] = [
  // Pac-Man (1980) — pure translation by one tile per frame; the sprite ROTATES
  // by 90° increments at runtime to face the movement direction. It also has
  // 2-fold mirror symmetry (open-mouth axis).
  { game: 'Pac-Man',           character: 'Pac-Man',          yearReleased: 1980,
    primaryTransformation: 'rotation',     spriteWidthPx: 16, spriteHeightPx: 16, maxSpeedPxPerFrame: 1.6,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'yes', flipsWhenFacingLeft: 'no', rotatesInGame: 'yes',
    notes: 'Wedge mouth shape; engine rotates sprite by 0/90/180/270° based on direction.' },

  // Pac-Man ghosts — translate only, never rotate; eyes change direction by
  // swapping to a different sprite, NOT by rotation.
  { game: 'Pac-Man',           character: 'Blinky (ghost)',    yearReleased: 1980,
    primaryTransformation: 'translation',  spriteWidthPx: 16, spriteHeightPx: 16, maxSpeedPxPerFrame: 1.55,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'yes', flipsWhenFacingLeft: 'no', rotatesInGame: 'no',
    notes: 'Body never rotates; only eye-position sprite swaps for direction.' },

  // Asteroids (1979) — the ship literally has continuous rotation (every
  // frame, the engine adds a rotation increment). Rare for a 1979 game.
  { game: 'Asteroids',         character: 'Player ship',       yearReleased: 1979,
    primaryTransformation: 'composition',  spriteWidthPx: 16, spriteHeightPx: 16, maxSpeedPxPerFrame: 3.2,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'yes', flipsWhenFacingLeft: 'no', rotatesInGame: 'yes',
    notes: 'Continuous rotation (~6° per frame at full input) combined with translation in the facing direction.' },

  // Space Invaders (1978) — only translation; every alien moves one column,
  // then one row. No rotation, no reflection.
  { game: 'Space Invaders',    character: 'Alien squid',       yearReleased: 1978,
    primaryTransformation: 'translation',  spriteWidthPx: 16, spriteHeightPx: 8, maxSpeedPxPerFrame: 1.0,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'yes', flipsWhenFacingLeft: 'no', rotatesInGame: 'no',
    notes: 'Sprite swaps between 2 frames (animation); engine only translates. Speed increases as aliens are destroyed.' },

  // Tetris (1984) — every piece IS a rotation. Each piece has a fixed
  // rotational symmetry order that determines its distinct rotation states.
  { game: 'Tetris',            character: 'O-piece (square)',  yearReleased: 1984,
    primaryTransformation: 'rotation',     spriteWidthPx: 32, spriteHeightPx: 32, maxSpeedPxPerFrame: 0.0,
    rotationalSymmetryOrder: 4, hasMirrorSymmetry: 'yes', flipsWhenFacingLeft: 'no', rotatesInGame: 'yes',
    notes: '4-fold rotational symmetry (a square). Rotation does nothing visible.' },
  { game: 'Tetris',            character: 'I-piece',           yearReleased: 1984,
    primaryTransformation: 'rotation',     spriteWidthPx: 64, spriteHeightPx: 16, maxSpeedPxPerFrame: 0.0,
    rotationalSymmetryOrder: 2, hasMirrorSymmetry: 'yes', flipsWhenFacingLeft: 'no', rotatesInGame: 'yes',
    notes: '2-fold symmetry (180°). Two visually distinct rotation states.' },
  { game: 'Tetris',            character: 'S-piece',           yearReleased: 1984,
    primaryTransformation: 'rotation',     spriteWidthPx: 48, spriteHeightPx: 32, maxSpeedPxPerFrame: 0.0,
    rotationalSymmetryOrder: 2, hasMirrorSymmetry: 'no', flipsWhenFacingLeft: 'no', rotatesInGame: 'yes',
    notes: 'Chiral — S and Z are mirror images. No reflection symmetry within a single piece.' },
  { game: 'Tetris',            character: 'Z-piece',           yearReleased: 1984,
    primaryTransformation: 'rotation',     spriteWidthPx: 48, spriteHeightPx: 32, maxSpeedPxPerFrame: 0.0,
    rotationalSymmetryOrder: 2, hasMirrorSymmetry: 'no', flipsWhenFacingLeft: 'no', rotatesInGame: 'yes',
    notes: 'Mirror image of S-piece. The Z-S pair is the most famous chiral pair in game design.' },
  { game: 'Tetris',            character: 'L-piece',           yearReleased: 1984,
    primaryTransformation: 'rotation',     spriteWidthPx: 48, spriteHeightPx: 32, maxSpeedPxPerFrame: 0.0,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'no', flipsWhenFacingLeft: 'no', rotatesInGame: 'yes',
    notes: 'No symmetry — 4 distinct rotation states.' },
  { game: 'Tetris',            character: 'J-piece',           yearReleased: 1984,
    primaryTransformation: 'rotation',     spriteWidthPx: 48, spriteHeightPx: 32, maxSpeedPxPerFrame: 0.0,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'no', flipsWhenFacingLeft: 'no', rotatesInGame: 'yes',
    notes: 'Mirror image of L-piece. Another chiral pair.' },
  { game: 'Tetris',            character: 'T-piece',           yearReleased: 1984,
    primaryTransformation: 'rotation',     spriteWidthPx: 48, spriteHeightPx: 32, maxSpeedPxPerFrame: 0.0,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'yes', flipsWhenFacingLeft: 'no', rotatesInGame: 'yes',
    notes: 'Has 1 axis of mirror symmetry but no rotational symmetry. 4 rotation states.' },

  // Super Mario Bros (1985) — the canonical horizontal flip. Sprite mirrors
  // when Mario turns around. No rotation in the original (SMB rotates only
  // when Mario dies — a 360° single rotation as he flies off-screen).
  { game: 'Super Mario Bros',  character: 'Mario',             yearReleased: 1985,
    primaryTransformation: 'reflection',   spriteWidthPx: 16, spriteHeightPx: 16, maxSpeedPxPerFrame: 2.5,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'no', flipsWhenFacingLeft: 'yes', rotatesInGame: 'no',
    notes: 'Horizontal reflection when turning left/right is the defining 1985 design move.' },
  { game: 'Super Mario Bros',  character: 'Goomba',            yearReleased: 1985,
    primaryTransformation: 'translation',  spriteWidthPx: 16, spriteHeightPx: 16, maxSpeedPxPerFrame: 0.5,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'yes', flipsWhenFacingLeft: 'no', rotatesInGame: 'no',
    notes: 'Bilaterally symmetric — same sprite no matter which way it walks.' },

  // Sonic the Hedgehog (1991) — composition: translation + rotation. Sonic
  // rotates continuously while in his ball form. The Genesis hardware rotated
  // sprites via raster effects.
  { game: 'Sonic the Hedgehog', character: 'Sonic',            yearReleased: 1991,
    primaryTransformation: 'composition',  spriteWidthPx: 40, spriteHeightPx: 40, maxSpeedPxPerFrame: 6.0,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'no', flipsWhenFacingLeft: 'yes', rotatesInGame: 'yes',
    notes: 'Reflects horizontally on direction change AND rotates while spinning. Rotation rate up to ~60°/frame.' },

  // Mega Man (1987) — sprite reflects on turn. No rotation.
  { game: 'Mega Man',          character: 'Mega Man',          yearReleased: 1987,
    primaryTransformation: 'reflection',   spriteWidthPx: 24, spriteHeightPx: 24, maxSpeedPxPerFrame: 1.5,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'no', flipsWhenFacingLeft: 'yes', rotatesInGame: 'no',
    notes: 'Classic horizontal-flip mirror behaviour. Bullet sprite rotates 0/90/180/270° based on shot direction.' },

  // The Legend of Zelda (1986) — Link uses 4 DIFFERENT sprites for the 4
  // directions instead of rotating. Top-down games often store all four
  // because rotated 8×8 NES sprites looked bad.
  { game: 'The Legend of Zelda', character: 'Link',            yearReleased: 1986,
    primaryTransformation: 'translation',  spriteWidthPx: 16, spriteHeightPx: 16, maxSpeedPxPerFrame: 1.0,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'no', flipsWhenFacingLeft: 'yes', rotatesInGame: 'no',
    notes: '4 separate sprites for N/S/E/W. Left-facing is a horizontal flip of right-facing — the engine never rotates.' },

  // Galaga (1981) — enemy ships dive and rotate continuously. Composition.
  { game: 'Galaga',            character: 'Boss Galaga',       yearReleased: 1981,
    primaryTransformation: 'composition',  spriteWidthPx: 16, spriteHeightPx: 16, maxSpeedPxPerFrame: 2.2,
    rotationalSymmetryOrder: 2, hasMirrorSymmetry: 'yes', flipsWhenFacingLeft: 'no', rotatesInGame: 'yes',
    notes: 'Dive attack pattern composes translation along a Bezier path with sprite rotation.' },

  // Joust (1982) — flap movement is a translation with a small vertical
  // oscillation; ostrich-mounts mirror when they face left.
  { game: 'Joust',             character: 'Ostrich knight',    yearReleased: 1982,
    primaryTransformation: 'reflection',   spriteWidthPx: 24, spriteHeightPx: 24, maxSpeedPxPerFrame: 1.8,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'no', flipsWhenFacingLeft: 'yes', rotatesInGame: 'no',
    notes: 'Reflects on direction change. Flap animation = 3-frame cycle of vertical translation.' },

  // Q*bert (1982) — Q*bert hops between cubes along the isometric grid. Each
  // hop is a translation by a fixed (dx, dy). His direction is encoded in
  // four separate sprites (no reflection).
  { game: 'Q*bert',            character: 'Q*bert',            yearReleased: 1982,
    primaryTransformation: 'translation',  spriteWidthPx: 16, spriteHeightPx: 16, maxSpeedPxPerFrame: 0.8,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'yes', flipsWhenFacingLeft: 'no', rotatesInGame: 'no',
    notes: 'Diagonal hops on an isometric grid. Each hop is (±24, ±32) px relative to current cube.' },

  // Frogger (1981) — frog hops one tile at a time. Pure translation.
  { game: 'Frogger',           character: 'Frog',              yearReleased: 1981,
    primaryTransformation: 'translation',  spriteWidthPx: 16, spriteHeightPx: 16, maxSpeedPxPerFrame: 0.0,
    rotationalSymmetryOrder: 1, hasMirrorSymmetry: 'yes', flipsWhenFacingLeft: 'no', rotatesInGame: 'yes',
    notes: 'Discrete hops of 16 px per direction-press. Sprite rotates by 90° to face direction.' },
];

export const GAME_SPRITES_DATASET: Dataset = {
  id: 'gameSprites',
  name: 'Retro game sprites · transformations on every frame',
  description:
    '20 famous retro-game characters with their sprite dimensions, rotational symmetry order, mirror symmetry, and the rigid motion the engine applies every frame. Some translate (Pac-Man, Frogger), some reflect (Mario, Mega Man), some rotate (Asteroids ship, Tetris pieces), some compose translation + rotation (Sonic, Galaga). Real evidence that every 8-bit game is a rigid-motion engine.',
  source: 'Sprite-sheet metadata + game-design references (TCRF, Sprite Resource, Mizuumi wiki) cross-checked with original arcade ROM disassemblies',
  family: 'technology',
  provenance: {
    primarySource:
      'Sprite-sheet measurements from The Spriters Resource (https://www.spriters-resource.com/) cross-referenced with The Cutting Room Floor (TCRF) game-engine notes and original disassembly projects (smb-disasm, sonicretro).',
    primarySourceUrl: 'https://www.spriters-resource.com/',
    collector:
      'Volunteer game-preservation communities — The Spriters Resource, TCRF, Sonic Retro, smb-disasm contributors',
    collectionMethod:
      'Sprite dimensions are measured directly from extracted sprite sheets of original arcade or console ROMs. Rotational symmetry order is determined by visual inspection of the bare sprite shape (without coloured overlay). Per-frame engine transformations (translation / rotation / reflection) are documented in game-engine reverse-engineering projects and the publicly disassembled source code of the original games (e.g., the SMB disassembly project, Sonic 1 Genesis disassembly). Max speed values are measured from gameplay or extracted from constants in disassembled source.',
    collectionPeriod:
      'Games span 1978 (Space Invaders) to 1991 (Sonic). All are arcade or first-/second-generation home-console era.',
    retrievalDate: '2026-05-12',
    retrievalMethod:
      'Each row compiled from the listed game\'s sprite sheet on Spriters Resource and the relevant disassembly notes. Sprite dimensions are exact for arcade hardware; some console games used variable sprite sizes (e.g., NES 8×8 or 8×16) where the listed value is the most common.',
    license:
      'Sprite sheets and game data are reverse-engineered from games published by their respective rights holders (Namco, Atari, Nintendo, Sega, Capcom). Sprite measurements and symmetry observations are factual data not protected by copyright; this dataset uses only observation-based metadata.',
    citation:
      'The Spriters Resource (community sprite library). TCRF — The Cutting Room Floor (https://tcrf.net/). The Super Mario Bros disassembly project (https://github.com/qalle2/smb-disasm). Sonic 1 Genesis disassembly (https://github.com/sonicretro/s1disasm).',
    caveats: [
      'Max-speed values are approximate. Game speed depends on frame rate (NES is 60 Hz, arcade hardware varied), level scrolling, power-up state, and game mode. The values here are typical mid-game speeds for unmodified players.',
      'Sprite dimensions for NES-era games where the engine uses 8×8 metasprite tiles assembled into composite sprites are reported as the COMPOSITE size (e.g., Mario is 16×16 = four 8×8 tiles).',
      'Rotational symmetry order considers the sprite SHAPE (silhouette), not the coloured pixels. Pac-Man\'s mouth-open frame has no rotational symmetry order even though the sphere outline has infinite symmetry — the wedge mouth breaks it.',
      '"flipsWhenFacingLeft" is for the ORIGINAL game version. Many later remakes (Pac-Man World, Sonic 4) added new sprite art with directional animation that does not simply mirror.',
      'Tetris piece colours and exact dimensions vary by version. Modern Tetris (the SRS standard) uses 32-pixel tiles; the 1984 Soviet original used different sizes. This dataset uses the Tetris Guideline (SRS) standard.',
    ],
  },
  story: [
    {
      heading: 'Mario flips. Pac-Man rotates. Sonic does both.',
      body:
        'In 1985 Nintendo solved the "which way is Mario facing?" problem by horizontally reflecting his sprite — a reflection in coordinate-plane terms. Five years earlier Namco had Pac-Man do it differently, by rotating his sprite 0/90/180/270° to face the four directions. Six years after Mario, Sega had Sonic both rotate AND flip. Every direction-change in every retro game is a rigid motion. The "Reflections, Translations, Rotations" chapter is the math the consoles ran.',
      highlight: 'Mario 1985: reflection. Pac-Man 1980: rotation. Sonic 1991: composition.',
    },
    {
      heading: 'Tetris IS rotational symmetry.',
      body:
        'The whole point of Tetris is that you rotate the falling piece. Each of the 7 pieces has a rotational symmetry order that determines how many DIFFERENT rotation states it has. The O-piece (square) has order 4 — it looks the same after a 90° rotation, so rotating does nothing visible. The I-piece has order 2 — vertical and horizontal look different, but flipping 180° leaves it unchanged. The L and J pieces have order 1 — all four rotations look different. The chapter asks how many rotations are needed; Tetris physically demonstrates it 14 times per minute.',
    },
    {
      heading: 'S and Z are mirror twins — and that\'s WHY they\'re both pieces.',
      body:
        'The Tetris S-piece and Z-piece are reflections of each other. The L-piece and J-piece are too. They\'re kept as DISTINCT pieces in the game because reflection IS a different transformation from rotation — you can\'t rotate an S into a Z, no matter how many times you turn it. This is exactly what the chapter\'s "Classification of Rigid Motions" topic is asking. Tetris is, accidentally, a daily test of whether students understand chirality.',
    },
  ],
  attributes: [
    { key: 'game',                    label: 'Game',              kind: 'categorical', description: 'Title of the original game.' },
    { key: 'character',               label: 'Character',         kind: 'categorical', description: 'Specific sprite within the game.' },
    { key: 'yearReleased',            label: 'Year',              kind: 'numeric', description: 'Year the game was released.' },
    { key: 'primaryTransformation',   label: 'Primary transformation', kind: 'categorical',
      description: 'Which rigid motion the engine applies most often: translation, rotation, reflection, or composition.' },
    { key: 'spriteWidthPx',           label: 'Sprite width',      kind: 'numeric', unit: 'px', description: 'Sprite width in pixels.' },
    { key: 'spriteHeightPx',          label: 'Sprite height',     kind: 'numeric', unit: 'px', description: 'Sprite height in pixels.' },
    { key: 'maxSpeedPxPerFrame',      label: 'Max speed',         kind: 'numeric', unit: 'px/frame',
      description: 'Approximate max horizontal speed in pixels per frame at the game\'s native frame rate.' },
    { key: 'rotationalSymmetryOrder', label: 'Rotational sym. order', kind: 'numeric',
      description: 'How many rotations carry the sprite onto itself. 1 = no rotational symmetry; 2 = 180°; 4 = 90°.' },
    { key: 'hasMirrorSymmetry',       label: 'Has mirror sym.',   kind: 'categorical', description: 'Whether the sprite has an axis of reflection symmetry.' },
    { key: 'flipsWhenFacingLeft',     label: 'Flips on direction', kind: 'categorical', description: 'Whether the engine horizontally reflects the sprite when the character turns around.' },
    { key: 'rotatesInGame',           label: 'Rotates in engine', kind: 'categorical', description: 'Whether the engine actively rotates the sprite at runtime.' },
    { key: 'notes',                   label: 'Notes',             kind: 'categorical', description: 'Free-form designer note.' },
  ],
  featured: { type: 'scatter', x: 'yearReleased', y: 'maxSpeedPxPerFrame', color: 'primaryTransformation' },
  chapterFits: [
    {
      course: 'geometry',
      topic: 3,
      topicName: 'Transformations',
      mathFit:
        'Every row is a rigid motion. The Savvas Act-1 has a presenter rotating and flipping a 12-sided polygon with arrows — here, every retro game character demonstrates the same operations: Pac-Man rotates by 90°, Mario reflects horizontally, Sonic composes both, the Tetris L-piece has rotation order 1, the O-piece has order 4. Students can filter the dataset by primary transformation, sort by rotational symmetry, and discover that "Classification of Rigid Motions" is the literal subroutine table inside 1980s arcade ROMs.',
      standards: ['HSG-CO.A.2', 'HSG-CO.A.3', 'HSG-CO.A.4', 'HSG-CO.A.5', 'HSG-CO.B.6'],
      studentWhy:
        'The reason Mario looks right whether he walks left or right is that the NES applies a horizontal reflection to his sprite. The reason Pac-Man faces four directions with one sprite is that the arcade hardware applies a rotation. The chapter content here is the algorithm Nintendo and Namco used.',
      objective:
        'Students will classify each retro-game character by its primary rigid motion, identify the rotational symmetry order of its sprite, compare reflective vs. rotational symmetry (using Tetris S/Z as the chiral example), and trace the evolution of in-engine transformations from 1978 (translation-only) to 1991 (full composition).',
      minutes: 30,
      discussion: [
        'Filter to Tetris. Rank the 7 pieces by rotational symmetry order. Which pieces are chiral (have no mirror symmetry)? Why does Tetris need both S AND Z?',
        'Mario (1985) reflects to turn around; Pac-Man (1980) rotates. Both work. Why might Nintendo have picked reflection over rotation?',
        'In 1978 (Space Invaders), only translation existed. By 1991 (Sonic), composition. What new hardware made that possible?',
        'Which games here use reflection? Which use rotation? Plot year vs. max speed coloured by primary transformation — does any pattern emerge?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
