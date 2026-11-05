/** 网关只返回输出尾部；找上次快照的最长后缀与新快照的前缀，避免重复保存。 */
export function newLogTail(previous: string, next: string): string {
  if (!previous) return next;
  if (previous === next) return '';
  const prefix = Array<number>(next.length).fill(0);
  for (let index = 1; index < next.length; index++) {
    let matched = prefix[index - 1];
    while (matched > 0 && next[index] !== next[matched]) matched = prefix[matched - 1];
    if (next[index] === next[matched]) matched++;
    prefix[index] = matched;
  }
  let matched = 0;
  for (let index = 0; index < previous.length; index++) {
    while (matched > 0 && previous[index] !== next[matched]) matched = prefix[matched - 1];
    if (previous[index] === next[matched]) matched++;
    if (matched === next.length && index < previous.length - 1) matched = prefix[matched - 1];
  }
  return next.slice(matched);
}
