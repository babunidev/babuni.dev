/** Logical animation time. A click leaves target=1; an actual drag brakes it. */
export interface ShiftPlayback {elapsed:number;rate:number}
export const SHIFT_BRAKE_MS=280;
export function stepShiftPlayback(state:ShiftPlayback,deltaMs:number,dragging:boolean):ShiftPlayback {
 const dt=Math.max(0,Number.isFinite(deltaMs)?deltaMs:0),target=dragging?0:1;
 const rate=Math.max(0,Math.min(1,state.rate)),direction=Math.sign(target-rate);
 const ramp=Math.min(dt,Math.abs(target-rate)*SHIFT_BRAKE_MS);
 const next=rate+direction*ramp/SHIFT_BRAKE_MS;
 return {elapsed:state.elapsed+(rate+next)*ramp/2+target*(dt-ramp),rate:next};
}
