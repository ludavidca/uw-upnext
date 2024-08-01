declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URI: string,
      TOGETHER_API: string,
    }
  }
}

export {};
