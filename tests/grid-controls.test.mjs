import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PAN_TUNING, createManualPanState, queuePointerTravel, stepManualPan, panIsMoving
} from '../src/lib/grid-controls.ts';
const none = {x: 0, y: 0};
const arrowRight = {x: -1, y: 0};

test('pointer input is limited to a tunable backlog and does not teleport on a giant drag', () => {
  const state = queuePointerTravel(createManualPanState(), 3000, 4000);
  assert.ok(Math.hypot(state.pending.x, state.pending.y) <= PAN_TUNING.pointerLagLimit + 1e-7);
  assert.deepEqual(state.pointerVelocity, none);
});
test('pointer movement accelerates briefly but never exceeds maximum speed', () => {
  let state = queuePointerTravel(createManualPanState(), 10000, 0);
  const speeds = [];
  for (let i = 0; i < 30; i++) {
    if (i % 4 === 0) state = queuePointerTravel(state, 60, 0);
    const step = stepManualPan(state, 0.016, true, none);
    state = step.state;
    const speed = Math.hypot(step.delta.x, step.delta.y) / 0.016;
    speeds.push(speed);
    assert.ok(speed <= PAN_TUNING.pointerMaxSpeed + 1e-6, `pointer speed ${speed}`);
  }
  assert.ok(speeds[0] < speeds[4]);
  assert.ok(Math.max(...speeds) > PAN_TUNING.pointerMaxSpeed * 0.9);
});
test('pointer catches up a modest drag without overshooting and stops on release', () => {
  let state = queuePointerTravel(createManualPanState(), 90, -30);
  let x = 0, y = 0;
  for (let i = 0; i < 240; i++) {
    const step = stepManualPan(state, 1/60, true, none);
    state = step.state; x += step.delta.x; y += step.delta.y;
  }
  assert.ok(Math.abs(x - 90) < 0.01);
  assert.ok(Math.abs(y + 30) < 0.01);
  const release = stepManualPan(state, 1/60, false, none);
  assert.deepEqual(release.delta, none);
  assert.deepEqual(release.state.pending, none);
});
test('arrow movement starts slowly and tops out at deliberately slower speed', () => {
  let state = createManualPanState();
  const speeds=[];
  for (let i=0;i<100;i++) {
    const step=stepManualPan(state, 0.016, false, arrowRight);
    state=step.state;
    speeds.push(Math.hypot(step.delta.x,step.delta.y)/0.016);
  }
  assert.ok(speeds[0]<speeds[8]);
  assert.ok(Math.max(...speeds)<=PAN_TUNING.keyboardMaxSpeed + 1e-7);
  assert.ok(Math.max(...speeds)>PAN_TUNING.keyboardMaxSpeed-0.001);
  assert.ok(PAN_TUNING.keyboardMaxSpeed < PAN_TUNING.pointerMaxSpeed);
});
test('released arrow keys decelerate to a stop without continuing forever', () => {
  let state=createManualPanState();
  for(let i=0;i<40;i++)state=stepManualPan(state,0.016,false,arrowRight).state;
  for(let i=0;i<60;i++)state=stepManualPan(state,0.016,false,none).state;
  assert.equal(state.keyboardVelocity.x,0);
  assert.ok(!panIsMoving(state));
});
test('diagonal key movement has the same maximum speed as horizontal movement', () => {
  let state=createManualPanState();
  for(let i=0;i<100;i++)state=stepManualPan(state,0.016,false,{x:-1,y:1}).state;
  assert.ok(Math.abs(Math.hypot(state.keyboardVelocity.x,state.keyboardVelocity.y) - PAN_TUNING.keyboardMaxSpeed)<0.001);
});
test('hidden-tab frame interval is capped to avoid a sudden large jump', () => {
  const state = queuePointerTravel(createManualPanState(), 170, 0);
  const step = stepManualPan(state, 300, true, none);
  assert.ok(Math.hypot(step.delta.x, step.delta.y) <= PAN_TUNING.pointerMaxSpeed*0.05+1e-8);
});

test('doubled manual motion speeds and accelerations match the creator request', () => {
  assert.equal(PAN_TUNING.pointerMaxSpeed, 880);
  assert.equal(PAN_TUNING.pointerAcceleration, 3600);
  assert.equal(PAN_TUNING.keyboardMaxSpeed, 260);
  assert.equal(PAN_TUNING.keyboardAcceleration, 1040);
  assert.equal(PAN_TUNING.keyboardDeceleration, 1400);
  assert.equal(PAN_TUNING.pointerLagLimit, 180);
});
