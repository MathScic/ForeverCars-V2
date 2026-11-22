import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import base from "../../eslint.base.mjs";

const eslintConfig = defineConfig([...nextVitals, ...nextTs, ...base]);

export default eslintConfig;
