import Vue from "vue";
import VueRouter from "vue-router";
import LoginPage from "@/views/LoginPage";
import DashboardPage from "@/views/DashboardPage";
import ProjectsPage from "@/views/ProjectsPage";

Vue.use(VueRouter)

const routes = [
    {name: 'Login', path: '/', component: LoginPage},
    {name: 'Projects', path: '/projects', component: ProjectsPage},
    {name: 'Dashboard', path: '/dashboard', component: DashboardPage},
    {path: '*', redirect: '/'}
]

const router = new VueRouter({base: '/', routes})

export default router