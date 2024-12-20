import styles from './SingleSelectionGroups.module.css';

import React, {ChangeEventHandler, MouseEventHandler} from 'react';
import {Button, Form} from 'react-bootstrap';
import {NavLink} from 'react-router';

import TenantGroup from '../models/TenantGroup';

interface Props {
    groups: TenantGroup[],
    handleChange: ChangeEventHandler,
    handleReset: MouseEventHandler,
    selectedGroup: TenantGroup|undefined
}

function SingleSelectionGroups({ handleChange, handleReset, groups, selectedGroup }: Props) {

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
                        checked={selectedGroup?.name === group.name}
                        onChange={handleChange}
                    />
                ))}
                <Button className="mt-5" variant="secondary" onClick={handleReset} disabled={!selectedGroup}>
                    Auswahl aufheben
                </Button>
                <NavLink className={`btn btn-secondary ms-5 mt-5 ${selectedGroup ? '' : 'disabled'}`}
                         to={selectedGroup ? '/group/' + selectedGroup.name : '#'}>
                    Weiter
                </NavLink>
            </Form>
        </>
    );
}

export default SingleSelectionGroups;