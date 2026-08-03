import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: GitHub Pages 프로젝트 페이지 경로 (레포 이름과 동일하게 맞춰주세요)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/",
});
