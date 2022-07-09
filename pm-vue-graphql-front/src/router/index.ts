import Vue from "vue";
import VueRouter from "vue-router";
import CanvasPage from "@/views/canvas/CanvasPage.vue";
import DashboardPage from "@/views/dashboard/DashboardPage.vue";
import ProjectPage from "@/views/project/ProjectPage.vue";
import ThemePage from "@/views/theme/ThemePage.vue";
import DataSourcePage from "@/views/datasource/DataSourcePage.vue";
import {authGuard} from "@/plugins/auth_guard";

Vue.use(VueRouter)

const routes = [
    {name: 'Dashboard', path: '/dashboard', component: DashboardPage},
    {name: 'Canvas', path: '/project/canvas/project=:projectId&page=:pageId?', component: CanvasPage, beforeEnter: authGuard},
    {name: 'NewProject', path: '/project/new', component: ProjectPage, beforeEnter: authGuard},
    {name: 'Project', path: '/project/:projectId', component: ProjectPage, beforeEnter: authGuard},
    {name: 'NewTheme', path: '/theme/new', component: ThemePage, beforeEnter: authGuard},
    {name: 'Theme', path: '/theme/:themeId', component: ThemePage, beforeEnter: authGuard},
    {name: 'NewDataSource', path: '/data/new', component: DataSourcePage, beforeEnter: authGuard},
    {name: 'DataSource', path: '/data/:dataSourceId', component: DataSourcePage, beforeEnter: authGuard},
    {path: '*', redirect: '/dashboard'}
]

const router = new VueRouter({base: '/', routes})

export default router