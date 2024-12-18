import styles from './SingleSelectionGroups.module.css';

import React, {useEffect, useState} from 'react';
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

    const initialRadioButtonsTemplate: React.JSX.Element[] = [];
    const [radioButtonsTemplate, setRadioButtonsTemplate] = useState(initialRadioButtonsTemplate);

    useEffect(() => {
        getTenantGroups()
            .then((response) => {
                const data: TenantGroupsResponse = response.data;
                const groups: TenantGroup[] = data.groups;
                setRadioButtonsTemplate(() => {
                    return groups.map((group: TenantGroup): React.JSX.Element => {
                        return <Form.Check
                            className={styles.groups}
                            type="radio"
                            id={group.groupId}
                            key={group.groupId}
                            label={group.name}
                            name="groups"
                        />;
                    });
                });
            })
            .catch((error) => {
                console.debug(error);
            });
    });

    return (
        <>
            <h4>Auswahl der Gruppen:</h4>
            <Form id="groups">
                {radioButtonsTemplate}
                <Button className="mt-5" type="reset" variant="secondary">Auswahl aufheben</Button>
            </Form>
        </>
    );
}

export default SingleSelectionGroups;