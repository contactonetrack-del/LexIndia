import { defineConfig } from "eslint/config";
import next from "eslint-config-next";

export default defineConfig([{
    ignores: [
        ".next/**",
        "node_modules/**",
        "playwright-report/**",
        "test-results/**",
    ],
}, {
    extends: [...next],
}]);
