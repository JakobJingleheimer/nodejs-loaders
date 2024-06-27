export function Greet({ name }: { name: string }) {
	return <h1>Hello {name}</h1>;
}
Greet.displayName = "Greet";
