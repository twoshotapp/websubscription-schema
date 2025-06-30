# WebSubscription Schema

Shared TypeScript types for WebSocket subscriptions in the TwoShot platform.

## Installation

This package is used as a git submodule in TwoShot services.

## Usage

```typescript
import { WebSocketEvent, GenerationAudioOutputEvent } from '@twoshot/websubscription-schema';

// Handle typed events
function handleEvent(event: WebSocketEvent) {
  switch (event.type) {
    case 'generation_audio_output':
      // event is typed as GenerationAudioOutputEvent
      console.log(event.audioId);
      break;
  }
}
```