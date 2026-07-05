const AUTH_ERROR_MESSAGES: Record<string, string> = {
  Configuration:
    "Something went wrong while signing you in. Please request a new magic link.",
  Verification:
    "This sign-in link has expired or is invalid. Please request a new one.",
  AccessDenied: "Sign in was not allowed. Please try again.",
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method. Try signing in with Google instead.",
  OAuthCallbackError: "Google sign in was interrupted. Please try again.",
  EmailSignInError:
    "We could not send or verify your magic link. Please try again.",
  CallbackRouteError:
    "Sign in could not be completed. Please request a new magic link.",
  MissingCSRF: "Your sign-in session expired. Please try again.",
  InvalidCallbackUrl: "Sign in could not be completed. Please try again.",
  OAuthSignInError: "Google sign in could not be started. Please try again.",
  SessionTokenError: "Your session expired. Please sign in again.",
};

export function getAuthErrorMessage(error?: string | null): string | null {
  if (!error) {
    return null;
  }

  return (
    AUTH_ERROR_MESSAGES[error] ??
    "Something went wrong while signing in. Please try again."
  );
}
