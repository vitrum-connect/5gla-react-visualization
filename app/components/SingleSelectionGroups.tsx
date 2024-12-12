import styles from './SingleSelectionGroups.module.css';
import {Button, Form} from 'react-bootstrap';

interface RadioButtons {
    groupId: string,
    name: string,
    description: string
}

function SingleSelectionGroups() {

    const radioButtons: RadioButtons[] = [
        { groupId: "feld_1", name: "feld_1", description: "Feld 1 - Hofscheune" },
        { groupId: "feld_2", name: "feld_2", description: "Feld 2 - Musterschlag" }
    ];

    const radioButtonsTemplate = radioButtons.map((radioButton) => {
        return <Form.Check
            className={styles.groups}
            type="radio"
            id={radioButton.groupId}
            key={radioButton.groupId}
            label={radioButton.description}
            name="groups"
        />;
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