<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

const props = defineProps<{
  isActionInProgress: boolean
}>()

const emit = defineEmits<{
  stop: []
  'get-token': []
  'play-column': [column: number]
  'return-to-start': []
}>()

const recognition = ref<SpeechRecognitionLike | null>(null)
const listening = ref(false)
const errorMessage = ref('')
const currentActionLabel = ref('none')

watch(
  () => props.isActionInProgress,
  (isActionInProgress) => {
    if (!isActionInProgress) {
      currentActionLabel.value = 'none'
    }
  }
)

const isSupported = computed(() => {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
})

function normalizeTranscript(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

// Turn the spoken phrase into one of the app's supported commands.
function parseCommand(text: string): VoiceCommand | null {
  const normalized = normalizeTranscript(text)

  if (normalized === '') {
    return null
  }
  if (normalized.includes('return to start') || normalized === 'home') {
    return { type: 'return-to-start' }
  }
  if (normalized.includes('get token') || normalized === "pick up token") {
    return { type: 'get-token' }
  }
  if (normalized.includes('stop')) {
    return { type: 'stop' }
  }

  const columnNames: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7
  }

  const bareColumn = columnNames[normalized]
  if (bareColumn !== undefined) {
    return {
      type: 'play-column',
      column: bareColumn
    }
  }

  const columnMatch = normalized.match(/\bcolumn\s*(one|two|three|four|five|six|seven|1|2|3|4|5|6|7)\b/)
  if (columnMatch?.[1]) {
    const column = columnNames[columnMatch[1]]
    if (column === undefined) {
      return null
    }
    return {
      type: 'play-column',
      column
    }
  }
  return null
}

type VoiceCommand =
  | { type: 'get-token' }
  | { type: 'play-column'; column: number }
  | { type: 'return-to-start' }
  | { type: 'stop' }

function dispatchCommand(command: VoiceCommand): void {
  if (command.type === 'stop') {
    currentActionLabel.value = 'STOP'
    emit('stop')
    return
  }

  if (props.isActionInProgress) {
    return
  }

  if (command.type === 'get-token') {
    currentActionLabel.value = 'Get Token'
    emit('get-token')
    return
  }

  if (command.type === 'play-column') {
    currentActionLabel.value = `Column ${command.column}`
    emit('play-column', command.column)
    return
  }

  if (command.type === 'return-to-start') {
    currentActionLabel.value = 'Return to Start'
    emit('return-to-start')
  }
}

// Create the browser speech recognizer if the current browser supports it.
function createRecognition(): SpeechRecognitionLike | null {
  if (typeof window === 'undefined') {
    return null
  }

  const browserWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }

  const SpeechRecognitionCtor = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null
  if (!SpeechRecognitionCtor) {
    return null
  }

  const speechRecognition = new SpeechRecognitionCtor() as SpeechRecognitionLike
  speechRecognition.lang = 'en-US'
  speechRecognition.continuous = false
  speechRecognition.interimResults = true

  // When a final transcript arrives, parse it and send the matching command upward.
  speechRecognition.onresult = (event) => {
    let finalText = ''

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index]
      if (!result) {
        continue
      }
      const text = result[0]?.transcript ?? ''
      if (result.isFinal) {
        finalText += text
      }
    }

    if (finalText.trim() !== '') {
      const command = parseCommand(finalText)
      if (command) {
        dispatchCommand(command)
        if (command.type !== 'stop' || props.isActionInProgress) {
          recognition.value?.stop()
        }
      }
    }
  }

  speechRecognition.onerror = (event) => {
    errorMessage.value = event.error
    listening.value = false
  }
  speechRecognition.onend = () => {
    listening.value = false
  }
  return speechRecognition
}

// Start the mic only when the browser supports speech recognition and we are not already listening.
function startListening(): void {
  errorMessage.value = ''
  if (!isSupported.value) {
    errorMessage.value = 'Speech recognition is not supported in this browser.'
    return
  }
  if (listening.value) {
    return
  }
  if (!recognition.value) {
    recognition.value = createRecognition()
  }
  if (!recognition.value) {
    errorMessage.value = 'Unable to start speech recognition.'
    return
  }
  listening.value = true
  recognition.value.start()
}

// Stop the mic so the browser can finish the current recognition session.
function stopListening(): void {
  if (!recognition.value || !listening.value) {
    return
  }
  recognition.value.stop()
}

onBeforeUnmount(() => {
  recognition.value?.abort()
})
</script>

<template>
  <Panel header="Voice Commands">
    <div class="flex flex-wrap gap-3 items-center mb-4">
      <Button
        :label="listening ? 'Listening...' : 'Start Voice Control'"
        :severity="listening ? 'success' : 'primary'"
        :disabled="!isSupported || listening"
        @click="startListening"
      />
      <Button label="Stop Listening" severity="secondary" :disabled="!listening" @click="stopListening" />
    </div>

    <Message v-if="!isSupported" severity="warn" class="mb-3">
      This browser does not support the built-in Speech Recognition API.
    </Message>

    <Message v-else-if="errorMessage" severity="error" class="mb-3">
      {{ errorMessage }}
    </Message>

    <!-- Shows the last command the app is currently acting on. -->
    <div class="mt-2 rounded-md border border-dashed p-3 text-sm opacity-80">
      {{ currentActionLabel ? `Current status: ${currentActionLabel}` : 'Current action: none' }}
    </div>
  </Panel>
</template>