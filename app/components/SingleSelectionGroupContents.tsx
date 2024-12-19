import React, {ChangeEventHandler, MouseEventHandler} from 'react';
import {Button, Form} from 'react-bootstrap';
import {NavLink} from 'react-router';

import Sensor from '../models/Sensor';

import styles from './SingleSelectionGroups.module.css';

interface Props {
    handleChange: ChangeEventHandler,
    handleReset: MouseEventHandler,
    selectedSensor: Sensor | undefined,
    sensors: Sensor[]
}

function SingleSelectionGroupContents({ handleChange, handleReset, selectedSensor, sensors }: Props) {
    return <>
        <h4>Übersicht der Gruppeninhalte:</h4>
        <Form id="group_contents">
            {sensors.map((sensor) => (
                <Form.Check
                    className={styles.groups}
                    type="radio"
                    id={sensor.id}
                    key={sensor.id}
                    label={`${sensor.type}: ${sensor.name}`}
                    value={sensor.id}
                    name="group_contents"
                    checked={selectedSensor?.id === sensor.id}
                    onChange={handleChange}
                />
            ))}
            <NavLink className="btn btn-secondary mt-5" to="/">Zurück</NavLink>
            <Button className="ms-5 mt-5" variant="secondary" onClick={handleReset} disabled={!selectedSensor}>
                Auswahl aufheben
            </Button>
        </Form>
    </>;
}

export default SingleSelectionGroupContents;