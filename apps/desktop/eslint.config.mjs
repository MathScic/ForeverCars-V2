import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import base from "../../eslint.base.mjs";

export default tseslint.config(
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  { ignores: ["playwright-report/**", "test-results/**"] },
  ...base,
);
