import Vue from "vue";
import VueRouter from "vue-router";
import AppPage from "@/views/editor/app/AppPage.vue";
import DashboardPage from "@/views/main/dashboard/DashboardPage.vue";
import ProjectPage from "@/views/main/project/ProjectPage.vue";
import ThemePage from "@/views/main/theme/ThemePage.vue";
import DataSourcePage from "@/views/main/datasource/DataSourcePage.vue";
import QueryPage from "@/views/editor/query/QueryPage.vue";
import {authGuard} from "@/plugins/auth_guard";
import GuiEditorPage from "@/views/editor/guieditor/GuiEditorPage.vue";

Vue.use(VueRouter)

const routes = [
    {name: 'Dashboard', path: '/main/dashboard', component: DashboardPage},
    {name: 'NewProject', path: '/main/project/new', component: ProjectPage, beforeEnter: authGuard},
    {name: 'Project', path: '/main/project/:projectId', component: ProjectPage, beforeEnter: authGuard},
    {name: 'NewTheme', path: '/main/theme/new', component: ThemePage, beforeEnter: authGuard},
    {name: 'Theme', path: '/main/theme/:themeId', component: ThemePage, beforeEnter: authGuard},
    {name: 'NewDataSource', path: '/main/data/new', component: DataSourcePage, beforeEnter: authGuard},
    {name: 'DataSource', path: '/main/data/:dataSourceId', component: DataSourcePage, beforeEnter: authGuard},
    {name: 'App', path: '/editor/app/:projectId', component: AppPage, beforeEnter: authGuard},
    {
        name: 'GuiEditor',
        path: '/editor/gui/project=:projectId&page=:pageId',
        component: GuiEditorPage,
        beforeEnter: authGuard
    },
    {name: 'Query', path: '/editor/query/:queryId', component: QueryPage, beforeEnter: authGuard},
    {path: '*', redirect: '/main/dashboard'}
]

const router = new VueRouter({base: '/', routes})

export default router