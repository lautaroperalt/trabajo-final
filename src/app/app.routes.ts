import { Routes } from '@angular/router';
import { RestaurantList } from './pages/restaurant-list/restaurant-list';
import { Menu } from './pages/menu/menu';
import { publicCostumerGuard } from './guard/only-public-costumer-guard';
import { RegisterPage } from './pages/register/register';
import { LoginPage } from './pages/login/login';
import { onlyLoggedCostumerGuard } from './guard/only-logged-costumer-guard';
import { Profile } from './pages/profile/profile';
import { BossAdmin } from './pages/boss-admin/boss-admin';
import { BossForm } from './pages/boss-form/boss-form';
import { CategoryAdmin } from './pages/category-admin/category-admin';

export const routes: Routes = [
    //rutas publicas para todos
    {
        path: "restaurantes",
        component: RestaurantList
    },
    {
        path: "menu/:userId",
        component: Menu
    },
    
    //rutas para unicamete no logueados
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

    //rutas privadas
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
        path: "admin/nuevo", 
        component: BossForm,
        canActivate: [onlyLoggedCostumerGuard]
    },
    {
        path: "admin/editar/:id", 
        component: BossForm,
        canActivate: [onlyLoggedCostumerGuard]
    },
    {
        path: "admin/categorias", // Necesitas agregar un botón en BossAdmin para ir acá
        component: CategoryAdmin,
        canActivate: [onlyLoggedCostumerGuard]
    },

    // default
    {
        path: "",
        redirectTo: "restaurantes",
        pathMatch: "full",
    }
];
