import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CharacterSchema } from '../schemas';

export const useStore = create(
    persist(
        (set, get) => ({
            character: null,
            session: {
                characterId: null,
                sceneToken: 0,
                log: [],
            },
            customTags: [],

            setCharacter: (char) => {
                try {
                    const validated = CharacterSchema.parse(char);
                    set({ character: validated });
                } catch (error) {
                    console.error("Character Validation Error:", error.errors);
                    throw error;
                }
            },

            updateStats: (updates) => {
                set((state) => ({
                    character: state.character ? { ...state.character, ...updates } : null,
                }));
            },

            addLogEntry: (entry) => {
                set((state) => ({
                    session: {
                        ...state.session,
                        log: [entry, ...state.session.log].slice(0, 50),
                    },
                }));
            },

            addCustomTag: (tag, category) => {
                set((state) => ({
                    customTags: [...state.customTags, { tag, category }],
                }));
            },

            endScene: () => {
                set((state) => ({
                    character: state.character ? {
                        ...state.character,
                        karma: state.character.maxKarma || 3,
                        resolve: state.character.maxResolve || 3,
                        sceneCount: (state.character.sceneCount || 0) + 1,
                    } : null,
                }));
            },

            clearLog: () => {
                set((state) => ({
                    session: {
                        ...state.session,
                        log: [],
                    },
                }));
            },

            resetGame: () => {
                set({
                    character: null,
                    session: {
                        characterId: null,
                        sceneToken: 0,
                        log: [],
                    },
                });
            },
        }),
        {
            name: 'tricube-solo-storage',
        }
    )
);
