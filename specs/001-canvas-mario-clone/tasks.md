---

description: "Task list template for feature implementation"
---

# Tasks: HTML5 Mario Clone with Logos

**Input**: Design documents from `/specs/001-canvas-mario-clone/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include unit/integration tests for physics, collision, and deterministic replay per constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize npm project and add Vite with ES modules entry in `package.json`
- [X] T002 Create base source layout `src/{main.js,game.js,loop.js,input.js,camera.js}` and `src/physics/{physics.js,collision.js}`
- [X] T003 Add lint/test tooling (ESLint + Vitest) config files in repo root
- [X] T004 Add script aliases (`dev`, `build`, `test`) in `package.json`
- [X] T005 Create placeholder assets directory `src/assets/` and sample Tiled JSON level `assets/levels/demo.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T006 Implement fixed-timestep game loop with accumulator in `src/loop.js`
- [X] T007 Wire bootstrap to loop and input initialization in `src/main.js`
- [X] T008 Implement deterministic input capture + playback hooks in `src/input.js`
- [X] T009 Implement physics integrator (gravity, jump impulse, terminal velocity) in `src/physics/physics.js`
- [X] T010 Implement axis-separated AABB collision resolution for tiles in `src/physics/collision.js`
- [X] T011 Implement camera follow + clamping to level bounds in `src/camera.js`
- [ ] T012 Load Tiled-style JSON level (tiles, collision, entities, logos) in `src/level/level.js`
- [ ] T013 Add render pipeline with culling and placeholders in `src/render/render.js`
- [ ] T014 Add unit tests for loop/physics/collision determinism in `tests/unit/{loop.test.js,physics.test.js,collision.test.js}`
- [ ] T015 Add integration test for level load and draw passthrough in `tests/integration/level-load.test.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 完成基础通关 (Priority: P1) 🎯 MVP

**Goal**: 通过相机跟随跑跳并抵达终点，确保核心移动/跳跃/相机体验

**Independent Test**: 启动后移动与跳跃流畅，相机平滑且不越界，触发终点旗帜完成状态

### Tests for User Story 1 (MANDATORY)
- [ ] T016 [US1] Integration test: run fixed-step to终点并断言通关标志在 `tests/integration/us1-clear-level.test.js`

### Implementation for User Story 1
- [ ] T017 [US1] Implement base Entity class with AABB + update/draw hooks in `src/entities/entity.js`
- [ ] T018 [US1] Implement Player (Mario) movement/state machine in `src/entities/player.js`
- [ ] T019 [US1] Add goal flag/level completion trigger in `src/entities/goal.js`
- [ ] T020 [US1] Hook player + goal into level spawning in `src/level/level.js`
- [ ] T021 [US1] Render player/goal placeholders and camera parallax hooks in `src/render/render.js`
- [ ] T022 [US1] Add replay fixture covering start→goal deterministic path in `tests/integration/replay-us1.test.js`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 收集与砖块互动 (Priority: P2)

**Goal**: 收集金币、顶碎砖块，分数/计数即时更新

**Independent Test**: 进入含金币与砖块区段，收集/顶碎后计数与分数即时且不重复

### Tests for User Story 2 (MANDATORY)
- [ ] T023 [US2] Integration test: 连续收集金币计数准确 in `tests/integration/us2-coins.test.js`
- [ ] T024 [US2] Integration test: 顶碎砖块后不可再碰撞 in `tests/integration/us2-bricks.test.js`

### Implementation for User Story 2
- [ ] T025 [US2] Implement Coin entity with pickup/removal/score update in `src/entities/coin.js`
- [ ] T026 [US2] Implement breakable Brick entity with smash animation/state in `src/entities/brick.js`
- [ ] T027 [US2] Wire coin/brick spawning from level JSON in `src/level/level.js`
- [ ] T028 [US2] Update game-state scoring/coin counters with HUD render in `src/state/game-state.js` and `src/render/render.js`
- [ ] T029 [US2] Add replay fixture covering连采金币+顶砖无重复 in `tests/integration/replay-us2.test.js`

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - 敌人与品牌展示 (Priority: P3)

**Goal**: Goomba 敌人互动，品牌 LOGO 看板展示且不干扰玩法

**Independent Test**: 踩灭得分/侧撞受伤均正确，LOGO 清晰显示且不遮挡路径

### Tests for User Story 3 (MANDATORY)
- [ ] T030 [US3] Integration test: 踩灭/侧撞 Goomba 状态与得分 in `tests/integration/us3-goomba.test.js`
- [ ] T031 [US3] Visual test: LOGO 图层不遮挡角色 in `tests/golden/us3-logos.test.js`

### Implementation for User Story 3
- [ ] T032 [US3] Implement Goomba AI/state and collisions in `src/entities/goomba.js`
- [ ] T033 [US3] Wire Goomba spawn patterns from level JSON in `src/level/level.js`
- [ ] T034 [US3] Add logo billboard layer rendering with fallback placeholder in `src/render/render.js`
- [ ] T035 [US3] Add player hurt/fail handling and restart flow in `src/game.js`
- [ ] T036 [US3] Add replay fixture covering踩灭与侧撞分支 in `tests/integration/replay-us3.test.js`

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T037 Add pause/reset UI hooks and input binding in `src/game.js`
- [ ] T038 [P] Add frame capture/log hooks for observability in `src/utils/replay.js`
- [ ] T039 [P] Optimize render batching/culling for tiles in `src/render/render.js`
- [ ] T040 [P] Add accessibility check (keyboard-only flow) script in `tests/integration/accessibility.test.js`

---

## Dependencies & Execution Order

- Story order: US1 → US2 → US3
- Foundational (Phase 2) blocks all user stories
- Parallel opportunities: tasks marked [P] can run concurrently after their prerequisites

### Parallel Examples
- After Phase 2: T021 (render placeholders) can run in parallel with T020 (player/goal spawn) once level loader exists.
- Phase 4: T028 (HUD updates) can run in parallel with T026 (brick logic) after T025 done.
- Phase 5: T034 (logo rendering) can run in parallel with T032 (Goomba AI) once level loader supports entities.

### Implementation Strategy
1. Complete Setup + Foundational
2. Deliver MVP with US1
3. Add US2, validate independently
4. Add US3, validate independently
5. Polish & cross-cutting
