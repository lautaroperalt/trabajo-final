import { Routes } from '@angular/router';
import { RestaurantList } from './pages/restaurant-list/restaurant-list';
import { Menu } from './pages/menu/menu';
import { publicCostumerGuard } from './guard/only-public-costumer-guard';
import { RegisterPage } from './pages/register/register';
import { LoginPage } from './pages/login/login';

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
        path: "menu/:userdId",
        component: Menu,
        canActivate: [publicCostumerGuard]
    },
    {
        path: "restaurantes",
        component: RestaurantList,
        canActivate: [publicCostumerGuard]
    }
];
