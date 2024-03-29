
import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Input,
    InputOnChangeData,
    InputProps,
    Label,
    Spinner,
    makeStyles,
} from '@fluentui/react-components';
import { IContainer, IContainerClientCreateRequest } from '../../../common/schemas/ContainerSchemas';
import { ContainersApiProvider } from '../providers/ContainersApiProvider';

const containersApi = ContainersApiProvider.instance;

const useStyles = makeStyles({
    containerSelectorControls: {
        width: '400px',
    },
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '10px',
        marginBottom: '25px'
    }
});

export type ICreateContainerDialogProps = {
    isOpen?: boolean;
    onAbort?: () => void;
    onContainerCreated?: (container: IContainer) => void;
}

export const CreateContainerDialog: React.FunctionComponent<ICreateContainerDialogProps> = (props: ICreateContainerDialogProps) => {
    const [isOpen, setIsOpen] = useState(props.isOpen || false);
    const [displayName, setDisplayName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [saving, setSaving] = React.useState(false);

    const handleDisplayNameChange: InputProps["onChange"] = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void => {
        setDisplayName(data?.value);
    };

    const handleDescriptionChange: InputProps["onChange"] = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void => {
        setDescription(data?.value);
    };

    const onCancelClick = () => {
        setIsOpen(false);
        props.onAbort?.();
    };

    const onCreateClick = async (): Promise<void> => {
        if (!displayName) {
            return;
        }
        setSaving(true);
        try {
            const createContainerRequest: IContainerClientCreateRequest = {
                displayName: displayName,
                description: description
            };
            const newContainer = await containersApi.create(createContainerRequest);
            props.onContainerCreated?.(newContainer);
            setIsOpen(false);
            setDisplayName('');
            setDescription('');
        } catch (error) {

        } finally {
            setSaving(false);
        }
    };

    const styles = useStyles();
    return (
        <>
            <Button
                appearance='primary'
                onClick={() => setIsOpen(true)}
            >
                Create storage container
            </Button>
            <Dialog open={isOpen}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Create a new storage Container</DialogTitle>
                        <DialogContent className={styles.dialogContent}>
                            <Label htmlFor={displayName}>Container name:</Label>
                            <Input 
                                id={displayName} 
                                className={styles.containerSelectorControls} 
                                autoFocus 
                                required
                                value={displayName} 
                                onChange={handleDisplayNameChange}
                            />
                            <Label htmlFor={description}>Container description:</Label>
                            <Input id={description} className={styles.containerSelectorControls} autoFocus required
                                value={description} onChange={handleDescriptionChange}></Input>
                            {saving &&
                                <Spinner size='medium' label="Creating storage Container..." labelPosition='after' />
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => { onCreateClick() }}
                                appearance="primary"
                                disabled={saving || (displayName === '')}
                            >
                                Create
                            </Button>
                            <Button
                                onClick={() => { onCancelClick(); }}
                                appearance="secondary"
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>);
}
