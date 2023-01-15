import { Box, Group, Text, Image, Stack, Tooltip, Indicator } from '@mantine/core';
import { Icon } from "@iconify/react";
import { Link } from 'react-router-dom';

import PageHeader from 'components/layout/page/PageHeader';
import PageLayout from 'components/layout/page/PageLayout';

import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppState } from 'state';

const Recipe: React.FC = () => {
    const { itemsList } = useAppState(state => state.recipes)
    const products = useAppState(state => state.products.items)
    const machines = useAppState(state => state.machines.items)
    const {recipe_id: id} = useParams();
    let recipe = itemsList.find(items => {
        return id === items.id
    })

    if (!recipe) {
        return (
            <PageLayout header={<PageHeader title={`Recipe`} />} >
                <Box>
                    <Text>{id} not found</Text>
                </Box>
            </PageLayout>
        );
    }

    const building = machines[recipe.machine]

    let recipeInputs = recipe.inputs.map(p => {
        return {
            ...products[p.id],
            quantity: p.quantity
        }
    })
    let recipeOutputs = recipe.outputs.map(p => {
        return {
            ...products[p.id],
            quantity: p.quantity
        }
    })

    return (
        <PageLayout header={<PageHeader title={recipe.name} />} >
            <Stack spacing="xl">
                <Text weight={500}>{recipe.name}</Text>
                <Group spacing="xl">
                <Link to={`/buildings/${building.id}`}>
                    <Image height={43} radius="md"
                            src={`/assets/buildings/${building.icon}`} alt={building.name}
                    />
                </Link>
                {/* actual recipe */}
                <Group spacing="xs" noWrap>
                        <Group
                            noWrap
                            spacing="xs"
                            sx={theme => ({
                                '& .product-input .product-icon': {
                                    color: theme.colors.gray[6]
                                },
                                '& .product-input:last-child .product-icon': {
                                    display: 'none'
                                }
                            })}
                        >
                            {recipeInputs.map(product => {
                                return (
                                    <Group className="product-input" spacing="xs" key={`input_${product.id}`} noWrap>
                                        <Tooltip
                                            label={product.name}
                                            withArrow
                                            color="green"
                                            withinPortal
                                        >
                                            <Indicator label={product.quantity} color="green" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                                <Box
                                                    p={8}
                                                    sx={theme => ({
                                                        borderRadius: theme.radius.md,
                                                        border: `1px solid ${theme.colors.gray[1]}`,
                                                        background: theme.colors.gray[7]
                                                    })}
                                                >
                                                    <Link to={`/products/${product.id}`}>
                                                    <Image src={`/assets/products/${product.icon}`} height={22} width={22} />
                                                    </Link>
                                                </Box>
                                            </Indicator>
                                        </Tooltip>
                                        
                                            <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                        
                                    </Group>
                                )
                            })}
                        </Group>
                        <Group
                            spacing="xs">
                            <Icon className="results-icon" icon="icomoon-free:arrow-right" width={15} />
                        </Group>
                        <Group
                            noWrap
                            spacing="xs"
                            sx={theme => ({
                                '& .product-output .product-icon': {
                                    color: theme.colors.gray[6]
                                },
                                '& .product-output:last-child .product-icon': {
                                    display: 'none'
                                }
                            })}
                        >
                            {recipeOutputs.map(product => {
                                return (
                                    <Group className="product-output" spacing="xs" key={`output_${product.id}`} noWrap>
                                        <Tooltip
                                            label={product.name}
                                            withArrow
                                            color="red"
                                            withinPortal
                                        >
                                            <Indicator label={product.quantity} color="red" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                                <Box
                                                    p={8}
                                                    sx={theme => ({
                                                        borderRadius: theme.radius.md,
                                                        border: `1px solid ${theme.colors.gray[1]}`,
                                                        background: theme.colors.gray[7]
                                                    })}
                                                >
                                                    <Link to={`/products/${product.id}`}>
                                                    <Image src={`/assets/products/${product.icon}`} height={26} width={26} />
                                                    </Link>
                                                </Box>
                                            </Indicator>
                                        </Tooltip>
                                        
                                        <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                    </Group>
                                )
                            })}
                        </Group>
                </Group>
            </Group>
            </Stack>
        </PageLayout>
    )
}

export default Recipe;