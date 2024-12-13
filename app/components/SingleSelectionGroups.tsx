import styles from './SingleSelectionGroups.module.css';

import React, {ChangeEvent, useEffect, useState} from 'react';
import {Button, Form} from 'react-bootstrap';

import {getTenantGroups} from '../services/tenantApiService';

interface TenantGroup {
    name: string,
    description: string,
    groupId: string,
    sensorIdsAssignedToGroup: string[]
}

interface TenantGroupsResponse {
    timestamp: string,
    groups: TenantGroup[]
}

function SingleSelectionGroups() {

    const [groups, setGroups] = useState<TenantGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState('');

    useEffect(() => {
        getTenantGroups()
            .then((response) => {
                const data: TenantGroupsResponse = response.data;
                setGroups(data.groups);
            })
            .catch((error) => {
                console.debug(error);
            });
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedGroup(event.target.value);
    };

    return (
        <>
            <h4>Auswahl der Gruppen:</h4>
            <Form id="groups">
                {groups.map((group) => (
                    <Form.Check
                        className={styles.groups}
                        type="radio"
                        id={group.groupId}
                        key={group.groupId}
                        label={group.name}
                        value={group.name}
                        name="groups"
                        checked={selectedGroup === group.name}
                        onChange={handleChange}
                    />
                ))}
                <Button className="mt-5" variant="secondary" onClick={() => setSelectedGroup('')}>
                    Auswahl aufheben
                </Button>
            </Form>
        </>
    );
}

export default SingleSelectionGroups;