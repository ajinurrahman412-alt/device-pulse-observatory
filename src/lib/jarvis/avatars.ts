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
