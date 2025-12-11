interface ImportMetaEnv {
    readonly VITE_API_BEARER_TOKEN: string
    readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
declare const lucide: {
    createIcons: (options?: { icons?: Record<string, any> }) => void;
};