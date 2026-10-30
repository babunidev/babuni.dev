/** Explain the existing wait rule; only real shift/wait statuses get emphasis. */
export function headerActivity(message:string):{text:string;shift:boolean}{
 const shifting=/^(Rows|Columns) are shifting(?: ·|$)/.test(message);
 const waiting=/^Waiting for shift to finish(?: ·|$)/.test(message);
 return {text:shifting?message.replace(/^(Rows|Columns) are shifting/, '$& · Opening waits until the shift finishes'):message,shift:shifting||waiting};
}
