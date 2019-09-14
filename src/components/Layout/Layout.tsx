import React from 'react'
import {
  AppBar,
  Toolbar,
  useScrollTrigger,
  Slide,
  Container,
  makeStyles,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from 'components/App'
import { Footer } from 'components/Footer/Footer'
import * as H from 'history'
import { DocumentTitle } from 'components/common/DocumentTitle'
import { LoadingPlaceholder } from 'components/LoadingPlaceholder/LoadingPlaceholder'

const useStyles = makeStyles({
  backgroundStyle: { backgroundColor: 'white' },
  loadingPlaceholderContainer: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
  },
  appBar: {
    fontFamily: 'Cinzel',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.4em',
  },
  catechismAppBarText: {
    color: 'black',
    textDecoration: 'none',
  },
})

type MUIContainerWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false

interface LayoutProps {
  documentTitle?: string
  routeHistory: H.History
  showLoading?: boolean
  toolbarContainerWidth?: MUIContainerWidth
  mainContainerWidth?: MUIContainerWidth
}

export const Layout: React.FC<LayoutProps> = props => {
  const styles = useStyles()
  const {
    mainContainerWidth,
    toolbarContainerWidth,
    showLoading = false,
    documentTitle = DEFAULT_WEBSITE_TITLE,
  } = props

  return (
    <div>
      <DocumentTitle title={documentTitle} />
      <HideOnScroll>
        <AppBar color='default' style={{ boxShadow: 'none' }}>
          <Toolbar>
            <Container
              maxWidth={toolbarContainerWidth || DEFAULT_TOOLBAR_WIDTH}
              className={styles.appBar}
            >
              <Link
                className={styles.catechismAppBarText}
                to={APP_ROUTES.INDEX}
              >
                Catechism
              </Link>
            </Container>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <DummyToolbar />
      <div className={styles.backgroundStyle}>
        <Container
          maxWidth={mainContainerWidth || DEFAULT_MAIN_CONTAINER_WIDTH}
        >
          {showLoading ? (
            <div className={styles.loadingPlaceholderContainer}>
              <LoadingPlaceholder />
            </div>
          ) : (
            props.children
          )}
        </Container>
      </div>
      <Footer />
    </div>
  )
}

const HideOnScroll: React.FC = props => {
  const trigger = useScrollTrigger()

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {props.children}
    </Slide>
  )
}

const DummyToolbar: React.FC = () => {
  const styles = useStyles()
  return (
    <div className={styles.backgroundStyle}>
      <Toolbar />
    </div>
  )
}

const DEFAULT_MAIN_CONTAINER_WIDTH = 'md'
const DEFAULT_TOOLBAR_WIDTH = 'md'
const DEFAULT_WEBSITE_TITLE = 'Catechism of the Catholic Church'

export const makeDocumentTitle = (suffix: string) => `Catechism | ${suffix}`
