import { BreadcrumbMatch } from 'use-react-router-breadcrumbs';
import { useAppState } from 'state';

export const BuildingBreadcrumb = ({ match }: { match: BreadcrumbMatch; }) => {
    let id = match.params.building_id ?? '';
    const machines = useAppState(state => state.machines.items);
    let building = machines[id];
    return building ? building.name : id ;
};

export const ProductBreadcrumb = ({ match }: { match: BreadcrumbMatch; }) => {
    let id = match.params.product_id ?? '';
    const products = useAppState(state => state.products.items);
    let product = products[id];
    return product ? product.name : id ;
};

export const RecipeBreadcrumb = ({ match }: { match: BreadcrumbMatch; }) => {
    let id = match.params.recipe_id ?? '';
    const recipes = useAppState(state => state.recipes.items);
    let recipe = recipes[id];
    return recipe ? recipe.name : id ;
};