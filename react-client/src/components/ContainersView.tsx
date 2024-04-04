
import React, { useState } from 'react';
import {
    makeStyles, shorthands
} from '@fluentui/react-components';
import { IContainer } from '../../../common/schemas/ContainerSchemas';
import { ContainerSelector } from './ContainerSelector';
import ContainerBrowser from './ContainerBrowser';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding('25px'),
    },
    containerSelector: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: '10px',
        width: '100%',
        ...shorthands.padding('25px'),
    }
});

export const ContainersView: React.FunctionComponent = (props: any) => {
    const [selectedContainer, setSelectedContainer] = useState<IContainer | undefined>(undefined);
    const styles = useStyles();
    return (
        <div className={styles.root}>
            <div className={styles.containerSelector}>      
                <ContainerSelector onContainerSelected={setSelectedContainer} />
            </div>
            <div className={styles.containerSelector}>      
                {selectedContainer && (
                    <ContainerBrowser container={selectedContainer} />
                )}
            </div>
        </div>
    );
}

export default ContainersView;
