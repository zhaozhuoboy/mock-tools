// Ensure Monaco-related code only runs on client to avoid SSR issues
export default defineNuxtPlugin(() => {
  // Using @guolao/vue-monaco-editor which handles workers loading internally.
  // If in the future we need to customize worker paths, we can set:
  // ;(self as any).MonacoEnvironment = {
  //   getWorkerUrl: function (_moduleId: string, label: string) {
  //     return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
  //       self.MonacoEnvironment = { baseUrl: '/_monaco/' };
  //       importScripts('https://unpkg.com/monaco-editor@0.53.0/min/vs/base/worker/workerMain.js');
  //     `)}`
  //   }
  // }
})


