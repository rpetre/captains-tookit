import React from "react";
import { Button, Text, Group, Sx} from "@mantine/core";
import ProductionNode from "state/recipes/ProductionNode";
import { useAppState, useActions } from "state";
import Icons from "./Icons";
import { Icon } from "@iconify/react";

type MachineCountSelectProps = {
    nodeId: string;
}

export const MachineCountSelect: React.FC<MachineCountSelectProps> = ({nodeId}) => {
    const node = useAppState(state => state.recipes.nodes[nodeId]) as ProductionNode
    const decrease = useActions().recipes.decreaseNode
    const increase = useActions().recipes.increaseNode
    const delNode = useActions().recipes.removeNode
    const style :Sx = (theme) => ({
        backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[8] : theme.colors.dark[2],
        ":hover": {
            backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[7] : theme.colors.dark[3],
        },
    })
    const textStyle :Sx = (theme) => ({
        color: theme.colorScheme === 'light' ? theme.colors.gray[0] : theme.colors.dark[9],
    })
    
    return (
        <React.Fragment>
            <Group spacing={0} sx={style}>
            {node.machinesCount >1 ?
                 <Button onClick={() => decrease(nodeId)} sx={style}><Icon icon={Icons.remove} /></Button>
                  : <Button onClick={() => delNode(nodeId)} sx={style}><Icon icon={Icons.delete} /></Button>}
            
            <Text sx={textStyle}>{node.machinesCount}</Text>
            <Button onClick={() => increase(nodeId)} sx={style}><Icon icon={Icons.add} /></Button>
            </Group>
        </React.Fragment>
    )
}