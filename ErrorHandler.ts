export const ErrorHandler = (
  // error: Error,
  // info: { componentStack: string }
  error,
  info
) => {
  console.error(`Error: `, error, ` ComponentStack: `, info.componentStack);
  // rollbar
};
