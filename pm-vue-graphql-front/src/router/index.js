import Vue from "vue";
import VueRouter from "vue-router";
import LoginPage from "@/views/LoginPage";
import CanvasPage from "@/views/CanvasPage";
import DashboardPage from "@/views/DashboardPage";

Vue.use(VueRouter)

const routes = [
    {name: 'Login', path: '/', component: LoginPage},
    {name: 'Dashboard', path: '/dashboard', component: DashboardPage},
    {name: 'Canvas', path: '/canvas', component: CanvasPage},
    {path: '*', redirect: '/'}
]

const router = new VueRouter({base: '/', routes})

export default router