import { Box, Card, Group, Text, Image, Stack } from '@mantine/core';
import PageHeader from 'components/layout/page/PageHeader';
import PageLayout from 'components/layout/page/PageLayout';
import React from 'react';
import { useAppState } from 'state';
import { Link, useParams } from 'react-router-dom';
import NeedsBage from 'components/ui/NeedsBadge';

const Building: React.FC = () => {

    const { itemsList } = useAppState(state => state.machines)
    const {building_id: id} = useParams();
    let building = itemsList.find(items => {
        return id === items.id
    })

    return (
        <PageLayout
            header={<PageHeader
                title={`Building`}
            />}
        >
            {!building  ? (
                <Box>
                    <Text>{id} not found</Text>
                </Box>
            ) : (
                <Box>
                    <Card
                        component={Link}
                        to={`/buildings/${building.id}`}
                        shadow="xs"
                        sx={(theme) => ({
                            '&:hover': {
                                backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[9],
                            },
                        })}
                    >
                        <Group position='apart'>
                            <Stack justify="space-between">
                                <Text weight={500} size="lg">{building.name}</Text>
                                <Group spacing={2}>
                                    <NeedsBage need="workers" value={building.workers} />
                                    {building.maintenance_cost_units === 'maintenance_i' && (
                                        <NeedsBage need="maintenance1" value={building.maintenance_cost_quantity} />
                                    )}
                                    {building.maintenance_cost_units === 'maintenance_iI' && (
                                        <NeedsBage need="maintenance2" value={building.maintenance_cost_quantity} />
                                    )}
                                    <NeedsBage need="electricity" value={building.electricity_consumed} />
                                    <NeedsBage need="unity" value={building.unity_cost} />
                                    <NeedsBage need="computing" value={building.computing_consumed} suffix="tf" />
                                </Group>
                            </Stack>
                            <Box
                                p="sm"
                                sx={theme => ({
                                    borderRadius: theme.radius.md,
                                    border: `1px solid ${theme.colors.gray[2]}`,
                                    background: theme.colors.gray[0]
                                })}
                            >
                                <Image
                                    height={43}
                                    radius="md"
                                    src={`/assets/buildings/${building.icon}`} alt={building.name}
                                />
                            </Box>
                        </Group>
                    </Card>
                </Box>
            )}
        </PageLayout>
    )
}

export default Building;