import { Routes } from '@angular/router';
import { RestaurantList } from './pages/restaurant-list/restaurant-list';
import { Menu } from './pages/menu/menu';
import { publicCostumerGuard } from './guard/only-public-costumer-guard';
import { RegisterPage } from './pages/register/register';
import { LoginPage } from './pages/login/login';
import { onlyLoggedCostumerGuard } from './guard/only-logged-costumer-guard';
import { Profile } from './pages/profile/profile';
import { BossAdmin } from './pages/boss-admin/boss-admin';

export const routes: Routes = [
    {
        path: "login",
        component: LoginPage,
        canActivate: [publicCostumerGuard]
    },
    {
        path: "register",
        component: RegisterPage,
        canActivate: [publicCostumerGuard]
    },
    {
        path: "menu/:userId",
        component: Menu,
        canActivate: [publicCostumerGuard]
    },
    {
        path: "restaurantes",
        component: RestaurantList,
        canActivate: [publicCostumerGuard]
    },
    {
        path: "perfil",
        component: Profile,
        canActivate: [onlyLoggedCostumerGuard]
    },
    {
        path: "admin",
        component: BossAdmin,
        canActivate: [onlyLoggedCostumerGuard]
    },
    {
        path: "",
        redirectTo: "restaurantes",
        pathMatch: "full",
    }
];
