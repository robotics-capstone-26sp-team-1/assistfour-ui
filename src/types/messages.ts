// Goto Marker action message types.
export type GotoMarkerGoal = object

export type GotoMarkerResult = {
  result: string;
}

export type GotoMarkerFeedback = {
  progress: string;
}

// Goto Column action message type.
export type GotoColumnGoal = {
  column: number;
}

export type GotoColumnResult = {
  result: string;
}

export type GotoColumnFeedback = {
  progress: string;
}