import { Category, Machine, Product, Recipe, RecipeProduct } from "state/app/effects"
import { ProductRecipes } from "state/_types";
//import { Edge }  from 'react-flow-renderer';
//import { generateDarkColorHex } from "utils/colors";
//import { RecipeNode } from "components/calculator/Editor";

type ProductionNodeParams = {
    recipe: Recipe;
    machine: Machine;
    category: Category;
    inputs: (Product & RecipeProduct)[];
    outputs: (Product & RecipeProduct)[];
    sources: ProductRecipes;
    targets: ProductRecipes;
    count?: number;
}

export type RecipeIOImport =  {
    maxed: boolean;
    imported: number;
    imports: {
        source: string;
        quantity: number;
    }[]
}

export type RecipeIOExport =  {
    maxed: boolean;
    exported: number;
    exports: {
        target: string;
        quantity: number;
    }[]
}

export type RecipeIOImportProduct = Product & RecipeProduct & RecipeIOImport
export type RecipeIOExportProduct = Product & RecipeProduct & RecipeIOExport

export type RecipeIODictInput = {
    [index: string]: RecipeIOImportProduct
}

export type RecipeIODictOutput= {
    [index: string]: RecipeIOExportProduct
}

class ProductionNode {

    id: string;
    recipe: Recipe;
    machine: Machine;
    category: Category;

    inputs: RecipeIODictInput;
    outputs: RecipeIODictOutput;

    sources: ProductRecipes;
    targets: ProductRecipes;

    duration: number = 60;
    machinesCount: number = 0;
    usage: number = 0;

    constructor( { recipe, machine, category, inputs, outputs, sources, targets, count = 1 }: ProductionNodeParams ) {
        console.log('ProductionNode', { recipe, machine, category, inputs, outputs, sources, targets, count })
        this.id = recipe.id + `_${Date.now()}`
        this.recipe = {...recipe}
        this.machine = {...machine}
        this.category = {...category}

        if (count !== 1) {
            this.machinesCount = Math.ceil(count)
            this.usage = count
        } else {
            this.machinesCount = this.usage = 1
        }

        let inputProducts = inputs.reduce((items,item)=>({
            ...items, 
            [item.id]: {
                ...item,
                quantity: item.quantity,
                imported: 0,
                maxed: false,
                imports: []
            }
        }),{})

        let outputProducts = outputs.reduce((items,item)=>({
            ...items, 
            [item.id]: {
                ...item,
                quantity: item.quantity,
                exported: 0,
                maxed: false,
                exports: []
            }
        }),{})


        this.inputs = inputProducts
        this.outputs = outputProducts
        Object.values(this.outputs).forEach( item => {
            if ( item.id === 'electricity' || item.id === 'air_pollution' || item.id === 'water_pollution') {
                item.maxed = true
            }
        })

        this.sources = sources
        this.targets = targets
    }

    calculateProduct60(originalDuration: number, quantity: number) {
        return (this.duration/originalDuration) * quantity
    }

    canImport(productId: string): boolean {
        return this.inputs.hasOwnProperty(productId) && !this.inputs[productId].maxed
    }

    canExport(productId: string): boolean {
        return this.outputs.hasOwnProperty(productId) && !this.outputs[productId].maxed
    }

    increaseMachines() {
        this.machinesCount += 1;
        this.checkUsage()
    }

    decreaseMachines() {
        if (this.machinesCount >1 ) {
            this.machinesCount -=1 ;
            this.checkUsage();
        }
    }

    async removeExport(productId: string, targetRecipeId: string): Promise<void> {
        return new Promise(resolve=>{
            console.log('2',productId,targetRecipeId)
            let removedExports: RecipeIOExport['exports']  = []
            let remainingExports: RecipeIOExport['exports']  = []
            console.log('3',this.id)
            this.outputs[productId].exports.forEach(e=>{
                console.log('5',e.target,targetRecipeId)
                if (e.target===targetRecipeId) {
                    removedExports.push(e)
                    console.log('6',this.outputs[productId].exported, e.quantity)
                    this.outputs[productId].exported = this.outputs[productId].exported - e.quantity
                    console.log('7',this.outputs[productId].exported)
                } else {
                    remainingExports.push(e)
                }
            })
            this.outputs[productId].exports = remainingExports
            this.checkUsage()
            return resolve()
        })
    }

    addImport(productId: string, sourceRecipeId: string, importedQuantity: number): number | false {
        console.log('addimport: productId %s , sourceRecipeId %s, importedQuantity %d', productId, sourceRecipeId, importedQuantity);

        let amountToImport = 0

        // If Node Can Accept Input
        if (this.canImport(productId)) {

            let quantityNeeded = this.inputs[productId].quantity * this.machinesCount - this.inputs[productId].imported

            if (quantityNeeded>0) {

                if (quantityNeeded>=importedQuantity) {
                    amountToImport = importedQuantity
                } else {
                    amountToImport = quantityNeeded
                }
                
                this.inputs[productId].imports.push({
                    source: sourceRecipeId,
                    quantity: amountToImport
                })

                this.inputs[productId].imported += amountToImport

                if (this.inputs[productId].imported >= this.inputs[productId].quantity * this.machinesCount) {
                    this.inputs[productId].maxed = true
                }

                this.checkUsage()
                // Return How Much We Are Importing
                return amountToImport

            }

        }

        // Return False, Can't Import
        return false

    }

    addExport(productId: string, targetRecipeId: string, exportedQuantity: number) {
        this.outputs[productId].exports.push({
            target: targetRecipeId,
            quantity: exportedQuantity
        })
        this.outputs[productId].exported += exportedQuantity
        if (this.outputs[productId].exported >= this.outputs[productId].quantity * this.machinesCount) {
            this.outputs[productId].maxed = true
        }
        this.checkUsage()
    }

    checkUsage() {
        // for now, assume 100% usage
        this.usage = this.machinesCount ; return
        // let inputUsage = Object.keys(this.inputs).map( (id) =>  { return this.inputs[id].imported / this.inputs[id].quantity } )
        // let outputUsage = Object.keys(this.outputs)
        //     .filter( (id) => { return ( id !== 'electricity' && id !== 'air_pollution' && id !== 'water_pollution' ) })
        //     .map( (id) =>  { return this.outputs[id].exported / this.outputs[id].quantity } )
        // let usage = Math.min(...inputUsage, ...outputUsage)
        // Object.keys(this.outputs).forEach(id => {
        //         if ( id === 'electricity' || id === 'air_pollution' || id === 'water_pollution') {
        //             this.outputs[id].exported = this.outputs[id].quantity * usage
        //     }}
        // )
        // this.usage = usage
    }

    toJson() {
        return JSON.stringify({
            recipe: this.recipe,
            machine: this.machine,
            category: this.category,
            inputs: this.inputs,
            outputs: this.outputs,
            duration: this.duration
        })
    }

    /*
    get nodeData(): RecipeNode[] {
        let mainNode = {
            id: this.id,
            type: 'RecipeNode',
            data: this,
            position: { x: 0, y: 0 }
        }
        return [ mainNode ]
    }

    get edgeData(): Edge<any>[] {
        let edges: Edge<any>[] = []

        Object.values(this.inputs).forEach(input=>{
            input.imports.forEach(item=>{
                var edgeColor = generateDarkColorHex();
                edges.push({
                    id: `${item.source}-${this.id}`,
                    source: item.source,
                    sourceHandle: `${item.source}-${input.id}-output`,
                    target: this.id,
                    targetHandle: `${this.id}-${input.id}-input`,
                    style: { stroke: edgeColor, strokeWidth: 3 },
                    label: `${item.quantity}`,
                    labelBgPadding: [ 8, 4 ],
                    labelBgStyle: { fill: edgeColor},
                    labelStyle: {fill: "white"}
                })
            })
        })
        return edges
    }
    */

}

export default ProductionNode