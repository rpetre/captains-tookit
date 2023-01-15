import { AsyncAction } from "state/_types";
import { ProductId, RecipeId } from '../../app/effects/loadJsonData';
import ProductionNode from "../ProductionNode";

type LinkRecipeParams = {
    currentNodeId: string;
    newNodeId: RecipeId;
    productId: ProductId;
    direction: 'input' | 'output';
}

export const linkRecipe: AsyncAction<LinkRecipeParams> = async ({ state, actions }, { currentNodeId, newNodeId, productId, direction }) => {

    console.log('linkRecipe; productId %s, direction %s', productId, direction);
    // New Node Config
    let recipe = state.recipes.items[newNodeId]
    let machine = state.machines.items[recipe.machine]
    let category = state.categories.items[machine.category_id]
    let inputs = recipe.inputs.map(({ id, quantity }) => ({ ...state.products.items[id], quantity }))
    let outputs = recipe.outputs.map(({ id, quantity }) => ({ ...state.products.items[id], quantity }))
    let sources = actions.recipes.getInputSources(newNodeId)
    let targets = actions.recipes.getOutputTargets(newNodeId)
    let nodeParams = {
        recipe,
        machine,
        category,
        inputs,
        outputs,
        sources,
        targets
    }

    // @TODO

    // Create New Node
    let newNode = new ProductionNode(nodeParams)

    // Link Current Node
    let currentNode = state.recipes.nodes[currentNodeId]

    // New Node Exports

    if (direction==='input') {

        let newNodeExportedQuantity = 0 ;
        let requestedQuantity = currentNode.inputs[productId].quantity * currentNode.machinesCount - currentNode.inputs[productId].imported;
        if (!machine.isMine  && !machine.isStorage ) {
            newNode.machinesCount = Math.ceil( requestedQuantity / newNode.outputs[productId].quantity );
            newNodeExportedQuantity = Math.min(newNode.outputs[productId].quantity * newNode.machinesCount, requestedQuantity);
            console.log('linkRecipe.input; requested %d, newoutput %d, count %d, exported %d',
                requestedQuantity,
                newNode.outputs[productId].quantity,
                newNode.machinesCount,
                newNodeExportedQuantity
            );
        }
        else {
            newNodeExportedQuantity = requestedQuantity;
        }

        let currentNodeImports = currentNode.addImport(productId, newNode.id, newNodeExportedQuantity)
        if (currentNodeImports) {
            newNode.addExport(productId, currentNodeId, currentNodeImports)
        }

    }

    if (direction==='output') {

        let currentNodeExportedQuantity = 0;
        let requestedQuantity = currentNode.outputs[productId].quantity * currentNode.machinesCount - currentNode.outputs[productId].exported;
        if (! currentNode.machine.isMine && !currentNode.machine.isStorage) {
            newNode.machinesCount = Math.ceil( requestedQuantity / newNode.inputs[productId].quantity )
            currentNodeExportedQuantity = Math.min(newNode.inputs[productId].quantity * newNode.machinesCount, currentNode.outputs[productId].quantity * currentNode.machinesCount) ;
            console.log('linkRecipe.output; requested %d, newinput %d, count %d, exported %d',
                 requestedQuantity,
                 newNode.inputs[productId].quantity,
                 newNode.machinesCount,
                 currentNodeExportedQuantity
                  );
        }
        else {
            currentNodeExportedQuantity = requestedQuantity;
        }

        let newNodeImports = newNode.addImport(productId, currentNodeId, currentNodeExportedQuantity)

        if (newNodeImports) {
            currentNode.addExport(productId, newNode.id, newNodeImports)
        }

    }

    state.recipes.nodes[newNode.id] = newNode

}