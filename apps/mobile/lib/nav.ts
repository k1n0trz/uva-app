import { router, type Href } from 'expo-router';

/**
 * `router.back()` is a no-op when there's no history — which happens whenever a
 * screen is opened directly: a deep link, a notification, or a shared URL on
 * web. Always give it somewhere to land.
 */
export function goBackOr(fallback: Href) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}
