/* eslint-disable */

import _Vue from "vue";
import createAuth0Client, {
    Auth0Client,
    LogoutOptions,
    PopupConfigOptions,
    PopupLoginOptions
} from '@auth0/auth0-spa-js';

export declare interface Auth0PluginOptions {
    domain: string;
    clientId: string;
    redirectUri: string;
    onRedirectCallback: (appState: { targetUrl: string }) => void;
}

export declare interface Auth0User {
    email: string;
    nickname: string;
    picture: string;
}

declare interface Auth0Plugin {
    loginWithPopup(options?: PopupLoginOptions, config?: Auth0PluginOptions): void

    handleRedirectCallback(): void

    logout(options?: LogoutOptions): void

    loading: boolean;
    isAuthenticated: boolean;
    user: Auth0User;
    auth0Client: Auth0Client;
    popupOpen: boolean;
    error: Error;
}

let instance: any

export const getInstance = () => instance

export const useAuth0 = (options: Auth0PluginOptions) => {
    if (instance) return instance

    instance = new _Vue({
        data() {
            return {
                loading: true,
                isAuthenticated: false,
                user: {},
                auth0Client: null,
                popupOpen: false,
                error: null
            };
        },
        methods: {
            async loginWithPopup(options: PopupLoginOptions, config: PopupConfigOptions) {
                this.popupOpen = true

                try {
                    await this.auth0Client.loginWithPopup(options, config)
                    this.user = await this.auth0Client.getUser()
                    this.isAuthenticated = await this.auth0Client.isAuthenticated()
                    this.error = null
                } catch (e) {
                    this.user = null
                    this.isAuthenticated = false
                    this.error = e
                    return
                } finally {
                    this.popupOpen = false
                }

                this.user = await this.auth0Client.getUser()
                this.isAuthenticated = true
            },
            /** Handles the callback when logging in using a redirect */
            async handleRedirectCallback() {
                this.loading = true

                try {
                    await this.auth0Client.handleRedirectCallback()
                    this.user = await this.auth0Client.getUser()
                    this.isAuthenticated = true
                    this.error = null
                } catch (e) {
                    this.error = e
                } finally {
                    this.loading = false
                }
            },
            logout(options: LogoutOptions) {
                return this.auth0Client.logout(options)
            }
        },
        async created() {
            this.auth0Client = await createAuth0Client({
                ...options,
                client_id: options.clientId,
                redirect_uri: options.redirectUri,
                useRefreshTokens: true,
                cacheLocation: 'localstorage'
            });

            try {
                if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
                    const {appState} = await this.auth0Client.handleRedirectCallback()
                    this.error = null
                    options.onRedirectCallback(appState)
                }
            } catch (e) {
                this.error = e;
            } finally {
                this.isAuthenticated = await this.auth0Client.isAuthenticated()
                this.user = await this.auth0Client.getUser()
                this.loading = false
            }
        }
    });

    return instance
};

declare module 'vue/types/vue' {
    interface Vue {
        $auth: Auth0Plugin
    }
}

export function Auth0(Vue: typeof _Vue, options: Auth0PluginOptions): void {
    Vue.prototype.$auth = useAuth0(options)
}