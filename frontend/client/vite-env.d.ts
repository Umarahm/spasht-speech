/// <reference types="vite/client" />

interface ImportMetaEnv { }

interface ImportMeta {
    readonly env: ImportMetaEnv
}

// Speech Recognition API types
declare global {
    interface SpeechRecognitionEvent extends Event {
        readonly resultIndex: number;
        readonly results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionErrorEvent extends Event {
        readonly error: string;
        readonly message: string;
    }

    interface SpeechRecognition extends EventTarget {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
        onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
        onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
        onend: ((this: SpeechRecognition, ev: Event) => any) | null;
        start(): void;
        stop(): void;
    }

    var SpeechRecognition: {
        prototype: SpeechRecognition;
        new(): SpeechRecognition;
    };

    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}

export { };