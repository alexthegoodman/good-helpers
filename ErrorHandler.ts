export const ErrorHandler = (
  error: Error,
  info: { componentStack: string }
) => {
  console.error(`Error: `, error, ` ComponentStack: `, info.componentStack);
  // rollbar
};
