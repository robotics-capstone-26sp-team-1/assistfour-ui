// Goto Marker action message types.
export type GotoMarkerGoal = object

export type GotoMarkerResult = {
  result: string
}

export type GotoMarkerFeedback = {
  progress: string
}

// Play Column action message type.
export const createPlayColumnGoal = (column: number): PlayColumnGoal => ({
  column: column,
})
export type PlayColumnGoal = {
  column: number
}

export type PlayColumnResult = {
  result: string
}

export type PlayColumnFeedback = {
  progress: string
}
