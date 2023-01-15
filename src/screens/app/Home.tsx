import React from 'react';
import { Box, Grid, Divider, Card, Group, Stack, Text, Image, Tooltip } from '@mantine/core';
import PageHeader from 'components/layout/page/PageHeader';
import PageLayout from 'components/layout/page/PageLayout';
import { ProductMachineSelect } from 'components/products/ProductMachineSelect';
import { MachineRecipeSelect, RecipeSelectControlled } from 'components/recipes/MachineRecipeSelect';
import { ProductSelect } from 'components/products/ProductSelect';
import { useActions, useAppState } from 'state';
import { ProductId, Recipe, RecipeId } from 'state/app/effects';
import CostsIcon from 'components/ui/CostsIcons';
import NeedsBage from 'components/ui/NeedsBadge';
import ProductIcon from 'components/products/ProductIcon';
import { Icon } from '@iconify/react';
import CostsBadge from 'components/ui/CostsBadge';
import { ResultsSummary } from '../../components/ui/ResultsSummary';
import ProductionNode from 'state/recipes/ProductionNode';
import { MachineCountSelect } from 'components/ui/MachineCountSelect';

const Home: React.FC = () => {

    const { items: allCategories } = useAppState(state => state.categories)
    const { items: allProducts, currentItem: currentProduct } = useAppState(state => state.products)
    const { items: allMachines, currentItem: currentMachine } = useAppState(state => state.machines)
    const { items: allRecipes, nodes} = useAppState(state => state.recipes)

    const renderRecipeSelect = () => {
        if (!currentMachine) return null
        return <MachineRecipeSelect />
    }

    const renderProductSelect = () => {
        if (!currentProduct) return null
        return <ProductMachineSelect />
    }

    // gets a list of unbalanced inputs and outputs, given a list of nodes ; inputs are negative
    const productSummary = (nodes: ProductionNode[]) => {
        // get inputs of all nodes
        let summary = {} as { [index in ProductId]: number }
        nodes.forEach(node => {
            let count = node.usage
            Object.values(node.inputs).forEach(input => {               
                summary[input.id] = ( summary[input.id] ?? 0 ) - input.quantity * count
            })
            Object.values(node.outputs).forEach(output => {
                summary[output.id] = (summary[output.id] ?? 0) + output.quantity * count
            })
        })
        return summary
    }

    // show dropdowns for missing inputs with their respective quantities
    const renderMissingInputs = (nodes : ProductionNode[]) => {
        let summary = productSummary(nodes)
        let missingInputs : [string, number][]  = Object.entries(summary)
            .filter(([, quantity]) => quantity < 0) // pick negative uncancelled values as global inputs
            .map(([id, quantity]) => [id, -quantity]) // convert to positive values
        return Object.keys(missingInputs).length ? (
                    <Stack>
                        {missingInputs.map(( [id, quantity], key ) => {
                            let product = allProducts[id]
                            var inputSources = product.recipes.output.length ? product.recipes.output.map(recipeId => allRecipes[recipeId]) : []
                            return (
                                <Box
                                    key={key}
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'auto 1fr',
                                        gap: 5
                                    }}
                                >
                                    <ProductIcon product={product} />
                                    {inputSources.length ? (
                                    <RecipeSelect recipes={inputSources} direction={`input`} product={product.id} quantity={quantity}/>
                                     ) : <Text weight="bold" sx={theme => ({ color: theme.colors.gray[8] })}>{quantity}</Text> }
                                </Box>
                            )
                        })}
                    </Stack>
        ) : null
    }

    // show dropdowns for missing outputs with their respective quantities
    const renderMissingOutputs = (nodes : ProductionNode[]) => {
        let summary = productSummary(nodes)
        let missingOutputs = Object.entries(summary).filter(([id, quantity]) => quantity > 0)
        return Object.keys(missingOutputs).length ? (
            <Stack>
                {missingOutputs.map(([id, quantity], key) => {
                    let product = allProducts[id]
                    var outputSources = product.recipes.input.length ? product.recipes.input.map(recipeId => allRecipes[recipeId]) : []
                       return (
                        <Box
                                    key={key}
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'auto 1fr',
                                        gap: 5
                                    }}
                                >
                                    <ProductIcon product={product} />
                                    {outputSources.length ? (
                                    <RecipeSelect recipes={outputSources} direction={`output`} product={product.id} quantity={quantity} />
                                     ) : <Text weight="bold" sx={theme => ({ color: theme.colors.gray[8] })}>{quantity}</Text> }
                                </Box>
                    )
                })}
            </Stack>
        ) : null
    }

    // show a production node and its needs, considering machine count (whole number of factories) and usage (possible fractional number of factories)
    const renderNode = (node: ProductionNode) => {
        let recipe = node.recipe
        let machine = allMachines[recipe.machine]
        let category = allCategories[machine.category_id]
    
        return (
            <Card p={0} sx={theme => ({ border: `1px solid ${theme.colors.gray[4]}` })} >
                {/* card header */}
                <Group position="apart" align="center" p="xs">
                    <Group spacing={7}>
                        <Tooltip label={category.name} withArrow withinPortal >
                            <Box
                                p={4}
                                sx={theme => ({
                                    borderRadius: theme.radius.sm,
                                    background: theme.colors.dark[4]
                                })}
                            >
                                <Image src={`/assets/categories/${category.id}.png`} alt={category.name} height={22} />
                            </Box>
                        </Tooltip>
                        <Tooltip
                            label={machine.name}
                            withArrow
                            withinPortal
                        >
                            <Box
                                p={4}
                                sx={theme => ({
                                    borderRadius: theme.radius.sm,
                                    background: theme.colors.dark[4]
                                })}
                            >
                                <Image
                                    height={22}
                                    radius="md"
                                    src={`/assets/buildings/${machine.icon}`} alt={machine.name}
                                />
                            </Box>
                        </Tooltip>
                        <Group spacing={5}>
                            <Text weight="bolder" size="lg" sx={{ lineHeight: '1em' }}>{machine.name}</Text>
                            <Text weight="bold" size="sm" sx={{ lineHeight: '1em' }}>x{Math.round(node.usage*100)/100}</Text>
                        </Group>
                    </Group>
                    <MachineCountSelect nodeId={node.id} />
                    <Group spacing={4} align="center">
                        {machine.build_costs.map((product, key) => {
                            return <CostsBadge key={key} product={product} machineCount={node.machinesCount} />
                        })}
                        <NeedsBage need="workers" value={machine.workers} machineCount={node.machinesCount}/>
                        {machine.maintenance_cost_units === 'maintenance_i' && (
                            <NeedsBage need="maintenance1" value={machine.maintenance_cost_quantity} machineCount={node.usage} />
                        )}
                        {machine.maintenance_cost_units === 'maintenance_iI' && (
                            <NeedsBage need="maintenance2" value={machine.maintenance_cost_quantity} machineCount={node.usage}/>
                        )}
                        <NeedsBage need="electricity" value={machine.electricity_consumed} machineCount={node.usage}/>
                        <NeedsBage need="unity" value={machine.unity_cost} machineCount={node.machinesCount}/>
                        <NeedsBage need="computing" value={machine.computing_consumed} suffix="tf" machineCount={node.usage}/>
                    </Group>
                </Group>  
                <Divider my={0} variant="solid" labelPosition="center" color="gray" sx={theme => ({ borderTopColor: theme.colors.gray[4] })} />
                {/* card body */}
                <Box p="xs">
                    <Group noWrap position="center">
                        <Group noWrap spacing="xs"
                            sx={theme => ({
                                '& .product-input .product-icon': { color: theme.colors.gray[6], marginBottom: 18 },
                                '& .product-input:last-child .product-icon': { display: 'none' }
                            })}
                        >
                            {recipe.inputs.map((product, key) => {
                                return (
                                    <Group className="product-input" spacing="xs" key={`input_${product.id}`} noWrap>
                                        <CostsIcon key={key} recipeId={recipe.id} product={product} color="red" usage={node.usage} />
                                        <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                    </Group>
                                )
                            })}
                        </Group>
                        <Group spacing="xs" >
                            <Stack align="center" spacing={5}>
                                <Icon className="results-icon" icon="icomoon-free:arrow-right" width={15} />
                                <Text weight="bold" size="sm" sx={theme => ({ color: theme.colors.gray[6], lineHeight: `${theme.fontSizes.sm}px` })}>{recipe.duration}<small>/s</small></Text>
                            </Stack>
                        </Group>
                        <Group
                            noWrap
                            spacing="xs"
                            sx={theme => ({
                                '& .product-output .product-icon': {
                                    color: theme.colors.gray[6],
                                    marginBottom: 18
                                },
                                '& .product-output:last-child .product-icon': {
                                    display: 'none'
                                }
                            })}
                        >
                            {recipe.outputs.map((product, key) => {
                                return (
                                    <Group className="product-output" spacing="xs" key={`input_${product.id}`} noWrap>
                                        <CostsIcon key={key} recipeId={recipe.id} product={product} color="red" usage={node.usage} />
                                        <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                    </Group>
                                )
                            })}
                        </Group>
                    </Group>
    
                </Box>
            </Card>
        )
    }
    
    return (
        <PageLayout
            header={<PageHeader
                title={`Welcome`}
            />}
        >

            <Grid columns={16}>

                <Grid.Col md={11}>
                    
                <Stack spacing="sm">
                    {Object.keys(nodes).length === 0  ? (
                        <Grid>
                            <Grid.Col md={6}>
                                <ProductSelect />
                            </Grid.Col>
                            <Grid.Col md={6}>{renderProductSelect()}</Grid.Col>
                            <Grid.Col md={12}>{renderRecipeSelect()}</Grid.Col>
                        </Grid>
                    ) : null}
                        {renderMissingInputs(Object.values(nodes))}

                            <Box>
                            <Divider my="xs" label="Node List" />

                                <Stack spacing="sm">
                                     {/* {selectedRecipies.map((selectedRecipie, key) => {
                                        return (
                                            <React.Fragment key={key}>
                                                {renderRecipe(selectedRecipie)}
                                            </React.Fragment>
                                        )
                                    })} */}
                                    {Object.keys(nodes).map( (nodeId, key) => {
                                        return (
                                            <React.Fragment key={key}>
                                                {renderNode(nodes[nodeId])}
                                            </React.Fragment>
                                        )})
                                    }

                                </Stack>
                                <Divider my="xs" label="End Node List" />
                            </Box>
                            {renderMissingOutputs(Object.values(nodes))}
                    </Stack>

                </Grid.Col>

                <Grid.Col md={5}>

                    <Divider my="xs" label="Production Chain Summary" />

                        <ResultsSummary />

                </Grid.Col>

            </Grid>

        </PageLayout>
    )
}

type RecipeSelectProps = {
    direction: 'input' | 'output';
    product: ProductId;
    recipes: Recipe[];
    quantity?: number;
}

const RecipeSelect: React.FC<RecipeSelectProps> = ({ recipes, direction, product, quantity=60}) => {

    const selectRecipesItem = useActions().recipes.selectRecipesItem
    const { items: allRecipes} = useAppState(state => state.recipes)
    const { items: allProducts} = useAppState(state => state.products)


    const handleSelect = (recipeId: RecipeId) => {
        console.log("RecipeSelect %s %s %s", direction, product, quantity)
        var theoretical = 0
        switch (direction) {
            case 'input':
                allRecipes[recipeId].outputs.forEach((output) => {
                    if (output.id === product) {
                        theoretical = output.quantity
                    }
                })
                break;
            case 'output':
                allRecipes[recipeId].inputs.forEach((input) => {
                    if (input.id === product) {
                        theoretical = input.quantity
                    }
                })
                break;
        }
        console.log("Recipe %s quantity %s theoretical %s", recipeId, quantity, theoretical)
        const usage = quantity / theoretical
                
        selectRecipesItem({recipeId: recipeId, usage: usage})
    }

    var label = ''
    switch (direction) {
        case 'input':
            label = 'Select Input Recipe for ' + quantity + ' ' + allProducts[product].name
            break;
        case 'output':
            label = 'Select Output Recipe for ' + quantity + ' ' + allProducts[product].name
            break;
    }

    return (
        <React.Fragment>
            {recipes.length ? <RecipeSelectControlled recipes={recipes} onSelect={handleSelect} label={label} /> : null}
        </React.Fragment>
    )

}

export default Home;