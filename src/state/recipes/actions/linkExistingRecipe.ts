import { AsyncAction } from "state/_types";
import { ProductId } from '../../app/effects/loadJsonData';

type LinkRecipeParams = {
    currentNodeId: string;
    existingNodeId: string;
    productId: ProductId;
    direction: 'input' | 'output';
}

export const linkExistingRecipe: AsyncAction<LinkRecipeParams> = async ({ state, actions }, { currentNodeId, existingNodeId, productId, direction }) => {

    // Create New Node
    let existingNode = state.recipes.nodes[existingNodeId]

    // Link Current Node
    let currentNode = state.recipes.nodes[currentNodeId]

    // New Node Exports

    if (direction==='input') {

        let existingNodeExportedQuantity = 0;
        let requestedQuantity = currentNode.inputs[productId].quantity * currentNode.machinesCount - currentNode.inputs[productId].imported;
        if (!existingNode.machine.isMine  && !existingNode.machine.isStorage ) {
            let availableQuantity = existingNode.outputs[productId].quantity * existingNode.machinesCount - existingNode.outputs[productId].exported;
            existingNodeExportedQuantity = Math.min(requestedQuantity, availableQuantity)
            console.log('linkExistingRecipe.input; requested %d, available %d, exported %d',
                requestedQuantity,
                availableQuantity,
                existingNodeExportedQuantity
            );
        }
        else {
            existingNodeExportedQuantity = requestedQuantity
        }

        let currentNodeImports = currentNode.addImport(productId, existingNode.id, existingNodeExportedQuantity)

        if (currentNodeImports) {
            existingNode.addExport(productId, currentNodeId, currentNodeImports)
        }

    }

    if (direction==='output') {

        let currentNodeExportedQuantity = 0
        let requestedQuantity = currentNode.outputs[productId].quantity * currentNode.machinesCount - currentNode.outputs[productId].exported;
        if (! currentNode.machine.isMine && !currentNode.machine.isStorage) {
            let availableQuantity = existingNode.inputs[productId].quantity * existingNode.machinesCount - existingNode.inputs[productId].imported;
            currentNodeExportedQuantity = Math.min(requestedQuantity, availableQuantity);
            console.log('linkExistingRecipe.input; requested %d, available %d, exported %d',
                requestedQuantity,
                availableQuantity,
                currentNodeExportedQuantity
            );
        }
        else {
            currentNodeExportedQuantity = requestedQuantity;
        }

        let existingNodeImports = existingNode.addImport(productId, currentNodeId, currentNodeExportedQuantity)

        if (existingNodeImports) {
            currentNode.addExport(productId, existingNodeId, existingNodeImports)
        }

    }

}