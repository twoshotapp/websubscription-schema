// Base types for client-server communication
export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface ServerResponse {
  action: string;
  [key: string]: any;
}

// Client to Server Messages
export interface AuthMessage extends WebSocketMessage {
  type: 'auth';
  token: string;
}

export interface SubscribeMessage extends WebSocketMessage {
  type: 'subscribe';
  topics: string[];
}

export interface UnsubscribeMessage extends WebSocketMessage {
  type: 'unsubscribe';
  topics: string[];
}

// Server to Client Messages
export interface AuthSuccessResponse extends ServerResponse {
  action: 'auth_success';
  userId: string;
}

export interface SubscribeResultResponse extends ServerResponse {
  action: 'subscribe_result';
  subscribed: string[];
  failed?: string[];  // Using 'failed' as it's what backend sends
}

export interface UnsubscribeResultResponse extends ServerResponse {
  action: 'unsubscribe_result';
  unsubscribed: string[];
}

export interface ErrorResponse extends ServerResponse {
  action: 'error';
  message: string;
}

// Notification Events Base
export interface NotificationResponse extends ServerResponse {
  action: 'notification';
  type: string;
  [key: string]: any;
}

// Generation Events
export interface GenerationAudioOutputEvent extends NotificationResponse {
  type: 'generation_audio_output';
  generationId: string;
  audioId: string;
  outputName: string;
  timestamp: string;
}

export interface GenerationCompleteEvent extends NotificationResponse {
  type: 'generation_complete';
  generationId: string;
  status: 'success' | 'failed';
  errorMessage?: string;
  timestamp: string;
}

// Project Events
export interface ProjectUpdateEvent extends NotificationResponse {
  type: 'project_update';
  projectId: string;
  userId: string;
  timestamp: string;
  message: string;
}

export interface ProjectDeleteEvent extends NotificationResponse {
  type: 'project_delete';
  projectId: string;
  userId: string;
  timestamp: string;
  message: string;
}

// Discriminated union of all WebSocket events
export type WebSocketEvent =
  | GenerationAudioOutputEvent
  | GenerationCompleteEvent
  | ProjectUpdateEvent
  | ProjectDeleteEvent;

// Type guards
export function isGenerationAudioOutputEvent(event: WebSocketEvent): event is GenerationAudioOutputEvent {
  return event.type === 'generation_audio_output';
}

export function isGenerationCompleteEvent(event: WebSocketEvent): event is GenerationCompleteEvent {
  return event.type === 'generation_complete';
}

export function isProjectUpdateEvent(event: WebSocketEvent): event is ProjectUpdateEvent {
  return event.type === 'project_update';
}

export function isProjectDeleteEvent(event: WebSocketEvent): event is ProjectDeleteEvent {
  return event.type === 'project_delete';
}

// Topic builders for type-safe topic construction
export const topics = {
  // Generation topics
  generation: (id: string) => `generation:${id}` as const,
  generationAudioOutput: (id: string) => `generation:${id}:audio-output` as const,
  generationComplete: (id: string) => `generation:${id}:complete` as const,
  
  // Project topics
  project: (id: string) => `studio-project:${id}:update` as const,
} as const;

// Utility type to extract topic patterns
export type TopicPattern = ReturnType<typeof topics[keyof typeof topics]>;

// Map topics to their event types
export type TopicEventMap = {
  [K in `generation:${string}`]: GenerationAudioOutputEvent | GenerationCompleteEvent;
} & {
  [K in `generation:${string}:audio-output`]: GenerationAudioOutputEvent;
} & {
  [K in `generation:${string}:complete`]: GenerationCompleteEvent;
} & {
  [K in `studio-project:${string}:update`]: ProjectUpdateEvent | ProjectDeleteEvent;
};

// Helper to get event type from topic
export type EventForTopic<T extends string> = T extends keyof TopicEventMap ? TopicEventMap[T] : WebSocketEvent;

// Redis event types (used by backend services)
export interface RedisEventMessage {
  eventType: string;
  [key: string]: any;
}

export interface GenerationAudioOutputRedisMessage extends RedisEventMessage {
  eventType: 'generation_audio_output';
  generationId: string;
  audioId: string;
  outputName: string;
  userId?: string;
  timestamp: string;
}

export interface GenerationCompleteRedisMessage extends RedisEventMessage {
  eventType: 'generation_complete';
  generationId: string;
  userId?: string;
  status: 'success' | 'failed';
  errorMessage?: string;
  timestamp: string;
}

export interface ProjectUpdateRedisMessage extends RedisEventMessage {
  eventType: 'project_update';
  projectId: string;
  userId: string;
  timestamp: string;
}

export interface ProjectDeleteRedisMessage extends RedisEventMessage {
  eventType: 'project_delete';
  projectId: string;
  userId: string;
  timestamp: string;
}

export type RedisMessage =
  | GenerationAudioOutputRedisMessage
  | GenerationCompleteRedisMessage
  | ProjectUpdateRedisMessage
  | ProjectDeleteRedisMessage;