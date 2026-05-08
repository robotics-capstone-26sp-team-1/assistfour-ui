<script setup lang="ts">
import { computed, ref } from 'vue'
import { Action, type Ros } from 'roslib'
import type {
  GetPoseResponse,
  NamedLink,
  SetPoseFeedback,
  SetPoseGoal,
  SetPoseResult,
} from '@/types/messages.ts'
import type { RosTransformStamped } from '@/types/ros.ts'

// Props.
const { ros, poses, sequence } = defineProps<{
  ros: Ros
  poses: Record<string, GetPoseResponse>
  sequence: NamedLink[]
}>()

// State.
const selectedPose = ref<number | undefined>()
const sequenceOptions = computed(() => sequence.map(({ name }, index) => ({ name, index })))
const setPoseAction = new Action<SetPoseGoal, SetPoseFeedback, SetPoseResult>({
    ros,
    name: '/set_pose',
    actionType: 'stretch_pose_interfaces/action/SetPose',
  })

// Events.
const emit = defineEmits<{ (e: 'onDeleteFromSequence', index: number): void }>()

// Functions.
function deletePose() {
  emit('onDeleteFromSequence', selectedPose.value!)
  selectedPose.value = undefined
}

function getTargetPoseFromLink(pose: GetPoseResponse, link: string): RosTransformStamped {
  if (link === 'base_link') return pose.robot_pose
  if (link === 'odom') return pose.world_pose
  if (link === 'column_4') return pose.aruco_pose
  throw new Error(`Unsupported sequence link: ${link}`)
}

async function runSetPoseGoal(goalMessage: SetPoseGoal): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    setPoseAction.sendGoal(
      goalMessage,
      (result: SetPoseResult) => {
        console.log('Result: ', result)
        if (result.success) {
          resolve()
        } else {
          reject(new Error(result.message))
        }
      },
      (feedback: SetPoseFeedback) => {
        console.log('Feedback: ', feedback)
      },
    )
  })
}

async function runSequence() {
  for (const poseLink of sequence) {
    const pose = poses[poseLink.name]
    if (!pose) {
      console.error(`Pose "${poseLink.name}" does not exist.`)
      return
    }

    const targetPose = getTargetPoseFromLink(pose, poseLink.link)
    try {
      await runSetPoseGoal({ target_pose: targetPose })
    } catch (error) {
      console.error('Failed to run sequence pose:', error)
      return
    }
  }
}
</script>

<template>
  <Panel header="Sequencer">
    <Listbox
      v-model="selectedPose"
      :options="sequenceOptions"
      optionLabel="name"
      optionValue="index"
    />
    <br />
    <div class="flex gap-4">
      <Button
        label="Delete Pose"
        severity="danger"
        :disabled="selectedPose === undefined"
        @click="deletePose"
      />
      <Button label="Run" @click="runSequence" />
    </div>
  </Panel>
</template>
