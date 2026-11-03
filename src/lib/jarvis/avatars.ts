import jarvis from "@/assets/avatars3d/jarvis.png";
import alice from "@/assets/avatars3d/alice.png";
import bob from "@/assets/avatars3d/bob.png";
import carol from "@/assets/avatars3d/carol.png";
import dave from "@/assets/avatars3d/dave.png";

/** Full-body seated 3D avatars (transparent PNG), shown working at their desks. */
export const AGENT_AVATARS: Record<string, string> = { jarvis, alice, bob, carol, dave };

import aliceWalk from "@/assets/avatars3d/walk/alice.png";
import bobWalk from "@/assets/avatars3d/walk/bob.png";
import carolWalk from "@/assets/avatars3d/walk/carol.png";
import daveWalk from "@/assets/avatars3d/walk/dave.png";

/** Standing/walking 3D avatars (no chair), facing right — used while an agent moves between rooms. */
export const AGENT_WALK_AVATARS: Record<string, string> = { alice: aliceWalk, bob: bobWalk, carol: carolWalk, dave: daveWalk };

import aliceReal from "@/assets/avatars3d/real/alice.png";
import bobReal from "@/assets/avatars3d/real/bob.png";
import carolReal from "@/assets/avatars3d/real/carol.png";
import daveReal from "@/assets/avatars3d/real/dave.png";

/** Photorealistic humans seated at their desk, matched to the master reference. */
export const AGENT_REAL_AVATARS: Record<string, string> = { alice: aliceReal, bob: bobReal, carol: carolReal, dave: daveReal };

import alicePx from "@/assets/avatars3d/pixel/alice.png";
import bobPx from "@/assets/avatars3d/pixel/bob.png";
import carolPx from "@/assets/avatars3d/pixel/carol.png";
import davePx from "@/assets/avatars3d/pixel/dave.png";
import evePx from "@/assets/avatars3d/pixel/eve.png";
import aliceWalkPx from "@/assets/avatars3d/pixel/walk/alice.png";
import bobWalkPx from "@/assets/avatars3d/pixel/walk/bob.png";
import carolWalkPx from "@/assets/avatars3d/pixel/walk/carol.png";
import daveWalkPx from "@/assets/avatars3d/pixel/walk/dave.png";

/** 2D isometric pixel-art sprites: seated working + walking. */
export const AGENT_PIXEL_AVATARS: Record<string, string> = { alice: alicePx, bob: bobPx, carol: carolPx, dave: davePx, eve: evePx };
export const AGENT_PIXEL_WALK: Record<string, string> = { alice: aliceWalkPx, bob: bobWalkPx, carol: carolWalkPx, dave: daveWalkPx };
