/** Frame-rate-independent controls for the freely pannable grid. Units are CSS px and seconds. */
export interface Vector { x: number; y: number; }
export interface ManualPanState {
  /** Pending pointer travel: capped to avoid unbounded delayed catch-up. */
  pending: Vector;
  pointerVelocity: Vector;
  keyboardVelocity: Vector;
}
export interface PanStep {
  state: ManualPanState;
  delta: Vector;
}
export interface PanTuning {
  pointerMaxSpeed: number;
  pointerAcceleration: number;
  pointerLagLimit: number;
  keyboardMaxSpeed: number;
  keyboardAcceleration: number;
  keyboardDeceleration: number;
}
/** Prototype values for creator review; intentionally kept together for easy adjustment. */
export const PAN_TUNING: Readonly<PanTuning> = Object.freeze({
  pointerMaxSpeed: 880,        // px/s: doubled maximum for mouse and touch dragging
  pointerAcceleration: 3600,  // px/s²: about 0.24s ramp to top speed (doubled)
  pointerLagLimit: 180,       // px: do not chase a very fast cursor indefinitely
  keyboardMaxSpeed: 260,      // px/s: much slower than pointer panning
  keyboardAcceleration: 1040, // px/s²: gentle ramp for held arrow keys
  keyboardDeceleration: 1400  // px/s²: short ease out after releasing keys
});

const zero = (): Vector => ({x: 0, y: 0});
const length = (v: Vector): number => Math.hypot(v.x, v.y);
const withLengthAtMost = (v: Vector, max: number): Vector => {
  const n = length(v);
  return n > max && n > 0 ? {x: v.x * max / n, y: v.y * max / n} : v;
};
const approach = (current: Vector, target: Vector, maxDelta: number): Vector => {
  const diff = {x: target.x - current.x, y: target.y - current.y};
  const d = withLengthAtMost(diff, maxDelta);
  return {x: current.x + d.x, y: current.y + d.y};
};
export function createManualPanState(): ManualPanState {
  return {pending: zero(), pointerVelocity: zero(), keyboardVelocity: zero()};
}

/** Accumulate mouse/touch travel up to a limited lead, discarding excessive speed rather than storing an infinite backlog. */
export function queuePointerTravel(state: ManualPanState, dx: number, dy: number, tuning: PanTuning = PAN_TUNING): ManualPanState {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return state;
  return {
    ...state,
    pending: withLengthAtMost({x: state.pending.x + dx, y: state.pending.y + dy}, tuning.pointerLagLimit)
  };
}

/** Animate pointer follow and held arrow keys by elapsed time, not by key-repeat events or cursor travel alone. */
export function stepManualPan(
  state: ManualPanState,
  elapsedSeconds: number,
  pointerHeld: boolean,
  keyDirection: Vector,
  tuning: PanTuning = PAN_TUNING
): PanStep {
  const dt = Math.max(0, Math.min(Number.isFinite(elapsedSeconds) ? elapsedSeconds : 0, 0.05));
  if (dt === 0) return {state, delta: zero()};

  let pending = pointerHeld ? state.pending : zero();
  let pointerVelocity = pointerHeld ? state.pointerVelocity : zero();
  let pointerStep = zero();
  const distance = length(pending);
  if (pointerHeld && distance > 0.001) {
    // Brake before reaching the pointer: never overshoot the remaining distance.
    const targetSpeed = Math.min(tuning.pointerMaxSpeed, Math.sqrt(2 * tuning.pointerAcceleration * distance));
    const target = {x: pending.x * targetSpeed / distance, y: pending.y * targetSpeed / distance};
    pointerVelocity = approach(pointerVelocity, target, tuning.pointerAcceleration * dt);
    const proposed = {x: pointerVelocity.x * dt, y: pointerVelocity.y * dt};
    pointerStep = withLengthAtMost(proposed, distance);
    pending = {x: pending.x - pointerStep.x, y: pending.y - pointerStep.y};
    if (length(pending) < 0.001) pending = zero();
  } else if (pointerHeld) {
    pointerVelocity = approach(pointerVelocity, zero(), tuning.pointerAcceleration * dt);
  }

  const keyMagnitude = length(keyDirection);
  const normalKey = keyMagnitude > 0 ? {x: keyDirection.x / keyMagnitude, y: keyDirection.y / keyMagnitude} : zero();
  const desiredKeyboardVelocity = {x: normalKey.x * tuning.keyboardMaxSpeed, y: normalKey.y * tuning.keyboardMaxSpeed};
  const keyAcceleration = keyMagnitude > 0 ? tuning.keyboardAcceleration : tuning.keyboardDeceleration;
  const keyboardVelocity = approach(state.keyboardVelocity, desiredKeyboardVelocity, keyAcceleration * dt);
  const keyStep = {x: keyboardVelocity.x * dt, y: keyboardVelocity.y * dt};
  return {
    state: {pending, pointerVelocity, keyboardVelocity},
    delta: {x: pointerStep.x + keyStep.x, y: pointerStep.y + keyStep.y}
  };
}

/** True while an animation frame would produce visible movement. */
export function panIsMoving(state: ManualPanState): boolean {
  return length(state.pending) >= 0.001 || length(state.keyboardVelocity) >= 0.001 || length(state.pointerVelocity) >= 0.001;
}
