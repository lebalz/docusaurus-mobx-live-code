import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import { useStore } from '../hooks/useStore';
import { observer } from 'mobx-react-lite';
const Home = observer(() => {
  const {siteConfig} = useDocusaurusContext();
  const documentStore = useStore('documentStore');
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <main>
        <button
          className={clsx('button button--secondary button--sm', styles.button)}
          onClick={() => {
            documentStore.setClicks(documentStore.clicks - 1);
          }}
        >
          -
        </button>
        <span className={clsx('badge badge--primary', styles.badge)}>
          {documentStore.clicks}
        </span>
        <button
          className={clsx('button button--secondary button--sm', styles.button)}
          onClick={() => {
            documentStore.setClicks(documentStore.clicks + 1);
          }}
        >
          +
        </button>
      </main>
    </Layout>
  );
});

export default Home;
