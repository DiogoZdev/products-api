export function generateId(): string {
	return new Date().getTime().toString(16).toUpperCase();
}
