import { makeObservable, observable, action } from "mobx";
import { ISavedSession } from "src/types/session";

const SESSIONS_KEY = "poma-calcs:sessions";
const AUTO_KEY = "poma-calcs:auto";
const CURRENT_VERSION = 1;

type QuotaErrorCallback = () => void;

class SessionStore {
  namedSessions: Record<string, ISavedSession> = {};
  activeSessionName: string | undefined = undefined;

  private onQuotaError: QuotaErrorCallback | null = null;

  constructor() {
    makeObservable(this, {
      namedSessions: observable,
      activeSessionName: observable,
      loadFromStorage: action,
      saveSession: action,
      deleteSession: action,
      setActiveSessionName: action
    });
  }

  setOnQuotaError(cb: QuotaErrorCallback) {
    this.onQuotaError = cb;
  }

  setActiveSessionName(name: string | undefined) {
    this.activeSessionName = name;
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem(SESSIONS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        this.namedSessions = parsed as Record<string, ISavedSession>;
      }
    } catch {
      // Corrupt data — start with empty sessions
    }
  }

  saveSession(name: string, data: ISavedSession) {
    this.namedSessions = { ...this.namedSessions, [name]: data };
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(this.namedSessions));
    } catch (e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        this.onQuotaError?.();
      }
    }
  }

  deleteSession(name: string) {
    const updated = { ...this.namedSessions };
    delete updated[name];
    this.namedSessions = updated;
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(this.namedSessions));
    } catch {
      // Best effort
    }
  }

  readAutoSave():
    | { session: ISavedSession; corrupt: false }
    | { session: null; corrupt: boolean } {
    try {
      const raw = localStorage.getItem(AUTO_KEY);
      if (!raw) return { session: null, corrupt: false };
      const parsed = JSON.parse(raw) as ISavedSession;
      if (parsed.version !== CURRENT_VERSION) {
        return { session: null, corrupt: true };
      }
      return { session: parsed, corrupt: false };
    } catch {
      return { session: null, corrupt: true };
    }
  }

  writeAutoSave(data: ISavedSession) {
    try {
      localStorage.setItem(AUTO_KEY, JSON.stringify(data));
    } catch (e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        this.onQuotaError?.();
      }
    }
  }
}

export const sessionStore = new SessionStore();
