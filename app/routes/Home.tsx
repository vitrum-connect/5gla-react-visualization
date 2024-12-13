import React, {ChangeEvent, useEffect, useState} from 'react';
import styles from './Home.module.css';
import OpenLayers from '../components/OpenLayers';
import SingleSelectionGroups from '../components/SingleSelectionGroups';
import AgriCrop from '../models/AgriCrop';
import AgriCropResponse from '../models/AgriCropResponse';
import Sensor from '../models/Sensor';
import TenantGroup from '../models/TenantGroup';
import {getAgriCropPolygonExample} from '../services/fiwareService';
import {getTenantGroups} from '../services/tenantApiService';

interface TenantGroupsResponse {
    timestamp: string,
    groups: TenantGroup[]
}

function Home() {
    const sensors: Sensor[] = [];
    const [agriCrops, setAgriCrops] = useState<AgriCrop[]>([]);

    const [groups, setGroups] = useState<TenantGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<TenantGroup|undefined>();
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
        getAgriCropPolygonExample()
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
                }
            })
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.filter}>
                <SingleSelectionGroups groups={groups} handleChange={handleChange} handleReset={handleReset} selectedGroup={selectedGroup}/>
            </div>
            <div className={styles.map}>
                <OpenLayers id="geo_server" agriCrops={agriCrops} sensors={sensors} selectedGroup={selectedGroup}/>
            </div>
        </div>
    );
}

export default Home;
