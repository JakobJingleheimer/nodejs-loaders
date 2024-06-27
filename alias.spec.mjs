import assert from "node:assert/strict";
import { before, describe, test } from "node:test";

import * as td from "testdouble";

import { nextResolve } from "./nextResolve.fixture.mjs";

describe("alias", () => {
	const readFile = td.func("mock_readFile");
	const base = "file://";
	const aliases = {
		"…/*": ["./src/*"],
		ENV: ["https://example.com/env.json"],
		VARS: ["/vars.json"],
	};

	class ENOENT extends Error {
		code = "ENOENT";
	}

	before(async () => {
		await td.replaceEsm("node:fs/promises", { readFile });
		const nodeUrl = await import("node:url");
		await td.replaceEsm("node:url", {
			...nodeUrl,
			pathToFileURL() {
				return new URL(base);
			},
		});
	});

	describe("that are in tsconfig.json", async () => {
		let resolve;

		before(async () => {
			td.when(readFile(td.matchers.contains("/package.json"))).thenReject(
				new ENOENT(),
			); // shouldn't matter
			td.when(readFile(td.matchers.contains("/tsconfig.json"))).thenResolve(
				JSON.stringify({ compilerOptions: { paths: aliases } }),
			);

			({ resolve } = await import("./alias.mjs"));
		});

		await test(() => runCases(resolve));
	});

	describe("that are in package.json", async () => {
		let resolve;

		before(async () => {
			td.when(readFile(td.matchers.contains("/package.json"))).thenResolve(
				JSON.stringify({ aliases }),
			);
			td.when(readFile(td.matchers.contains("/tsconfig.json"))).thenReject(
				new ENOENT(),
			); // must be voided so package.json gets checked

			({ resolve } = await import("./alias.mjs"));
		});

		await test(() => runCases(resolve));
	});

	async function runCases(resolve) {
		await test("should de-alias a prefixed specifier", async () => {
			assert.equal(
				(await resolve("…/test.mjs", {}, nextResolve)).url,
				`${base}/src/test.mjs`,
			);
		});

		await test("should de-alias a pointer (fully-qualified url) specifier", async () => {
			assert.equal((await resolve("ENV", {}, nextResolve)).url, aliases.ENV[0]);
		});

		await test("should de-alias a pointer (absolute path) specifier", async () => {
			assert.equal(
				(await resolve("VARS", {}, nextResolve)).url,
				aliases.VARS[0],
			);
		});

		await test("should maintain any suffixes on the prefixed specifier", async () => {
			assert.equal(
				(await resolve("…/test.mjs?foo", {}, nextResolve)).url,
				`${base}/src/test.mjs?foo`,
			);
			assert.equal(
				(await resolve("…/test.mjs#bar", {}, nextResolve)).url,
				`${base}/src/test.mjs#bar`,
			);
			assert.equal(
				(await resolve("…/test.mjs?foo#bar", {}, nextResolve)).url,
				`${base}/src/test.mjs?foo#bar`,
			);
		});

		await test("should maintain any suffixes on the pointer (fully-qualified url) specifier", async () => {
			assert.equal(
				(await resolve("ENV?foo", {}, nextResolve)).url,
				`${aliases.ENV[0]}?foo`,
			);
			assert.equal(
				(await resolve("ENV#bar", {}, nextResolve)).url,
				`${aliases.ENV[0]}#bar`,
			);
			assert.equal(
				(await resolve("ENV?foo#bar", {}, nextResolve)).url,
				`${aliases.ENV[0]}?foo#bar`,
			);
		});

		await test("should maintain any suffixes on the pointer (absolute path) specifier", async () => {
			assert.equal(
				(await resolve("VARS?foo", {}, nextResolve)).url,
				`${aliases.VARS[0]}?foo`,
			);
			assert.equal(
				(await resolve("VARS#bar", {}, nextResolve)).url,
				`${aliases.VARS[0]}#bar`,
			);
			assert.equal(
				(await resolve("VARS?foo#bar", {}, nextResolve)).url,
				`${aliases.VARS[0]}?foo#bar`,
			);
		});
	}
});
