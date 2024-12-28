/// <reference types="vite/client" />

declare module 'vite' {
    import { UserConfig } from 'vite';
    export default UserConfig;
  }
  
  declare module '@vitejs/plugin-react' {
    const plugin: any;
    export default plugin;
  }
  