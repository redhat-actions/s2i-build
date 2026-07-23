import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            "node_modules/",
            "dist/",
            "out/",
            "lib/",
            "eslint.config.mjs",
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "module",
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Style rules matching the existing code conventions
            "brace-style": ["error", "stroustrup", { allowSingleLine: true }],
            "comma-dangle": ["error", {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "always-multiline",
                exports: "always-multiline",
                functions: "only-multiline",
            }],
            indent: ["error", 4],
            curly: "error",
            eqeqeq: ["error", "smart"],
            "max-len": ["error", 120, 4, {
                ignoreRegExpLiterals: true,
                ignoreStrings: false,
                ignoreTemplateLiterals: false,
                ignoreUrls: true,
            }],
            "no-console": "error",
            quotes: ["error", "double", { allowTemplateLiterals: true }],
            semi: ["error", "always"],

            // TypeScript rules
            "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-namespace": "off",
        },
    },
);
