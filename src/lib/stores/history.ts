/**
 * Command-based undo/redo history system
 */

export type Command = {
  /** Execute the command */
  execute: () => void;
  /** Reverse the command */
  undo: () => void;
  /** Human-readable description for debugging/display */
  description: string;
};

type HistoryState = {
  commands: Command[];
  index: number; // Points to last executed command, -1 if none
  maxSize: number;
};

let state: HistoryState = {
  commands: [],
  index: -1,
  maxSize: 100,
};

// Subscribers for reactivity
type Subscriber = (canUndo: boolean, canRedo: boolean) => void;
const subscribers: Set<Subscriber> = new Set();

function notify() {
  const canUndo = state.index >= 0;
  const canRedo = state.index < state.commands.length - 1;
  subscribers.forEach((fn) => fn(canUndo, canRedo));
}

/**
 * Execute a command and add it to history
 */
export function execute(cmd: Command): void {
  // Execute the command
  cmd.execute();

  // Truncate any redo history (we're branching)
  state.commands = state.commands.slice(0, state.index + 1);

  // Add new command
  state.commands.push(cmd);
  state.index++;

  // Enforce max size (remove oldest)
  if (state.commands.length > state.maxSize) {
    state.commands.shift();
    state.index--;
  }

  notify();
}

/**
 * Record a command without executing it (for actions that already happened)
 * The command's execute function will be used for redo
 */
export function record(cmd: Command): void {
  // Truncate any redo history (we're branching)
  state.commands = state.commands.slice(0, state.index + 1);

  // Add new command
  state.commands.push(cmd);
  state.index++;

  // Enforce max size (remove oldest)
  if (state.commands.length > state.maxSize) {
    state.commands.shift();
    state.index--;
  }

  notify();
}

/**
 * Undo the last command
 */
export function undo(): boolean {
  if (state.index < 0) {
    return false;
  }

  const cmd = state.commands[state.index];
  cmd.undo();
  state.index--;

  notify();
  return true;
}

/**
 * Redo the next command
 */
export function redo(): boolean {
  if (state.index >= state.commands.length - 1) {
    return false;
  }

  state.index++;
  const cmd = state.commands[state.index];
  cmd.execute();

  notify();
  return true;
}

/**
 * Check if undo is available
 */
export function canUndo(): boolean {
  return state.index >= 0;
}

/**
 * Check if redo is available
 */
export function canRedo(): boolean {
  return state.index < state.commands.length - 1;
}

/**
 * Get the description of the command that would be undone
 */
export function getUndoDescription(): string | null {
  if (state.index < 0) return null;
  return state.commands[state.index].description;
}

/**
 * Get the description of the command that would be redone
 */
export function getRedoDescription(): string | null {
  if (state.index >= state.commands.length - 1) return null;
  return state.commands[state.index + 1].description;
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  state.commands = [];
  state.index = -1;
  notify();
}

/**
 * Subscribe to history changes
 */
export function subscribe(fn: Subscriber): () => void {
  subscribers.add(fn);
  // Immediately notify with current state
  fn(canUndo(), canRedo());
  // Return unsubscribe function
  return () => subscribers.delete(fn);
}

/**
 * Get history stats for debugging
 */
export function getHistoryStats(): { total: number; index: number; descriptions: string[] } {
  return {
    total: state.commands.length,
    index: state.index,
    descriptions: state.commands.map((c) => c.description),
  };
}
