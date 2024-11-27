import styles from './Impressum.module.css';
import {Link} from "react-router";

function Impressum() {

    const phone = '+49 (0)581 / 82-0';
    const fax = '+49 (0)581 / 82-445';
    const email = '5gla@landkreis-uelzen.de';
    const salesTaxIdentificationNumber = 'DE116678257';
    const editorialResponsiblePersons = [
        'Thies-Benedict Lüdtke',
        'Alisa Lunow'
    ];
    const linkERecht24 = 'https://www.e-recht24.de/';
    return (
        <>
            <h1>Impressum</h1>
            <p>Angaben gemäß § 5 TMG</p>
            <p>Landkreis Uelzen</p>
            <p>Albrecht-Thaer-Straße 101</p>
            <p>29525 Uelzen</p>
            <p>Vertreten durch:</p>
            <p>Landrat Dr. Heiko Blume</p>
            <p>Kontakt</p>
            <p>Telefon: {phone}</p>
            <p>Telefax: {fax}</p>
            <p>E-Mail: <Link to={'mailto:' + email}>{email}</Link></p>
            <p>Umsatzsteuer-ID</p>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz</p>
            <p>{salesTaxIdentificationNumber}</p>
            <p>Redaktionell verantwortlich</p>
            <p>{editorialResponsiblePersons.join(', ')}</p>
            <p>Verbraucherstreitbelegung/Universalschlichtungsstelle</p>
            <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.</p>
            <p>Quelle: <Link to={linkERecht24}>eRecht24</Link></p>
            <p>Haftungsausschluss:</p>
            <p className={styles.firstCounter}>Inhalt des Onlineangebotes</p>
            <p>Der Landkreis Uelzen (Landkreis) übernimmt keinerlei Gewähr für die Aktualität, Korrektheit,
                Vollständigkeit oder Qualität der bereitgestellten Informationen. Haftungsansprüche, welche sich auf
                Schäden materieller oder ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung der dargebotenen
                Informationen bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden,
                sind grundsätzlich ausgeschlossen, sofern seitens des Landkreises Uelzen kein nachweislich vorsätzliches
                oder grob fahrlässiges Verschulden vorliegt. Alle Angebote sind freibleibend und unverbindlich. Der
                Landkreis behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte
                Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig
                einzustellen.</p>
            <p className={styles.counter}>Verweise und Links</p>
            <p>Das Internetangebot des Landkreises kann externe Links auf die Internetseiten Dritter enthalten. Auf den
                Inhalt hat der Landkreis keinen Einfluss. Der Landkreis übernimmt keine Verantwortung für die Inhalte
                und die Verfügbarkeit von Internetseiten Dritter, die über externe Links dieses Informationsangebotes
                erreicht werden. Der Landkreis distanziert sich ausdrücklich von allen Inhalten, die möglicherweise
                straf- oder haftungsrechtlich relevant sind oder gegen die guten Sitten verstoß.</p>
            <p className={styles.counter}>Urheber- und Kennzeichenrecht</p>
            <p>Der Landkreis ist bestrebt, in allen Publikationen die Urheberrechte der verwendeten Grafiken,
                Tondokumente, Videosequenzen und Texte zu beachten, von ihm selbst erstellte Grafiken, Tondokumente,
                Videosequenzen und Texte zu nutzen oder auf lizenzfreie Grafiken, Tondokumente, Videosequenzen und Texte
                zurückzugreifen.</p>
            <p>Alle innerhalb des Internetangebotes genannten und ggf. durch Dritte geschützten Marken- und Warenzeichen
                unterliegen uneingeschränkt den Bestimmungen des jeweils gültigen Kennzeichenrechts und den
                Besitzrechten der jeweiligen eingetragenen Eigentümer. Allein aufgrund der bloßen Nennung ist nicht der
                Schluss zu ziehen, dass Markenzeichen nicht durch Rechte Dritter geschützt sind!</p>
            <p>Das Copyright für veröffentlichte, selbst erstellte Objekte bleibt allein beim Landkreis. Eine
                Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente, Videosequenzen und Texte in anderen
                elektronischen oder gedruckten Publikationen ist ohne ausdrückliche Zustimmung des Landkreises nicht
                gestattet.</p>
        </>
    );
}

export default Impressum;