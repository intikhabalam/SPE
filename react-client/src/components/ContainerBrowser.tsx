
import React, { useEffect, useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbButton,
    BreadcrumbItem,
    BreadcrumbDivider,
    makeStyles, shorthands, 
    Link, DataGrid, DataGridHeader, DataGridRow, DataGridHeaderCell, DataGridBody, DataGridCell, TableColumnDefinition, createTableColumn, TableCellLayout, OnSelectionChangeData,
} from '@fluentui/react-components';
import {
    Folder24Filled,
    Checkmark16Filled,
} from '@fluentui/react-icons';
//import { Person } from '@microsoft/mgt-react';
import { IContainer } from '../../../common/schemas/ContainerSchemas';
import { ContainersApiProvider } from '../providers/ContainersApiProvider';
import { IDriveItem } from '../common/FileSchemas';
import { GraphFilesProvider } from '../providers/GraphFilesProvider';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import { Icon } from '@fluentui/react';
import ContainerActionBar from './ContainerActionBar';

const containersApi = ContainersApiProvider.instance;
const filesApi = GraphFilesProvider.instance;

const useStyles = makeStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: '10px',
        ...shorthands.padding('25px'),
        width: '70%',
        marginTop: '50px',
        paddingBottom: '50px',
    },
    actionBar: {
        columnGap: "2px",
        display: "flex",
        fontSize: '10px',
        minWidth: '90%',
        marginBottom: '20px',
        ...shorthands.padding('10px'),
    },
    breadcrumb: {
        //width: '65%',
        textAlign: 'left',
        alignItems: 'left',
        justifyContent: 'left',
        minWidth: '90%',
        ...shorthands.margin('0px'),
        backgroundColor: '#EFEFEF',
        ...shorthands.padding('10px'),
    },
    filesTable: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        minWidth: '90%',
        minHeight: '200px',
        backgroundColor: 'white',
        //paddingLeft: '50px',
        //paddingRight: '100px',
        ...shorthands.borderRadius('10px'),
        ...shorthands.padding('20px'),
    },
});

export interface IContainerContentBrowserProps {
    container: IContainer;
}

export const ContainerBrowser: React.FunctionComponent<IContainerContentBrowserProps> = (props: IContainerContentBrowserProps) => {
    const [container, setContainer] = useState<IContainer>(props.container);
    const [parentId, setParentId] = useState<string>('root');
    const [driveItems, setDriveItems] = useState<IDriveItem[]>([] as IDriveItem[]);
    const [folderPath, setFolderPath] = useState<IDriveItem[]>([] as IDriveItem[]);
    const [selectedItem, setSelectedItem] = useState<IDriveItem | undefined>(undefined);
    const [selectedItemKeys, setSelectedItemKeys] = useState<string[]>([]);
    const [refreshTime, setRefreshTime] = useState<number>(0);

    useEffect(() => {
        (async () => {
            containersApi.get(props.container.id).then(setContainer);
        })();
    }, [props.container.id, refreshTime]);

    useEffect(() => {
        (async () => {
            filesApi.listItems(props.container.id, parentId).then(setDriveItems);
        })();
    }, [props.container.id, parentId, refreshTime]);

    const refresh = () => {
        setRefreshTime(new Date().getTime());
    }

    const setLocation = (newPath: IDriveItem[]) => {
        let newParentId = 'root';
        if (newPath.length > 0) {
            newParentId = newPath[newPath.length - 1].id;
        }
        if (newParentId !== parentId) {
            setFolderPath(newPath);
            setParentId(newParentId);
            clearSelection();
        }
    };

    const clearSelection = () => {
        setSelectedItem(undefined);
        setSelectedItemKeys([]);
    };

    const onBreadcrumbClick = (folder: IDriveItem) => {
        while (folderPath.length > 0 && folderPath[folderPath.length - 1].id !== folder.id) {
            folderPath.pop();
        }
        setLocation(folderPath);
    };

    const onFolderClicked = (folder: IDriveItem) => {
        setLocation([...folderPath, folder]);
    };

    const onSelectionChange = (ignored: any, data: OnSelectionChangeData) => {
        if (data.selectedItems.size > 1) {
            throw new Error('Only single selection is supported')
        }
        const selectedItemKey = data.selectedItems.values().next().value as string;
        if (selectedItemKey === selectedItem?.id) {
            clearSelection();
        } else {
            setSelectedItemKeys([selectedItemKey]);
            setSelectedItem(driveItems.find((item) => item.id === selectedItemKey)!);
        }
    }

    const onFilePreviewSelected = async (file: IDriveItem) => {
        if (!file.isFile) {
            return;
        }
        filesApi.getPreviewUrl(container.id, file.id).then((url) => {
            if (url) {
                window.open(url, '_blank');
            }
        });
    };

    const getItemIcon = (driveItem: IDriveItem): JSX.Element => {
        if (driveItem.folder) {
            return <Folder24Filled primaryFill='#FFCE3D' />;
        }
        const iconProps = getFileTypeIconProps({ extension: driveItem.extension, size: 24 });
        return <Icon {...iconProps} />;
    }

    const getItemName = (driveItem: IDriveItem): JSX.Element => {
        if (driveItem.isOfficeDocument) {
            return <Link href={driveItem!.webUrl!} target='_blank'>{driveItem.name}</Link>;
        }
        if (driveItem.folder) {
            return <Link onClick={() => onFolderClicked(driveItem)}>{driveItem.name}</Link>;
        }
        return <Link onClick={() => onFilePreviewSelected(driveItem)}>{driveItem.name}</Link>;
    }
   
    const columns: TableColumnDefinition<IDriveItem>[] = [
        createTableColumn({
            columnId: 'driveItemName',
            renderHeaderCell: () => {
                return 'Name'
            },
            renderCell: (driveItem) => {
                return (
                    <TableCellLayout media={getItemIcon(driveItem)}>
                        {getItemName(driveItem)}
                    </TableCellLayout>
                )
            }
        }),
        createTableColumn({
            columnId: 'lastModifiedTimestamp',
            renderHeaderCell: () => {
                return 'Modified'
            },
            renderCell: (driveItem) => {
                return (
                    <TableCellLayout>
                        {driveItem.lastModifiedDateTime}
                    </TableCellLayout>
                )
            }
        }),
        createTableColumn({
            columnId: 'lastModifiedBy',
            renderHeaderCell: () => {
                return 'Modified By'
            },
            renderCell: (driveItem) => {
                return (
                    <TableCellLayout>
                        {/*
                        <Person userId={driveItem.lastModifiedBy?.user?.id || ''}
                            view='oneline' 
                            showPresence={true} 
                            fallbackDetails={{ displayName: driveItem.modifiedByName}} 
                            personCardInteraction='hover'
                        />*/}
                        {driveItem.modifiedByName}
                    </TableCellLayout>
                )
            }
        }),
    ];
    if (container.customProperties?.docProcessingSubscriptionId) {
        columns.push(
            createTableColumn({
                columnId: 'Merchant',
                renderHeaderCell: () => {
                    return 'Merchant'
                },
                renderCell: (driveItem) => {
                    return (
                        <TableCellLayout>
                            {driveItem.listItem?.fields?.['Merchant']}
                        </TableCellLayout>
                    )
                }
            })
        );
        columns.push(
            createTableColumn({
                columnId: 'Total',
                renderHeaderCell: () => {
                    return 'Total'
                },
                renderCell: (driveItem) => {
                    return (
                        <TableCellLayout>
                            {driveItem.listItem?.fields?.['Total']}
                        </TableCellLayout>
                    )
                }
            })
        );
        columns.push(
            createTableColumn({
                columnId: 'DocProcessingCompleted',
                renderHeaderCell: () => {
                    return 'Processed'
                },
                renderCell: (driveItem) => {
                    return (
                        <TableCellLayout>
                            {driveItem.listItem?.fields?.['DocProcessingCompleted'] && (
                                <Checkmark16Filled />
                            )}
                        </TableCellLayout>
                    )
                }
            })
        );
    }

    const columnSizingOptions = {
        driveItemName: {
            minWidth: 350,
            defaultWidth: 350,
            idealWidth: 350
        },
        lastModifiedTimestamp: {
            minWidth: 150,
            defaultWidth: 150
        },
        lastModifiedBy: {
            minWidth: 150,
            defaultWidth: 150
        },
    };

    const styles = useStyles();
    return (
        <div className={styles.content}>
            <div className={styles.actionBar}>
                <ContainerActionBar 
                    container={container} 
                    parentId={parentId} 
                    selectedItem={selectedItem}
                    onFilePreviewSelected={onFilePreviewSelected}
                    onItemsUpdated={refresh}
                />
            </div>
            <div className={styles.breadcrumb}>
                <Breadcrumb size='large'>
                    <BreadcrumbItem>
                        <BreadcrumbButton size='large' onClick={() => setLocation([])}>{container.displayName}</BreadcrumbButton>
                    </BreadcrumbItem>
                    {folderPath.map((folder) => (
                        <React.Fragment key={folder.id}>
                            <BreadcrumbDivider />
                            <BreadcrumbItem>
                                <BreadcrumbButton onClick={() => onBreadcrumbClick(folder)}>{folder.name}</BreadcrumbButton>
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
                </Breadcrumb>
            </div>
            <div className={styles.filesTable}>
                <DataGrid
                    items={driveItems}
                    columns={columns}
                    getRowId={(item) => item.id}
                    resizableColumns
                    selectionMode="single"
                    columnSizingOptions={columnSizingOptions}
                    selectedItems={selectedItemKeys}
                    onSelectionChange={onSelectionChange}
                >
                    <DataGridHeader>
                        <DataGridRow
                            selectionCell={{checkboxIndicator: { "aria-label": "Select row" }}}
                        >
                            {({ renderHeaderCell }) => (
                                <DataGridHeaderCell><b>{renderHeaderCell()}</b></DataGridHeaderCell>
                            )}
                        </DataGridRow>
                    </DataGridHeader>
                    <DataGridBody<IDriveItem>>
                        {({ item, rowId }) => (
                            <DataGridRow<IDriveItem> 
                                key={rowId}
                                selectionCell={{checkboxIndicator: { "aria-label": "Select row" }}}
                            >
                                {({ renderCell, columnId }) => (
                                    <DataGridCell>
                                        {renderCell(item)}
                                    </DataGridCell>
                                )}
                            </DataGridRow>
                        )}
                    </DataGridBody>
                </DataGrid>
            </div>
        </div>
    );
}

export default ContainerBrowser;
