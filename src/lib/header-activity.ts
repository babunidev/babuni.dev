/** Emphasize real shift/wait statuses without inventing a queued action. */
export function headerActivity(message:string):{text:string;shift:boolean}{
 const shifting=/^(Rows|Columns) are shifting(?: ·|$)/.test(message);
 const waiting=/^Waiting for shift to finish(?: ·|$)/.test(message);
 return {text:message,shift:shifting||waiting};
}
