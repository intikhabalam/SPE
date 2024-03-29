
import React, {
    useState,
    useEffect
} from 'react';
import {
    Folder24Filled,
} from '@fluentui/react-icons';
import {
    Link, 
    DataGrid,
    DataGridHeader, DataGridHeaderCell,
    DataGridBody, DataGridRow,
    DataGridCell,
    TableColumnDefinition, createTableColumn,
    TableCellLayout,
    OnSelectionChangeData,
} from "@fluentui/react-components";
import { Icon } from '@fluentui/react/lib/Icon';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import { IDriveItem } from '../common/FileSchemas';
import { GraphFilesProvider } from '../providers/GraphFilesProvider';

const filesApi = GraphFilesProvider.instance;

interface IFilesTableProps {
    containerId: string;
    parentId?: string;
    onFolderClicked: (folder: IDriveItem) => void;
    onSelectionChange: (items: IDriveItem[]) => void;
}

export const FilesTable: React.FunctionComponent<IFilesTableProps> = (props: IFilesTableProps) => {
    const [driveItems, setDriveItems] = useState<IDriveItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set<string>());

    useEffect(() => {
        (async () => {
            filesApi.listItems(props.containerId, props.parentId).then(setDriveItems);
        })();
    }, [props.containerId, props.parentId]);

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
            return <Link onClick={() => props.onFolderClicked?.(driveItem)}>{driveItem.name}</Link>;
        }
        return <>{driveItem.name}</>;
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
                        {driveItem.modifiedByName}
                    </TableCellLayout>
                )
            }
        }),
    ];

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

    const onSelectionChange = (ignored: any, data: OnSelectionChangeData) => {
        const selections = new Set<string>();
        data.selectedItems.forEach((key) => {
            if (!selectedItems.has(key as string)) {
                selections.add(key as string)
            }
        });
        setSelectedItems(selections);
        props.onSelectionChange(Array.from(selections).map((key) => driveItems.find((item) => item.id === key)!));
    }

    return (
        <DataGrid
            items={driveItems}
            columns={columns}
            getRowId={(item) => item.id}
            resizableColumns
            selectionMode="single"
            columnSizingOptions={columnSizingOptions}
            selectedItems={selectedItems}
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
    );
}

export default FilesTable;
