import {getInstance} from "./auth0";
import {Route} from "vue-router";

export const authGuard = (to: Route, from: Route, next: () => void) => {
    resetColors(to, from, next);
    const authService = getInstance();

    const fn = () => {
        if (authService.isAuthenticated) return next();
        authService.loginWithPopup({appState: {targetUrl: to.fullPath}});
    };

    if (!authService.loading) {
        return fn();
    }

    authService.$watch("loading", (loading: boolean) => {
        if (!loading) return fn();
    })
};

export const resetColors = (to: Route, from: Route, next: () => void) => {
    if (to.path.startsWith('/admin')) {
        // eslint-disable-next-line
        document!.getElementById('app')!.style.backgroundColor = '';
    }

    return next();
}