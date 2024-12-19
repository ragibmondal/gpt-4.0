export interface Message {
  text: string;
  isUser: boolean;
  imageUrl?: string;
  type: 'text' | 'image' | 'imageAnalysis';
}

export interface PuterAI {
  chat: (prompt: string, imageUrl?: string, options?: { stream: boolean }) => Promise<any>;
  txt2img: (prompt: string) => Promise<HTMLImageElement>;
}