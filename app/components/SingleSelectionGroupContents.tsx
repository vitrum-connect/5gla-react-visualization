import React, {ChangeEventHandler, MouseEventHandler} from 'react';
import {Button, Form} from 'react-bootstrap';
import {NavLink} from 'react-router';

import AgriCrop from '../models/AgriCrop';
import Sensor from '../models/Sensor';

import styles from './SingleSelectionGroups.module.css';

interface Props {
    agriCrops: AgriCrop[],
    handleChange: ChangeEventHandler,
    handleReset: MouseEventHandler,
    selectedAgriCrop: AgriCrop | undefined,
    selectedSensor: Sensor | undefined,
    sensors: Sensor[]
}

function SingleSelectionGroupContents({ agriCrops, handleChange, handleReset, selectedAgriCrop, selectedSensor, sensors }: Props) {
    return <>
        <h4>Übersicht der Gruppeninhalte:</h4>
        <Form id="group_contents">
            {sensors.map((sensor) => (
                <Form.Check
                    className={styles.groups}
                    type="radio"
                    id={sensor.id}
                    key={sensor.id}
                    label={sensor.id}
                    value={sensor.id}
                    name="group_contents"
                    checked={selectedSensor?.id === sensor.id}
                    onChange={handleChange}
                />
            ))}
            {agriCrops.map((agriCrops) => (
                <Form.Check
                    className={styles.groups}
                    type="radio"
                    id={agriCrops.id}
                    key={agriCrops.id}
                    label={agriCrops.id}
                    value={agriCrops.id}
                    name="group_contents"
                    checked={selectedAgriCrop?.id === agriCrops.id}
                    onChange={handleChange}
                />
            ))}
            <NavLink className="btn btn-secondary mt-5" to="/">Zurück</NavLink>
            <Button className="ms-5 mt-5" variant="secondary" onClick={handleReset} disabled={!selectedSensor && !selectedAgriCrop}>
                Auswahl aufheben
            </Button>
        </Form>
    </>;
}

export default SingleSelectionGroupContents;