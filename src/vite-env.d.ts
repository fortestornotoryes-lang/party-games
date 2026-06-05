/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Uppercase extensions — needed for case-sensitive Linux CI
declare module '*.JPG' {
    const src: string;
    export default src;
}
declare module '*.JPEG' {
    const src: string;
    export default src;
}
declare module '*.PNG' {
    const src: string;
    export default src;
}
