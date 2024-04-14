import React from 'react';
import styles from './TechnologyPage.module.scss';

const CookieStatementPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Technology list</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>This list provides an inventory of all the cookies employed across our Guardos.eu websites, categorized according to the purposes outlined in the <a href='/cookiestatement'>cookie statement</a>.</p>
        </div>
        <h2 className={styles.title}>Functioanl Technologies</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>We employ various technologies to ensure the smooth functioning and user-friendliness of our website. The following technologies are utilized for functional purposes:</p>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name supplier (name technology)</th>
              <th>Purpose of technology</th>
              <th>Shared with third parties</th>
              <th>Lifetime of technology</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>Enter name</td>
                <td>Enter purpose</td>
                <td>Not shared with third parties</td>
                <td>Enter lifetime</td>
            </tr>
            {/* Add rows of data here */}
          </tbody>
        </table>
        <h2 className={styles.title}>Analytical Technologies</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>We analyze your website interactions using cookies and trackers to enhance and tailor our website to your preferences. Through this analysis, we endeavor to ensure that our website is as user-friendly as possible. The following technologies are utilized for analytical purposes:</p>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name supplier (name technology)</th>
              <th>Purpose of technology</th>
              <th>Shared with third parties</th>
              <th>Lifetime of technology</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Enter name</td>
              <td>Enter purpose</td>
              <td>Not shared with third parties</td>
              <td>Enter lifetime</td>
            </tr>
            {/* Add rows of data here */}
          </tbody>
        </table>
        <h2 className={styles.title}>Marketing Technologies</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>Naturally, we aim for frequent usage of our website and thus employ cookies and trackers to promote it to you. The subsequent technologies are utilized for marketing objectives:</p>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name supplier (name technology)</th>
              <th>Purpose of technology</th>
              <th>Shared with third parties</th>
              <th>Lifetime of technology</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Enter name</td>
              <td>Enter purpose</td>
              <td>Not shared with third parties</td>
              <td>Enter lifetime</td>
            </tr>
            {/* Add rows of data here */}
          </tbody>
        </table>
        <br />
      </div>
    </div>
  );
};

export default CookieStatementPage;
