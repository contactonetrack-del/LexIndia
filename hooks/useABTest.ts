'use client';

import { useSyncExternalStore } from 'react';

type Variant = 'A' | 'B';

type Listener = () => void;

type ExperimentStore = {
  getSnapshot: () => Variant;
  subscribe: (listener: Listener) => () => void;
};

const DEFAULT_VARIANT: Variant = 'A';
const experimentStores = new Map<string, ExperimentStore>();
const experimentValues = new Map<string, Variant>();
const experimentListeners = new Map<string, Set<Listener>>();

function isVariant(value: string | null): value is Variant {
  return value === 'A' || value === 'B';
}

function getStorageKey(experimentName: string) {
  return `ab_test_${experimentName}`;
}

function readStoredVariant(experimentName: string): Variant | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedVariant = localStorage.getItem(getStorageKey(experimentName));
  return isVariant(storedVariant) ? storedVariant : null;
}

function initializeVariant(experimentName: string): Variant {
  const cachedVariant = experimentValues.get(experimentName);
  if (cachedVariant) {
    return cachedVariant;
  }

  const storedVariant = readStoredVariant(experimentName);
  const nextVariant = storedVariant ?? (Math.random() < 0.5 ? 'A' : 'B');

  if (typeof window !== 'undefined' && storedVariant === null) {
    localStorage.setItem(getStorageKey(experimentName), nextVariant);
  }

  experimentValues.set(experimentName, nextVariant);
  return nextVariant;
}

function notifyListeners(experimentName: string) {
  const listeners = experimentListeners.get(experimentName);
  if (!listeners) {
    return;
  }

  for (const listener of listeners) {
    listener();
  }
}

function getExperimentStore(experimentName: string): ExperimentStore {
  const existingStore = experimentStores.get(experimentName);
  if (existingStore) {
    return existingStore;
  }

  const store: ExperimentStore = {
    getSnapshot: () => experimentValues.get(experimentName) ?? DEFAULT_VARIANT,
    subscribe: (listener) => {
      if (typeof window === 'undefined') {
        return () => {};
      }

      let listeners = experimentListeners.get(experimentName);
      if (!listeners) {
        listeners = new Set();
        experimentListeners.set(experimentName, listeners);
      }

      listeners.add(listener);

      const previousVariant = experimentValues.get(experimentName) ?? DEFAULT_VARIANT;
      const currentVariant = initializeVariant(experimentName);

      if (currentVariant !== previousVariant) {
        listener();
      }

      const handleStorage = (event: StorageEvent) => {
        if (event.key !== getStorageKey(experimentName) || !isVariant(event.newValue)) {
          return;
        }

        if (experimentValues.get(experimentName) === event.newValue) {
          return;
        }

        experimentValues.set(experimentName, event.newValue);
        notifyListeners(experimentName);
      };

      window.addEventListener('storage', handleStorage);

      return () => {
        listeners?.delete(listener);
        if (listeners?.size === 0) {
          experimentListeners.delete(experimentName);
        }
        window.removeEventListener('storage', handleStorage);
      };
    },
  };

  experimentStores.set(experimentName, store);
  return store;
}

function getServerSnapshot(): Variant {
  return DEFAULT_VARIANT;
}

export function useABTest(experimentName: string): Variant {
  const store = getExperimentStore(experimentName);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);
}
