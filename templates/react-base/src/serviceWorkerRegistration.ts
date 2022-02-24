// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const IS_LOCALHOST = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.0/8 are considered localhost for IPv4.
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const SUPPORTS_SERVICE_WORKER = 'serviceWorker' in navigator;

type RegisterOptions = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void,
  onUpdate?: (registration: ServiceWorkerRegistration) => void,
}

export async function register(config?: RegisterOptions): Promise<void> {
  if (process.env.NODE_ENV === 'production' && SUPPORTS_SERVICE_WORKER) {

    // The URL constructor is available in all browsers that support SW.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const publicUrl = new URL(process.env.PUBLIC_PATH!, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', async () => {
      const serviceWorkerUrl = `${process.env.PUBLIC_PATH}service-worker.js`;

      if (IS_LOCALHOST) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        try {

          if (await checkValidServiceWorker(serviceWorkerUrl)) {
            // No service worker found. Probably a different app. Reload the page.
            await unregister();
            window.location.reload();
          } else {
            // Service worker found. Proceed as normal.
            await registerServiceWorker(serviceWorkerUrl, config);
          }

        } catch {
          // eslint-disable-next-line no-console
          console.log('No internet connection found. App is running in offline mode.');
        }

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        await navigator.serviceWorker.ready;
        // eslint-disable-next-line no-console
        console.log(
          'This web app is being served cache-first by a service ' +
          'worker. To learn more, visit https://cra.link/PWA'
        );
      } else {
        // Is not localhost. Just register service worker
        registerServiceWorker(serviceWorkerUrl, config);
      }
    });
  }
}

async function registerServiceWorker(url: string, config?: RegisterOptions) {
  try {
    const registration = await navigator.serviceWorker.register(url);

    registration.onupdatefound = () => {
      const installingWorker = registration.installing
      if (installingWorker == null) return;

      installingWorker.onstatechange = () => {
        if (installingWorker.state !== 'installed') return;

        if (navigator.serviceWorker.controller != null) {
          // At this point, the updated precached content has been fetched,
          // but the previous service worker will still serve the older
          // content until all client tabs are closed.
          // eslint-disable-next-line no-console
          console.log(
            'New content is available and will be used when all ' +
            'tabs for this page are closed. See https://cra.link/PWA.'
          );

          // Execute callback
          config?.onUpdate?.(registration);
        } else {
          // At this point, everything has been precached.
          // It's the perfect time to display a
          // "Content is cached for offline use." message.
          // eslint-disable-next-line no-console
          console.log('Content is cached for offline use.');

          // Execute callback
          config?.onSuccess?.(registration);
        }

      }
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during service worker registration:', error);
  }
}

// Check if the service worker can be found. If it can't reload the page.
async function checkValidServiceWorker(url: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const response = await fetch(url, { headers: { 'Service-Worker': 'script' } });

  const contentType = response.headers.get('content-type');

  return response.status === 404 || (contentType != null && !contentType.includes('javascript'));
}

export async function unregister(): Promise<void> {
  if (!SUPPORTS_SERVICE_WORKER) return;

  try {
    const registration = await navigator.serviceWorker.ready;

    registration.unregister();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error((error as Error).message);
  }

}
