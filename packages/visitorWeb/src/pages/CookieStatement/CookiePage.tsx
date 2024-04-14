import React from 'react';
import styles from './CookiePage.module.scss';
import {
  intro,
  intro2,
  intro3,
  cookies,
  cookies2,
  introTech,
  script,
  tracker,
  cookie,
  purposeTech,
  functional1,
  functional2,
  analytical,
  marketing,
  security,
  securityTxt,
  securityThirdParty,
  enableDisable1,
  enableDisable2,
  enableDisable3,
  inspect,
  inspect2,
  tips,
  tips2,
  conclusion1,
  conclusion2,
  conclusion3,
  conclusion4,
  conclusion5,
} from './text/text';

const CookieStatementPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Cookie Statement</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{intro} <a href='/privacystatement'>privacy statement</a>.</p>
          <br />
          <p>{intro2}</p>
          <br />
          <p>{intro3}</p>
        </div>
        <h2 className={styles.title}>Enabling/disabling cookies and deleting cookies</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{cookies}<a href='/technologies'>list of technologies</a>. {cookies2}</p>

        </div>
        <h2 className={styles.title}>Which technologies do we use?</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{introTech}</p>
          <br />
          <p className={styles.italic}>1. What is a script?</p>
          <br />
          <p>{script}</p>
          <br />
          <p className={styles.italic}>2. What is a tracker?</p>
          <br />
          <p>{tracker}</p>
          <br />
          <p className={styles.italic}>3. What are cookies?</p>
          <br />
          <p>{cookie}</p>
        </div>
        <h2 className={styles.title}>Why do we use these Technologies?</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{purposeTech}</p>
          <br />
          <p className={styles.italic}>1. Functional purposes</p>
          <br />
          <p>{functional1}</p>
          <p>{functional2}</p>
          <br />
          <p className={styles.italic}>2. Analytical purposes</p>
          <br />
          <p>{analytical}</p>
          <br />
          <p className={styles.italic}>3. Marketing purposes</p>
          <br />
          <p>{marketing}</p>
        </div>
        <h2 className={styles.title}>Security of your data by us and by third parties</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p className={styles.italic}>1. {security}</p>
          <br />
          <p>{securityTxt}</p>
          <br />
          <p className={styles.italic}>2. Third-party technologies</p>
          <br />
          <p>{securityThirdParty}</p>
        </div>
        <h2 className={styles.title}>What are your rights?</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p className={styles.italic}>1. Enabling/disabling cookies and deleting cookies</p>
          <br />
          <p>{enableDisable1}</p>
          <p>{enableDisable2}</p>
          <p>{enableDisable3}</p>
          <ul className={styles.indentedList}>
            <li><a href='https://support.google.com/chrome/answer/95647?hl=en'>Chrome</a></li>
            <li><a href='https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox'>Firefox</a></li>
            <li><a href='https://support.microsoft.com/en-us/topic/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d'>Internet Explorer</a></li>
            <li><a href='https://support.microsoft.com/en-us/microsoft-edge/view-and-delete-browser-history-in-microsoft-edge-00cf7943-a9e1-975a-a33d-ac10ce454ca4'>Edge</a></li>
            <li><a href='https://support.apple.com/en-en/HT201265'>Safari</a></li>
          </ul>
          <br />
          <p className={styles.italic}>2. Right to inspect, correct or delete your data</p>
          <br />
          <p>{inspect}<a href='/privacystatement'>privacy statement</a>{inspect2}</p>
          <br />
          <p className={styles.italic}>3. Tips, questions and complaints</p>
          <br />
          <p>{tips}<a href='/privacystatement'>privacy statement</a>{tips2}</p>
          </div>
        <h2 className={styles.title}>Conclusion</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{conclusion1}</p>
          <br />
          <p>{conclusion2}</p>
          <br />
          <p>{conclusion3}</p>
          <br />
          <p>{conclusion4}</p>
          <br />
          <p>{conclusion5}</p>
          <br />
        </div>
      </div>
    </div>
  );
};

export default CookieStatementPage;
