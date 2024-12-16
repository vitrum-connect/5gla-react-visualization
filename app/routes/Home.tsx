import React, {ChangeEvent, useEffect, useState} from 'react';
import styles from './Home.module.css';
import OpenLayers from '../components/OpenLayers';
import SingleSelectionGroups from '../components/SingleSelectionGroups';
import AgriCrop from '../models/AgriCrop';
import AgriCropResponse from '../models/AgriCropResponse';
import Sensor from '../models/Sensor';
import SensorResponse from '../models/SensorResponse';
import TenantGroup from '../models/TenantGroup';
import TenantGroupsResponse from '../models/TenantGroupsResponse';
import {getAgriCropPolygon, getAgvolutionSensorsLocations, getSentekSensorsLocations} from '../services/fiwareService';
import {getTenantGroups} from '../services/tenantApiService';

function Home() {
    const [agriCropsLoaded, setAgriCropsLoaded] = useState<boolean>(false);
    const [agvolutionSensorsLoaded, setAgvolutionSensorsLoaded] = useState<boolean>(false);
    const [sentekSensorsLoaded, setSentekSensorsLoaded] = useState<boolean>(false);

    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [agriCrops, setAgriCrops] = useState<AgriCrop[]>([]);

    const [groups, setGroups] = useState<TenantGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<TenantGroup | undefined>();
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const groupName = event.target.value;
        const selectedGroup = groups.find((group) => group.name === groupName);
        setSelectedGroup(selectedGroup);
    };
    const handleReset = () => setSelectedGroup(undefined);

    useEffect(() => {
        getTenantGroups()
            .then((response) => {
                const data: TenantGroupsResponse = response.data;
                setGroups(data.groups);
            })
            .catch((error) => {
                console.debug(error);
            });
        getAgriCropPolygon()
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
            });

        function handleSensorsResponse(_sensors: SensorResponse[]) {
            if (Array.isArray(_sensors)) {
                const oldSensors: Sensor[] = [...sensors];
                const newSensors: Sensor[] = [];
                _sensors.map((_sensor: SensorResponse) => {
                    const index: number = oldSensors
                        .findIndex((oldSensor: Sensor): boolean => oldSensor?.id === _sensor.id && oldSensor.type === _sensor.type);
                    if (index >= 0) {
                        oldSensors.splice(index, 1);
                    }
                    if (_sensor.location !== null) {
                        newSensors.push({
                            id: _sensor.id,
                            type: _sensor.type,
                            customGroup: _sensor.customGroup,
                            coordinates: _sensor.location.coordinates
                        });
                    }
                });
                setSensors([...oldSensors, ...newSensors]);
            }
        }

        getAgvolutionSensorsLocations()
            .then((response) => {
                handleSensorsResponse(response.data);
                setAgvolutionSensorsLoaded(true);
            })
            .catch((error) => {
                console.debug(error);
            });

        getSentekSensorsLocations()
            .then((response) => {
                handleSensorsResponse(response.data);
                setSentekSensorsLoaded(true);
            })
            .catch((error) => {
                console.debug(error);
            });
    }, []);

    const openLayers = agriCropsLoaded && agvolutionSensorsLoaded && sentekSensorsLoaded
        ? <OpenLayers id="geo_server" agriCrops={agriCrops} sensors={sensors} selectedGroup={selectedGroup}/>
        : <p>Loading...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.filter}>
                <SingleSelectionGroups groups={groups}
                                       handleChange={handleChange}
                                       handleReset={handleReset}
                                       selectedGroup={selectedGroup}/>
            </div>
            <div className={styles.map}>{openLayers}</div>
        </div>
    );
}

export default Home;
