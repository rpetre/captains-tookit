import Layout from "components/navigation/Layout";
import Icons from "components/ui/Icons";

import NotFound from "screens/global/NotFound";
import Home from "screens/app/Home";
import Buildings from "screens/app/Buildings";
import Building from "screens/app/Building";
import Products from "screens/app/Products";
import Product from "screens/app/Product";
import Recipes from '../screens/app/Recipes';
import Recipe from '../screens/app/Recipe';
//import Calculator from '../screens/app/Calculator';
import { BuildingBreadcrumb, ProductBreadcrumb, RecipeBreadcrumb } from "components/navigation/Breadcrumbs";


let guestRoutes = {
    routes: [
        {
            path: '/',
            element: <Layout />,
            breadcrumb: 'Layout',
            children: [
                { index: true, element: <Home />, breadcrumb: 'Home' },
                //{ path: "calculator", element: <Calculator />, breadcrumb: 'Calculator' },
                { path: "buildings", element: <Buildings />, breadcrumb: 'Buildings' },
                { path: "buildings/:building_id", element: <Building />, breadcrumb: BuildingBreadcrumb },
                { path: "products", element: <Products />, breadcrumb: 'Products' },
                { path: "products/:product_id", element: <Product />, breadcrumb: ProductBreadcrumb },
                { path: "recipes", element: <Recipes />, breadcrumb: 'Recipes' },
                { path: "recipes/:recipe_id", element: <Recipe />, breadcrumb: RecipeBreadcrumb },
                { path: "*", element: <NotFound />, breadcrumb: 'Page Not Found', }
            ]
        }
    ],
    menu: [
        {
            to: '/',
            label: "Home",
            icon: Icons.home
        },
        {
            to: '/calculator',
            label: "Calculator",
            icon: Icons.home
        },
        {
            to: '/buildings',
            label: "Buildings",
            icon: Icons.home
        },
        {
            to: '/products',
            label: "Products",
            icon: Icons.home
        },
        {
            to: '/recipes',
            label: "Recipes",
            icon: Icons.home
        }
    ],
    mobile: [
        {
            to: '/',
            label: "Calculator",
            icon: Icons.home
        },
        // {
        //     to: '/buildings',
        //     label: "Home",
        //     icon: Icons.home
        // },
        // {
        //     to: '/products',
        //     label: "Products",
        //     icon: Icons.home
        // },
        // {
        //     to: '/recipes',
        //     label: "Recipes",
        //     icon: Icons.home
        // }
    ]
}

export default guestRoutes;