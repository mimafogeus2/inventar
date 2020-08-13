export const ResolveError = () =>
	'Failed to resolve the provided configuration. It might contains a circular dependency, or a reference to an undefined field.'
export const fieldDoesntExistYetError = (fieldName: any) => `The field ${String(fieldName)} doesn't exist (yet?)`
