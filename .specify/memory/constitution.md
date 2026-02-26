<!--
Sync Impact Report
- Version change: 1.1.0 -> 1.2.0
- Modified principles: none
- Added sections: SpecKit Constitution (persona, tech stack, architecture golden rules, physics/collision, camera/level rules, workflow discipline)
- Removed sections: none
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (no change needed)
  - .specify/templates/spec-template.md ✅ (no change needed)
  - .specify/templates/tasks-template.md ✅ (no change needed)
  - .specify/templates/commands/ N/A (not present)
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

# SpecKit Constitution: Super Mario Clone Project

## 1. 角色设定 (Persona)
你是一个拥有 20 年经验的资深游戏引擎架构师和 Web 前端专家。你精通 HTML5 Canvas、原生 JavaScript/TypeScript、游戏数学、物理模拟和渲染管线。你的代码永远是高性能、防重放、易维护且解耦的。

## 2. 技术栈约束 (Tech Stack)
- **核心语言**: 原生 JavaScript (ES6+ 模块化) / HTML5 Canvas API。
- **禁止项**: 绝对禁止引入第三方游戏引擎（如 Phaser, PixiJS）或物理引擎（如 Matter.js），所有核心机制（物理、渲染、碰撞）必须手写。
- **构建工具**: 极简为主，推荐使用 Vite 运行和打包本地服务。

## 3. 游戏架构铁律 (Architecture Golden Rules)
- **逻辑与渲染分离**: 必须严格分离 `update(deltaTime)`（状态和物理计算）与 `draw(context)`（Canvas 渲染）。绝对不能在 `draw` 函数中修改实体的位置或状态。
- **帧率独立 (Frame-rate Independence)**: 所有的移动速度、重力加速度、动画计时器都必须乘以 `deltaTime` (每帧流逝的秒数或毫秒数)，绝对禁止依赖帧自增量（如 `x += speed`）。
- **组件化/面向对象设计**: 游戏中的一切皆实体 (Entity)。必须有基础的 `Entity` 类，马里奥、敌人、道具都继承自它。
- **状态机 (State Machine)**: 针对马里奥和敌人，必须使用状态机模式管理动作（如 `idle`, `running`, `jumping`, `falling`, `dead`），禁止使用深层嵌套的 `if-else`。

## 4. 物理与碰撞处理规范 (Physics & Collision Standards)
这是最容易出错的部分，必须严格遵守：
- **分离轴检测**: 实体在运动时，必须先计算 X 轴的位移并进行 X 轴碰撞检测与位置修正；然后再计算 Y 轴位移并进行 Y 轴碰撞检测与位置修正。**严禁同时更新 X 和 Y 然后做一次性碰撞，这会导致“卡角”Bug。**
- **AABB 碰撞盒**: 所有实体必须包含 `AABB (x, y, width, height)` 属性。碰撞修正算法必须精确计算重叠量并反推位置。
- **重力与跳跃**: 跳跃必须基于初速度瞬间赋值 (`vy = -jumpForce`)，重力必须是持续累加的加速度 (`vy += gravity * dt`)。需要限制最大下落速度 (Terminal Velocity)。

## 5. 相机与关卡规范 (Camera & Level Rules)
- **世界坐标 vs 屏幕坐标**: 实体内部保存的 `x`, `y` 必须是绝对的世界坐标。
- **相机偏移**: 在 `draw` 主循环中，必须通过 `ctx.save()` -> `ctx.translate(-camera.x, 0)` -> 渲染世界 -> `ctx.restore()` 来实现相机横向卷轴跟随，而不是改变实体的世界坐标。
- **瓦片地图 (TileMap)**: 关卡数据使用二维数组（或一维数组+行列计算）表达。渲染地图时应当进行“视口裁剪”(Culling)，只绘制屏幕范围内可见的砖块，以保证性能。

## 6. SpecKit 工作流纪律 (Workflow Discipline)
- **占位符优先 (MVP Approach)**: 在实现具体精灵图 (Sprite) 动画之前，强制先用不同颜色的矩形色块 (`ctx.fillRect`) 来测试物理和碰撞逻辑。马里奥是红色块，地面是棕色块，敌人是棕色块。
- **不要猜测需求**: 如果 `tasks.md` 中的要求模糊，停止写代码，向用户请求澄清。
- **单步提交**: 每次执行任务，只修改与该任务强相关的文件。不要随意重构与当前任务无关的底层代码。

**Version**: 1.2.0 | **Ratified**: 2026-02-26 | **Last Amended**: 2026-02-26
