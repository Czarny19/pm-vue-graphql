import {getInstance} from "./auth0";
import {Route} from "vue-router";

export const authGuard = (to: Route, from: Route, next: () => void) => {
    const authService = getInstance();

    const fn = () => {
        if (authService.isAuthenticated) return next();

        authService.loginWithPopup({appState: {targetUrl: to.fullPath}});
    };

    if (!authService.loading) {
        return fn();
    }

    authService.$watch("loading", (loading: boolean) => {
        if (!loading) return fn()
    })
};