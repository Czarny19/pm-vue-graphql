import Vue from "vue";
import VueRouter from "vue-router";
import LoginPage from "@/views/login/LoginPage";
import CanvasPage from "@/views/canvas/CanvasPage";
import DashboardPage from "@/views/dashboard/DashboardPage";
import AddAppPage from "@/views/addproject/AddProjectPage";
import ThemePage from "@/views/theme/ThemePage";

Vue.use(VueRouter)

const routes = [
    {name: 'Login', path: '/', component: LoginPage},
    {name: 'Dashboard', path: '/dashboard', component: DashboardPage},
    {name: 'Canvas', path: '/project/canvas/:projectId', component: CanvasPage},
    {name: 'Project', path: '/project/:projectId', component: AddAppPage},
    {name: 'NewTheme', path: '/theme/new', component: ThemePage},
    {name: 'Theme', path: '/theme/:themeId', component: ThemePage},
    {path: '*', redirect: '/'}
]

const router = new VueRouter({base: '/', routes})

export default router