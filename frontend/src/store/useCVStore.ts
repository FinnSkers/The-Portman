import { create } from 'zustand';

interface CVState {
  file: File | null;
  filename: string | null;
  data: Record<string, unknown> | null;
  status: 'idle' | 'uploading' | 'uploaded' | 'parsing' | 'parsed' | 'error';
  error: string | null;
  setFile: (file: File | null) => void;
  setFilename: (filename: string | null) => void;
  setData: (data: Record<string, unknown> | null) => void;
  setStatus: (status: CVState['status']) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
}

export const useCVStore = create<CVState>((set) => ({
  file: null,
  filename: null,
  data: null,
  status: 'idle',
  error: null,
  setFile: (file) => set({ file }),
  setFilename: (filename) => set({ filename }),
  setData: (data) => set({ data }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  clearAll: () => set({ file: null, filename: null, data: null, status: 'idle', error: null }),
}));
