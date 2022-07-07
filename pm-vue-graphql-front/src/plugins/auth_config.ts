import router from "@/router";

export const auth0Domain = "dev-rukbv9em.us.auth0.com"

export const auth0CientId = "KnZBeUbH2syfxEUl2vmtbQCwegAJC8oG"

export const auth0OnRedirectCallback = (appState: { targetUrl: string }) => {
    router.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname).then()
}