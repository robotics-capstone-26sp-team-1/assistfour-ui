import { Quaternion, Vector3 } from 'roslib'

export type RosTransform = {
  translation: Vector3
  rotation: Quaternion
}

export type RosTime = {
  sec: number
  nanosec: number
}

export type RosHeader = {
  stamp: RosTime
  frame_id: string
}

export type RosTransformStamped = {
  header: RosHeader
  child_frame_id: string
  transform: RosTransform
}

export const defaultRosTransform = (): RosTransformStamped => ({
  header: {
    stamp: { sec: 0, nanosec: 0 },
    frame_id: '',
  },
  child_frame_id: '',
  transform: {
    translation: new Vector3(),
    rotation: new Quaternion(),
  },
})
