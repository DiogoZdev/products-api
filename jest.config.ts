import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

const config: Config.InitialOptions = {
	moduleFileExtensions: ["ts", "js", "json"],
	testRegex: ".*\\.spec\\.ts$",
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	preset: "ts-jest",
	rootDir: ".",
	clearMocks: true,
	coverageDirectory: "./coverage",
	testEnvironment: "node",
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: "<rootDir>/",
	}),
	collectCoverageFrom: [],
};

export default config;
