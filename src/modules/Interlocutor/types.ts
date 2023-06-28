export interface CorrespondenceInterface {
  role: "user" | "gpt";
  message: string;
  timestump: number;
}
