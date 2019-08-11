import React, { useState } from 'react'
import {
  Drawer,
  AppBar,
  Toolbar,
  useScrollTrigger,
  Slide,
  Container,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Box,
} from '@material-ui/core'
import { Menu } from '@material-ui/icons'
import { APP_ROUTES } from 'components/App'
import { Footer } from 'components/Footer/Footer'
import * as H from 'history'

const useStyles = makeStyles({
  backgroundStyle: { backgroundColor: 'white' },
  list: {
    fontFamily: 'Cinzel',
    width: 250,
  },
  listHeader: {
    fontSize: '1.5em',
    padding: 20,
    margin: 0,
    marginTop: 10,
    borderBottom: '1px solid gray',
  },
  listItem: { padding: 20 },
  appBar: {
    fontFamily: 'Cinzel',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.4em',
  },
  menuIcon: {
    marginRight: 10,
  },
})

type MUIContainerWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false

interface LayoutProps {
  routeHistory: H.History
  toolbarContainerWidth?: MUIContainerWidth
  mainContainerWidth?: MUIContainerWidth
}

export const Layout: React.FC<LayoutProps> = props => {
  const styles = useStyles()
  const { mainContainerWidth, toolbarContainerWidth } = props
  const [drawerState, setDrawerState] = useState(false)

  const dismissDrawer = () => setDrawerState(false)

  return (
    <div>
      <HideOnScroll>
        <AppBar color='default' style={{ boxShadow: 'none' }}>
          <Toolbar>
            <Container
              maxWidth={toolbarContainerWidth || DEFAULT_TOOLBAR_WIDTH}
              className={styles.appBar}
            >
              <Menu
                onClick={() => setDrawerState(true)}
                className={styles.menuIcon}
              />
              Catechism
            </Container>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <DummyToolbar />
      <Drawer open={drawerState} onClose={dismissDrawer}>
        <Box className={styles.list}>
          <List component='nav' disablePadding>
            <ListItemText disableTypography className={styles.listHeader}>
              Catechism
            </ListItemText>
            <ListItem
              button
              disableGutters
              className={styles.listItem}
              onClick={() => {
                // eslint-disable-next-line fp/no-mutating-methods
                props.routeHistory.push(APP_ROUTES.INDEX)
                dismissDrawer()
              }}
            >
              Index
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <div className={styles.backgroundStyle}>
        <Container
          maxWidth={mainContainerWidth || DEFAULT_MAIN_CONTAINER_WIDTH}
        >
          {props.children}
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
