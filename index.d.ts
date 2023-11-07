export {};

declare global {
  interface Window {
    env:{GOOGLE_CLIENT_ID: string};
  }
}