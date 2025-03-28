import React, { useEffect, useState } from "react";
import { useId } from "@fluentui/react-components";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { IContainer } from "../../../common/schemas/ContainerSchemas";
import { ContainersApiProvider } from "../providers/ContainersApiProvider";

const containersApi = ContainersApiProvider.instance;

export type IContainerSelectorProps = {
  selectedContainerId?: string;
  onContainerSelected?: (container: IContainer) => void;
  refreshKey?: number; // Changed from refreshTime to refreshKey
};

export const ContainerSelector: React.FunctionComponent<
  IContainerSelectorProps
> = (props: IContainerSelectorProps) => {
  const [containers, setContainers] = useState<IContainer[] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedContainerId, setSelectedContainerId] = useState<
    string | undefined
  >(props.selectedContainerId);
  const containerSelector = useId("containerSelector");

  useEffect(() => {
    setLoading(true);
    containersApi
      .list()
      .then(setContainers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [props.refreshKey]); // Use refreshKey instead of refreshTime

  const onContainerDropdownChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    const selected = containers?.find(
      (container) => container.id === option?.key
    );
    if (selected) {
      setSelectedContainerId(selected.id);
      props.onContainerSelected?.(selected);
    }
  };

  const dropdownOptions: IDropdownOption[] = containers
    ? containers.map((container) => ({
        key: container.id,
        text: container.displayName,
      }))
    : [];

  return (
    <Dropdown
      id={containerSelector}
      disabled={loading}
      placeholder="Select"
      options={dropdownOptions}
      selectedKey={selectedContainerId}
      className="container-selector-controls"
      onChange={onContainerDropdownChange}
    />
  );
};
