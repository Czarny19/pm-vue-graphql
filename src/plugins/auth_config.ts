import router from "@/router";

export const auth0Domain = process.env.VUE_APP_AUTH0_DOMAIN;

export const auth0CientId = process.env.VUE_APP_AUTH0_CLIENTID;

export const auth0OnRedirectCallback = (appState: { targetUrl: string }) => {
    router.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname).then();
}