
import React, { useEffect, useState } from 'react';
import {
    Dropdown,
    Option,
    OptionOnSelectData,
    SelectionEvents,
    makeStyles,
    useId
} from '@fluentui/react-components';
import { IContainer } from '../../../common/schemas/ContainerSchemas';
import { ContainersApiProvider } from '../providers/ContainersApiProvider';
import { CreateContainerDialog } from './CreateContainerButton';

const containersApi = ContainersApiProvider.instance;

const useStyles = makeStyles({
    containerSelectorControls: {
        width: '400px',
    }
});

export type IContainerDropdownProps = {
    selectedContainerId?: string;
    onContainerSelected?: (container: IContainer) => void;
    refreshTime?: string;
}

export const ContainersDropdown: React.FunctionComponent<IContainerDropdownProps> = (props: IContainerDropdownProps) => {
    const [containers, setContainers] = useState<IContainer[] | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedContainerId, setSelectedContainerId] = useState<string | undefined>(props.selectedContainerId);
    const containerSelector = useId('containerSelector');

    useEffect(() => {
        (async () => {
            setLoading(true);
            const updatedContainers = await containersApi.list();
            if (updatedContainers) {
                setContainers(updatedContainers);
            }
            setLoading(false);
        })();
    }, [props.refreshTime]);
    
    const onContainerDropdownChange = (event: SelectionEvents, data: OptionOnSelectData) => {
        const selected = containers?.find((container) => container.id === data.optionValue);
        if (selected) {
            setSelectedContainerId(selected.id);
            props.onContainerSelected?.(selected);
        }
    };

    const containerCreatedHandler = (container: IContainer) => {
        setContainers(containers ? [...containers, container] : [container]);
        setSelectedContainerId(container.id);
        props.onContainerSelected?.(container);
    }

    const styles = useStyles();
    return (
        <React.Fragment>
            <Dropdown
                id={containerSelector}
                disabled={loading}
                placeholder="Select a Storage Container"
                value={containers?.find((container) => container.id === selectedContainerId)?.displayName || ''}
                selectedOptions={selectedContainerId ? [selectedContainerId] : []}
                className={styles.containerSelectorControls}
                onOptionSelect={onContainerDropdownChange}>
                {containers?.map((option) => (
                    <Option key={option.id} value={option.id}>{option.displayName}</Option>
                ))}
            </Dropdown>
            <CreateContainerDialog isOpen={false} onContainerCreated={containerCreatedHandler} />
        </React.Fragment>
        
    );
}
