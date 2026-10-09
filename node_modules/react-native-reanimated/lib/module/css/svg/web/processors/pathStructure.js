'use strict';

import { offsetOf } from "../../../utils/index.js";
const commandSequence = d => (d.match(/[mlhvcsqtaz]/gi) ?? []).join('').toLowerCase();
const endsWithZ = d => /z\s*$/i.test(d.trim());
const hasStringD = entry => typeof entry[1].d === 'string';
const closed = d => `${d.trim()}Z`;

// Nudge the fake frame just past the offset so the switch is a discrete step.
const BOUNDARY_NUDGE = 0.001;
const nudgedKey = offset => `${+(offset * 100 + BOUNDARY_NUDGE).toFixed(3)}%`;
// CSS `d` only interpolates between identical command structures (trailing Z
// included). Close open frames to match closed neighbours so open<->closed
// morphs interpolate; no-op for uniform or differently-structured sets.
export function withMatchingPathStructure(definitions) {
  const blocks = definitions;
  const frames = Object.entries(blocks).filter(hasStringD).map(([key, {
    d
  }]) => ({
    key,
    d,
    z: endsWithZ(d),
    offset: offsetOf(key)
  })).filter(frame => frame.offset !== null);
  if (frames.length < 2) {
    return definitions;
  }
  const signature = commandSequence(frames[0].d).replace(/z$/, '');
  if (frames.some(f => commandSequence(f.d).replace(/z$/, '') !== signature)) {
    return definitions;
  }
  frames.sort((a, b) => a.offset - b.offset);

  // Reassign on each change so an untouched set is returned as-is.
  let result = blocks;
  const closeFrame = frame => {
    result = {
      ...result,
      [frame.key]: {
        ...blocks[frame.key],
        d: closed(frame.d)
      }
    };
  };

  // Endpoints have one segment, so they can only close (never split).
  const first = frames[0];
  const last = frames[frames.length - 1];
  if (!first.z && frames[1].z) {
    closeFrame(first);
  }
  if (!last.z && frames[frames.length - 2].z) {
    closeFrame(last);
  }

  // Interior open frame: both neighbours closed -> close; one closed -> a
  // boundary, so split into the left value plus a fake right value just after.
  for (let i = 1; i < frames.length - 1; i++) {
    const frame = frames[i];
    if (frame.z) {
      continue;
    }
    const leftClosed = frames[i - 1].z;
    const rightClosed = frames[i + 1].z;
    if (leftClosed && rightClosed) {
      closeFrame(frame);
    } else if (leftClosed !== rightClosed) {
      result = {
        ...result,
        [frame.key]: {
          ...blocks[frame.key],
          d: leftClosed ? closed(frame.d) : frame.d
        },
        [nudgedKey(frame.offset)]: {
          d: rightClosed ? closed(frame.d) : frame.d
        }
      };
    }
  }
  return result;
}
//# sourceMappingURL=pathStructure.js.map