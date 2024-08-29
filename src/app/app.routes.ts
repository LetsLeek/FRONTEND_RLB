import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckProtocolTableComponent } from './check-protocol-table/check-protocol-table.component';
import { CheckDetailComponent } from './check-detail/check-detail.component';
import { ViewComponent } from './view/view.component';
import { KeywordComponent } from './keyword/keyword.component';
import { KeywordFormComponent } from './keyword-form/keyword-form.component';
import { MailViewComponent } from './mailview/mailview.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { MailViewDetailComponent } from './mailview-detail/mailview-detail.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'overview',
        component: ViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'produktion',
        component: ViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'it',
        component: ViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'net',
        component: ViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'mailview',
        component: MailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'mailview-detail/:id',
        component: MailViewDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'keywords',
        component: KeywordComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'keyword-form',
        component: KeywordFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'check-protocol-table',
        component: CheckProtocolTableComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'check-details/:id',
        component: CheckDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'overview'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

export default routes;
