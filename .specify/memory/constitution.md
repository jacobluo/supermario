<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles: I. Deterministic Simulation & Anti-Replay (clarified collision order and replay scope); II. Performance Budgets First -> Performance Budgets & Frame-Rate Independence; III. Test-First Execution (clarified required suites); IV. Modular Contracts & Stability -> Contracts, Modularity & Engine Boundaries; V. Observability & Debuggability (unchanged emphasis, expanded capture scope)
- Added sections: none (Engineering Standards expanded)
- Removed sections: none
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (Constitution Check remains source of gates)
  - .specify/templates/spec-template.md ✅ (no change needed)
  - .specify/templates/tasks-template.md ✅ (no change needed)
  - .specify/templates/commands/ ⚠ pending if added later
- Follow-up TODOs: none
-->
# Supermario Constitution

## Core Principles

### I. Deterministic Simulation & Anti-Replay
All gameplay logic MUST be deterministic under fixed timesteps, seeded RNG, and pure data inputs. 
Record/replay harnesses are mandatory for regressions; state diffs must be comparable frame-to-frame.
Motion integrates axes separately: resolve X displacement and collisions before Y to prevent corner locking.
Networked flows use lockstep or verified rollback; any nondeterminism is treated as a bug.
Rationale: ensures fairness, debuggability, and reproducible physics.

### II. Performance Budgets & Frame-Rate Independence
Each feature declares frame-time and memory budgets before implementation (targets: 60fps minimum, 120fps stretch on mid-tier hardware).
All motion, gravity, and animation timers multiply `deltaTime`; fixed-step simulation decouples from rendering.
Hot paths MUST be profiled; allocations inside tight loops are prohibited unless proven negligible.
Rendering paths favor batch draws and cache-friendly data layouts; culling required for tile rendering.

### III. Test-First Execution
Tests precede implementation for gameplay rules, physics invariants, collision resolution, and rendering outputs (golden frame/metric diffs).
CI runs headless simulation + rendering checks and replay-based regression tests; failures block merges.
New APIs require contract tests for success, error, and edge cases; coverage must remain stable or increase.

### IV. Contracts, Modularity & Engine Boundaries
Public interfaces (TypeScript types, CLI/IPC payloads) are versioned and documented before release.
Breaking changes require MAJOR version bumps and migration notes; deprecations carry enforcement dates.
Absolutely no third-party game or physics engines; core physics, rendering, and collisions are handwritten.
Modules favor dependency inversion and small composable surfaces; no hidden globals or cross-module coupling.

### V. Observability & Debuggability
Structured logs, metrics, and trace hooks are mandatory for engine subsystems (simulation, rendering, IO).
Frame captures (inputs + outputs) must be easy to capture and replay locally.
Production issues require repro instructions using captured artifacts within one working day.

## Engineering Standards
Primary stack: HTML5 Canvas + modern ES modules (TypeScript/JavaScript). Minimal toolchain; Vite preferred for dev/build.
Logic/render separation: `update(deltaTime)` mutates state and physics; `draw(context)` renders only. No state changes in draw paths.
Frame-rate independence: all velocities, accelerations, timers, and animations scale by `deltaTime`; terminal velocity enforced for falls.
Entity model: all game objects derive from a base `Entity` with AABB (`x, y, width, height`) in world coordinates.
State machines: Mario and enemies use explicit states (`idle`, `running`, `jumping`, `falling`, `dead`, etc.)—no deep if/else chains.
Collision correctness: apply X displacement and resolve X collisions, then Y displacement and resolve Y collisions; compute overlap and rewind positions.
Gravity and jump: set upward impulse via `vy = -jumpForce`; accumulate gravity as `vy += gravity * dt`.
Camera: world coordinates remain immutable; scrolling via `ctx.save() -> ctx.translate(-camera.x, 0) -> render -> ctx.restore()`.
Tile maps: level data in arrays; render with viewport culling to draw only visible tiles.
Visual placeholders first: ship colored `fillRect` blocks until physics/collision proven; sprites follow after.
Security & integrity: validate inputs at boundaries; deterministic verification underpins anti-cheat.
Accessibility: UI elements expose semantic roles; 60fps interactions remain keyboard-accessible.

## Workflow & Reviews
Plans/specs/tasks MUST reference this constitution in their Constitution Check.
If a requirement in tasks/spec is ambiguous, halt and seek clarification before coding.
Every PR includes: performance budget check, determinism verification notes, collision order confirmation, and test evidence.
TDD cadence: write failing tests → implement → profile → document impacts in plan/task artifacts.
Feature delivery is incremental and independently testable per user story; commit only files relevant to the task at hand.

## Governance
This constitution supersedes other practice docs for gameplay/engine concerns.
Amendments require proposal in repo history, rationale, migration/compat notes, and reviewer approval.
Versioning follows Semantic Versioning (MAJOR breaking principle changes, MINOR new/expanded principles or sections, PATCH clarifications).
Compliance is reviewed at plan (Constitution Check), during PR review, and in release readiness.

**Version**: 1.1.0 | **Ratified**: 2026-02-26 | **Last Amended**: 2026-02-26
