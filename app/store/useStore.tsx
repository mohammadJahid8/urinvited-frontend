// app/store/useStore.js
import { create } from 'zustand';

type FormData = {
  [key: string]: any;
};

type StoreState = {
  formData: FormData;
  updateFormData: (data: FormData) => void;
};

const useStore = create<StoreState>((set) => ({
  formData: {},
  updateFormData: (data: FormData) => set({ formData: data }),
}));

export default useStore;
