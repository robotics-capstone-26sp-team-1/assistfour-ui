import { defaultRosTransform, type RosTransformStamped } from '@/types/ros'

export type NamedLink = {
  name: string
  link: string
}

export const frames: NamedLink[] = [
  { name: 'Robot', link: 'base_link' },
  { name: 'World', link: 'odom' },
  { name: 'AruCo', link: 'column_4' },
]

export type GetPoseRequest = Record<string, never>

export type GetPoseResponse = {
  world_pose: RosTransformStamped
  robot_pose: RosTransformStamped
  aruco_pose: RosTransformStamped
  success: boolean
  message: string
}

export const defaultGetPoseResponse = (): GetPoseResponse => ({
  world_pose: defaultRosTransform(),
  robot_pose: defaultRosTransform(),
  aruco_pose: defaultRosTransform(),
  success: true,
  message: '',
})

export type SetPoseGoal = {
  target_pose: RosTransformStamped
}

export type SetPoseFeedback = {
  status: string
}

export type SetPoseResult = {
  success: boolean
  message: string
}
