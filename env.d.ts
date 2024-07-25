declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URI: string,
    }
  }
}

export {};
