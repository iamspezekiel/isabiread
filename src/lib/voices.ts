
export interface ICustomVoice {
  id: string;
  name: string;
  isCustom: true;
  audioDataUri: string;
}

export interface IPrebuiltVoice {
  id: string;
  name: string;
  isCustom?: false;
}

export type AnyVoice = ICustomVoice | IPrebuiltVoice;

// --- Local Storage Management for Custom Voices ---
const CUSTOM_VOICES_KEY = 'isabiread_cloned_voices';

export function getCustomVoices(): ICustomVoice[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const voicesJson = localStorage.getItem(CUSTOM_VOICES_KEY);
    return voicesJson ? JSON.parse(voicesJson) : [];
  } catch (error) {
    console.error('Error reading custom voices from localStorage:', error);
    return [];
  }
}

export function addCustomVoice(name: string, audioDataUri: string): ICustomVoice {
  const currentVoices = getCustomVoices();
  const newVoice: ICustomVoice = {
    id: `custom_${Date.now()}`,
    name: name,
    isCustom: true,
    audioDataUri,
  };
  const updatedVoices = [...currentVoices, newVoice];
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_VOICES_KEY, JSON.stringify(updatedVoices));
  }
  
  return newVoice;
}

export function removeCustomVoice(voiceId: string): void {
   const currentVoices = getCustomVoices();
   const updatedVoices = currentVoices.filter(v => v.id !== voiceId);

   if (typeof window !== 'undefined') {
     localStorage.setItem(CUSTOM_VOICES_KEY, JSON.stringify(updatedVoices));
   }
}

// --- Voice Lists ---

export const prebuiltVoices: IPrebuiltVoice[] = [
  { id: 'algenib', name: 'Algenib (Female, Calm)' },
  { id: 'achernar', name: 'Achernar (Male, Calm)' },
  { id: 'gacrux', name: 'Gacrux (Male, Warm)' },
  { id: 'vindemiatrix', name: 'Vindemiatrix (Female, Warm)' },
  { id: 'sadachbia', name: 'Sadachbia (Male, Professional)' },
  { id: 'schedar', name: 'Schedar (Female, Professional)' },
  { id: 'charon', name: 'Charon (Male, Deep)' },
  { id: 'autonoe', name: 'Autonoe (Female, Sweet)' },
];

/**
 * Gets all available voices, combining prebuilt and custom voices.
 * This function is designed to be called on the client-side.
 */
export function getAvailableVoices(): AnyVoice[] {
    const custom = getCustomVoices();
    // Add (Custom) suffix to the name for display
    const formattedCustom = custom.map(v => ({...v, name: `${v.name} (Custom)`}));
    return [...prebuiltVoices, ...formattedCustom];
}

/**
 * Gets details for a specific voice by its ID.
 */
export function getVoiceDetails(id: string): AnyVoice | undefined {
  return getAvailableVoices().find(voice => voice.id === id);
}

    