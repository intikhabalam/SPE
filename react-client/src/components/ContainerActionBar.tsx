
import React, { useEffect, useRef, useState } from 'react';
import {
    makeStyles, shorthands, Button,
    Menu, MenuButton, MenuList, MenuItem, MenuPopover, MenuTrigger, Switch, SwitchOnChangeData,
} from '@fluentui/react-components';
import {
    Share20Filled,
    ArrowUpload20Filled,
    Rename20Filled,
    Delete20Filled,
    Open20Filled,
    Globe20Filled,
    PreviewLink20Filled,
    ArrowDownload20Regular,
    Add20Filled,
    Folder24Filled,
} from '@fluentui/react-icons';
import { IDriveItem } from '../common/FileSchemas';
import { GraphProvider } from '../providers/GraphProvider';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import { Icon } from '@fluentui/react';
import { ContainerSettingsDialog } from './ContainerSettingsDialog';
import { IContainer } from '../../../common/schemas/ContainerSchemas';
import { ContainersApiProvider } from '../providers/ContainersApiProvider';

const containersApi = ContainersApiProvider.instance;
const filesApi = GraphProvider.instance;

const useStyles = makeStyles({
    actionBar: {
        columnGap: "2px",
        display: "flex",
        width: '100%',
        fontSize: '10px',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.05)',
        marginBottom: '20px',
        ...shorthands.borderRadius('10px'),
        ...shorthands.padding('10px'),
    },
    processingSwitch: {
        alignContent: 'flex-end',
        textAlign: 'left',
        alignItems: 'left',
        justifyContent: 'left',
    }
});

type IPendingUpload = {
    driveId: string;
    parentId: string;
    file: File;
    uploadTask: Promise<IDriveItem>;
}

export interface IContainerActionBarProps {
    container: IContainer;
    parentId: string;
    selectedItem?: IDriveItem;
    onFilePreviewSelected?: (file: IDriveItem) => void;
    onItemsUpdated?: () => void;
}

export const ContainerActionBar: React.FunctionComponent<IContainerActionBarProps> = (props: IContainerActionBarProps) => {
    //const [container, setContainer] = useState<IContainer>(props.container);
    const [showContainerSettings, setShowContainerSettings] = useState(false);
    const [uploads, setUploads] = useState<Map<string, IPendingUpload>>(new Map<string, IPendingUpload>());
    const [processingEnabled, setProcessingEnabled] = useState(props.container.customProperties?.docProcessingSubscriptionId !== undefined);
    const uploadFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setProcessingEnabled(props.container.customProperties?.docProcessingSubscriptionId !== undefined);
    }, [props.container.customProperties?.docProcessingSubscriptionId]);

    const onUploadFileClick = () => {
        if (uploadFileRef.current) {
            uploadFileRef.current.click();
        }
    };

    const onUploadFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            return;
        }
        for (let i = 0; i < files.length; i++) {
            const upload: IPendingUpload = {
                driveId: props.container.id,
                parentId: props.parentId,
                file: files[i],
                uploadTask: filesApi.uploadFile(props.container.id, files[i], props.parentId)
            };
            const uploadId = `${upload.driveId}/${upload.parentId}/${files[i].name}`;
            uploads.set(uploadId, upload);
            upload.uploadTask.then(() => {
                uploads.delete(uploadId);
                setUploads(new Map<string, IPendingUpload>(uploads));
                if (uploads.size === 0) {
                    props.onItemsUpdated?.();
                }
            });
        }
        setUploads(new Map<string, IPendingUpload>(uploads));
    };

    const processingEnabledChanged = async (event: React.ChangeEvent<HTMLInputElement>, data: SwitchOnChangeData) => {
        if (data.checked) {
            //setContainer(await containersApi.disableProcessing(props.container.id));
            containersApi.enableProcessing(props.container.id)
                .catch((error) => {
                    console.error(error);
                    setProcessingEnabled(false);
                })
                .finally(() => props.onItemsUpdated?.());
            setProcessingEnabled(true);
        } else {
            //setContainer(await containersApi.disableProcessing(props.container.id));
            containersApi.disableProcessing(props.container.id)
                .catch((error) => {
                    console.error(error);
                    setProcessingEnabled(true);
                })
                .finally(() => props.onItemsUpdated?.());
            setProcessingEnabled(false);
        }
    };

    const styles = useStyles();
    return (
        <div className={styles.actionBar}>
            <input ref={uploadFileRef} type="file" multiple onChange={onUploadFileSelected} style={{ display: 'none' }} />
            <Button onClick={onUploadFileClick} appearance="primary" icon={<ArrowUpload20Filled />} size='small'>Upload</Button>
            
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <MenuButton icon={<Add20Filled />} appearance='secondary' size='small'>New</MenuButton>
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>
                        <MenuItem
                            icon={<Icon {...getFileTypeIconProps({ extension: 'docx', size: 20 })} />}
                            onClick={() => console.log('New Word document')}
                        >
                            Word document
                        </MenuItem>
                        <MenuItem
                          icon={<Icon {...getFileTypeIconProps({ extension: 'pptx', size: 20 })} />}
                          onClick={() => console.log('New PowerPoint document')}
                      >
                          PowerPoint document
                        </MenuItem>
                        <MenuItem
                          icon={<Icon {...getFileTypeIconProps({ extension: 'xlsx', size: 20 })} />}
                          onClick={() => console.log('New Excel document')}
                      >
                          Excel document
                        </MenuItem>
                        <MenuItem
                          icon={<Folder24Filled primaryFill='#FFCE3D' />}
                          onClick={() => console.log('New Folder')}
                      >
                          Folder
                        </MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>

            {props.selectedItem && props.selectedItem.isFile && (<>
                <Menu>
                    <MenuTrigger disableButtonEnhancement>
                        <MenuButton icon={<Open20Filled />} appearance='subtle' size='small'>Open</MenuButton>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            {props.selectedItem.isOfficeDocument && (<>
                                {props.selectedItem.desktopUrl && (
                                    <MenuItem
                                        icon={<Icon {...getFileTypeIconProps({ extension: props.selectedItem.extension, size: 20 })} />}
                                        onClick={() => window.open(props.selectedItem!.desktopUrl)}
                                    >
                                        Open in desktop
                                    </MenuItem>
                                )}
                                {props.selectedItem.webUrl && (
                                    <MenuItem
                                        icon={<Globe20Filled />}
                                        onClick={() => window.open(props.selectedItem!.webUrl, '_blank')}
                                    >
                                        Open in web
                                    </MenuItem>
                                )}
                            </>)}
                            <MenuItem
                                icon={<PreviewLink20Filled />}
                                onClick={() => props.onFilePreviewSelected?.(props.selectedItem!)}
                            >
                                Preview in web
                            </MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
                <Button icon={<ArrowDownload20Regular />} size='small' appearance='subtle'>Download</Button>
            </>)}

            {props.selectedItem && (<>
                <Button icon={<Share20Filled />} size='small' appearance='subtle'>Share</Button>
                <Button icon={<Rename20Filled />} size='small' appearance='subtle'>Rename</Button>
                <Button icon={<Delete20Filled />} size='small' appearance='subtle'>Delete</Button>
            </>)}

            <ContainerSettingsDialog isOpen={showContainerSettings} container={props.container} />

            {uploads.size > 0 && <Button disabled={true}>{uploads.size} files uploading</Button>}
            <span className={styles.processingSwitch}>
                <Switch checked={processingEnabled} onChange={processingEnabledChanged} label="Receipt Processing" />
            </span>
        </div>
    );
}

export default ContainerActionBar;
