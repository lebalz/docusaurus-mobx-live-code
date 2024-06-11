import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import ContextEditor from 'docusaurus-live-brython/theme/CodeEditor/ContextEditor';

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
      <main className={clsx(styles.main)}>
        <div>
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
        </div>
        
        <ContextEditor
            className={clsx('language-py', styles.code)}
            versioned
            id="b51e5f3f-57a2-447b-a277-2201e2198771"
        >
            {
`#
from time import time
t0 = time()
### PRE
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
fib(25)
### POST
t1 = time()
print(f'Execution time: {t1 - t0}s')
#
`
            }
        </ContextEditor>
      </main>
    </Layout>
  );
});

export default Home;
