import React, {ChangeEvent, useEffect, useState} from 'react';

import OpenLayers from '../components/OpenLayers';
import SingleSelectionGroupContents from '../components/SingleSelectionGroupContents';
import AgriCrop from '../models/AgriCrop';
import AgriCropResponse from '../models/AgriCropResponse';
import Sensor from '../models/Sensor';
import SensorResponse from '../models/SensorResponse';
import TenantGroup from '../models/TenantGroup';
import TenantGroupsResponse from '../models/TenantGroupsResponse';
import {
    getAgriCropPolygonByGroupId,
    getAgvolutionSensorsLocationsByGroupId,
    getSentekSensorsLocationsByGroupId
} from '../services/fiwareService';
import {getTenantGroups} from '../services/tenantApiService';

import styles from './Home.module.css';

interface Props {
    params: {
        groupName: string
    }
}

function Group({ params }: Props) {

    const groupName = params.groupName;

    const [agriCropsLoaded, setAgriCropsLoaded] = useState<boolean>(false);
    const [agvolutionSensorsLoaded, setAgvolutionSensorsLoaded] = useState<boolean>(false);
    const [sentekSensorsLoaded, setSentekSensorsLoaded] = useState<boolean>(false);

    const [selectedGroup, setSelectedGroup] = useState<TenantGroup | undefined>();
    const [selectedSensor, setSelectedSensor] = useState<Sensor | undefined>(undefined);

    const [agriCrops, setAgriCrops] = useState<AgriCrop[]>([]);
    const [sensors, setSensors] = useState<Sensor[]>([]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const sensorId = event.target.value;
        const selectedSensor = sensors.find((sensor) => sensor.id === sensorId);
        setSelectedSensor(selectedSensor);
    };
    const handleReset = () => setSelectedSensor(undefined);

    useEffect(() => {
        getTenantGroups()
            .then((response) => {
                const data: TenantGroupsResponse = response.data;
                const groups = data.groups;
                const selectedGroup = groups.find((_group) => _group.name === groupName);
                if (selectedGroup) {
                    setSelectedGroup(selectedGroup);
                } else {
                    alert(`Die Gruppe ${groupName} konnte nicht gefunden werden.`);
                }
            })
            .catch((error) => {
                console.debug(error);
            });
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            getAgriCropPolygonByGroupId(selectedGroup.groupId)
                .then((response) => {
                    const _agriCrops = response.data;
                    if (Array.isArray(_agriCrops)) {
                        const newAgriCrops: AgriCrop[] = [];
                        _agriCrops.map((_agriCrop: AgriCropResponse) => {
                            newAgriCrops.push({
                                id: _agriCrop.id,
                                customGroup: _agriCrop.customGroup,
                                coordinates: _agriCrop.location.coordinates
                            });
                        });
                        setAgriCrops(newAgriCrops);
                        setAgriCropsLoaded(true);
                    }
                })
                .catch((error) => {
                    console.debug(error);
                });
            getAgvolutionSensorsLocationsByGroupId(selectedGroup.groupId)
                .then((response) => {
                    handleSensorsResponse(response.data);
                    setAgvolutionSensorsLoaded(true);
                })
                .catch((error) => {
                    console.debug(error);
                });

            getSentekSensorsLocationsByGroupId(selectedGroup.groupId)
                .then((response) => {
                    handleSensorsResponse(response.data);
                    setSentekSensorsLoaded(true);
                })
                .catch((error) => {
                    console.debug(error);
                });

            function handleSensorsResponse(_sensors: SensorResponse[]) {
                if (Array.isArray(_sensors)) {
                    const newSensors: Sensor[] = [];
                    _sensors.map((_sensor: SensorResponse) => {
                        if (_sensor.location !== null) {
                            newSensors.push({
                                id: _sensor.id,
                                type: _sensor.type,
                                name: _sensor.name,
                                customGroup: _sensor.customGroup,
                                coordinates: _sensor.location.coordinates
                            });
                        }
                    });
                    setSensors((oldSensors) => {
                        newSensors.forEach((newSensor) => {
                            const index: number = oldSensors
                                .findIndex((oldSensor: Sensor): boolean => oldSensor?.id === newSensor.id && oldSensor.type === newSensor.type);
                            if (index >= 0) {
                                oldSensors.splice(index, 1);
                            }
                        });
                        return [...oldSensors, ...newSensors]
                    });
                }
            }
        }

    }, [ selectedGroup ]);

    const openLayers = agriCropsLoaded && agvolutionSensorsLoaded && sentekSensorsLoaded
        ? <OpenLayers id="geo_server" agriCrops={agriCrops} sensors={sensors} selectedGroup={selectedGroup}/>
        : <p>Loading...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.filter}>
                <SingleSelectionGroupContents sensors={sensors}
                                              handleChange={handleChange}
                                              handleReset={handleReset}
                                              selectedSensor={selectedSensor}/>
            </div>
            <div className={styles.map}>{openLayers}</div>
        </div>
    );
}

export default Group;