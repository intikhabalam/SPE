
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
import { GraphProvider } from '../providers/GraphProvider';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import { Icon } from '@fluentui/react';
import ContainerActionBar from './ContainerActionBar';
import { useLoaderData } from 'react-router-dom';
import { ILoaderParams } from '../common/ILoaderParams';

const containersApi = ContainersApiProvider.instance;
const filesApi = GraphProvider.instance;

export interface IContainerContentBrowserProps {
    container: IContainer | string;
}

export async function loader({ params }: ILoaderParams): Promise<IContainer | undefined> {
    console.log('ContainerBrowser.loader');
    console.log(params);
    const containerId = params.containerId as string || undefined;
    if (containerId) {
        console.log('fetching container using id ' + containerId);
        const container = await containersApi.get(containerId);
        console.log('fetched container ' + container.displayName);
        return container;
    }
}

export const ContainerBrowser: React.FunctionComponent = () => {
    //const [container, setContainer] = useState<IContainer | undefined>();
    const container = useLoaderData() as IContainer | undefined;
    console.log('ContainerBrowser');
    console.log(container);
    const [parentId, setParentId] = useState<string>('root');
    const [driveItems, setDriveItems] = useState<IDriveItem[]>([] as IDriveItem[]);
    const [folderPath, setFolderPath] = useState<IDriveItem[]>([] as IDriveItem[]);
    const [selectedItem, setSelectedItem] = useState<IDriveItem | undefined>(undefined);
    const [selectedItemKeys, setSelectedItemKeys] = useState<string[]>([]);
    const [refreshTime, setRefreshTime] = useState<number>(0);
/*
    let containerId: string;
    if (props.container instanceof String) {
        containerId = props.container as string;
    } else {
        const containerObj = props.container as IContainer;
        containerId = containerObj.id;
        setContainer(containerObj);
    }

    useEffect(() => {
        (async () => {
            containersApi.get(containerId)
                .then(setContainer)
                .catch(console.error);
        })();
    }, [containerId, refreshTime]);
*/
    useEffect(() => {
        (async () => {
            if (!container) {
                return;
            }
            filesApi.listItems(container.id, parentId)
                .then(setDriveItems)
                .catch(console.error);
        })();
    }, [container, parentId, refreshTime]);

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
        if (!container) {
            return;
        }
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
        createTableColumn<IDriveItem>({
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
        createTableColumn<IDriveItem>({
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
        createTableColumn<IDriveItem>({
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
    if (container?.customProperties?.docProcessingSubscriptionId) {
        columns.push(
            createTableColumn<IDriveItem>({
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
            createTableColumn<IDriveItem>({
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
            createTableColumn<IDriveItem>({
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

    return (
        <div className="container-browser">
            { container && (<>
            <div className="container-actions">
                <ContainerActionBar
                    container={container}
                    parentId={parentId}
                    selectedItem={selectedItem}
                    onFilePreviewSelected={onFilePreviewSelected}
                    onItemsUpdated={refresh}
                />
            </div>
            <div className="container-breadcrumb">
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
            <div className="files-list-container">
                <DataGrid
                    items={driveItems}
                    columns={columns}
                    getRowId={(driveItem) => driveItem.id}
                    resizableColumns
                    selectionMode="single"
                    columnSizingOptions={columnSizingOptions}
                    selectedItems={selectedItemKeys}
                    onSelectionChange={onSelectionChange}
                    style={{ minWidth: '100%', maxWidth: '100%', width: '100%' }}
                >
                    <DataGridHeader>
                        <DataGridRow
                            selectionCell={{ checkboxIndicator: { "aria-label": "Select row" } }}
                        >
                            {({ renderHeaderCell }) => (
                                <DataGridHeaderCell>
                                    <b>{renderHeaderCell()}</b>
                                </DataGridHeaderCell>
                            )}
                        </DataGridRow>
                    </DataGridHeader>
                    <DataGridBody<IDriveItem>>
                        {({ item, rowId }) => (
                            <DataGridRow<IDriveItem>
                                key={rowId}
                                selectionCell={{ checkboxIndicator: { "aria-label": "Select row" } }}
                            >
                                {({ renderCell }) => (
                                    <DataGridCell>
                                        {renderCell(item)}
                                    </DataGridCell>
                                )}
                            </DataGridRow>
                        )}
                    </DataGridBody>
                </DataGrid>
            </div>
            </>)}
        </div>
    );
}

export default ContainerBrowser;
