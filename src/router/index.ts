import Vue from "vue";
import VueRouter from "vue-router";
import AppPage from "@/views/editor/app/AppPage.vue";
import DashboardPage from "@/views/main/dashboard/DashboardPage.vue";
import ProjectPage from "@/views/main/project/ProjectPage.vue";
import ThemePage from "@/views/main/theme/ThemePage.vue";
import DatasourcePage from "@/views/main/datasource/DatasourcePage.vue";
import QueryPage from "@/views/editor/query/QueryPage.vue";
import GuiEditorPage from "@/views/editor/guieditor/GuiEditorPage.vue";
import {authGuard} from "@/plugins/auth_guard";

Vue.use(VueRouter)

const routes = [
    {name: 'Dashboard', path: '/admin/main/dashboard', component: DashboardPage},
    {name: 'NewProject', path: '/admin/main/project/new', component: ProjectPage, beforeEnter: authGuard},
    {name: 'Project', path: '/admin/main/project/:projectId', component: ProjectPage, beforeEnter: authGuard},
    {name: 'NewTheme', path: '/admin/main/theme/new', component: ThemePage, beforeEnter: authGuard},
    {name: 'Theme', path: '/admin/main/theme/:themeId', component: ThemePage, beforeEnter: authGuard},
    {name: 'NewDatasource', path: '/admin/main/data/new', component: DatasourcePage, beforeEnter: authGuard},
    {name: 'Datasource', path: '/admin/main/data/:datasourceId', component: DatasourcePage, beforeEnter: authGuard},
    {name: 'App', path: '/admin/editor/app/:projectId', component: AppPage, beforeEnter: authGuard},
    {
        name: 'GuiEditor',
        path: '/admin/editor/gui/project=:projectId&page=:pageId&datasource=:datasourceId',
        component: GuiEditorPage,
        beforeEnter: authGuard
    },
    {
        name: 'Query',
        path: '/admin/editor/query/datasource=:datasourceId&query=:queryId',
        component: QueryPage,
        beforeEnter: authGuard
    },
    {path: '*', redirect: '/admin/main/dashboard'}
]

const router = new VueRouter({base: '/', routes})

export default router