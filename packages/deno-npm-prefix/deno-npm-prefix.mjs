/**
 * @type {import('node:module').ResolveHook}
 */
function resolveNpmProtocol(specifier, ctx, nextResolve) {
	const cleanSpecifier = specifier.startsWith('npm:')
		? specifier.slice(4)
		: specifier;

	return nextResolve(cleanSpecifier, ctx);
}
export { resolveNpmProtocol as resolve };
