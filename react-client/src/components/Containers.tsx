
import React, { useState } from 'react';
import {
    makeStyles, shorthands
} from '@fluentui/react-components';
import { IContainer } from '../../../common/schemas/ContainerSchemas';
import { ContainersDropdown } from './ContainersDropdown';
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

export const Containers: React.FunctionComponent = (props: any) => {
    const [selectedContainer, setSelectedContainer] = useState<IContainer | undefined>(undefined);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [containersRefreshTime, setContainersRefreshTime] = useState(Date.now());

    const styles = useStyles();
    //
    return (
        <div className={styles.root}>
            <div className={styles.containerSelector}>      
                <ContainersDropdown onContainerSelected={setSelectedContainer} />
                {selectedContainer && (
                    <ContainerBrowser container={selectedContainer} />
                )}
            </div>
        </div>
    );
}

export default Containers;
