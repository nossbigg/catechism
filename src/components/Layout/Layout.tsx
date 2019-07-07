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
import * as H from 'history'

const useStyles = makeStyles({
  list: {
    width: 200,
  },
  listHeader: {
    padding: 10,
    margin: 0,
    marginTop: 20,
    borderBottom: '1px solid gray',
  },
  listItem: { paddingTop: 20, paddingBottom: 20, paddingLeft: 10 },
})

type MUIContainerWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false

interface LayoutProps {
  routeHistory: H.History
  toolbarContainerWidth?: MUIContainerWidth
  mainContainerWidth?: MUIContainerWidth
}

export const Layout: React.FC<LayoutProps> = props => {
  const classes = useStyles()
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
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Menu
                onClick={() => setDrawerState(true)}
                style={{ marginRight: 10 }}
              />
              Catechism
            </Container>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <DummyToolbar />
      <Drawer open={drawerState} onClose={dismissDrawer}>
        <Box className={classes.list}>
          <List component='nav' disablePadding>
            <ListItemText className={classes.listHeader}>
              Catechism
            </ListItemText>
            <ListItem
              button
              disableGutters
              className={classes.listItem}
              onClick={() => {
                // eslint-disable-next-line fp/no-mutating-methods
                props.routeHistory.push(APP_ROUTES.TABLE_OF_CONTENTS)
                dismissDrawer()
              }}
            >
              Table of Contents
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Container maxWidth={mainContainerWidth || DEFAULT_MAIN_CONTAINER_WIDTH}>
        {props.children}
      </Container>
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

const DummyToolbar: React.FC = () => <Toolbar />

const DEFAULT_MAIN_CONTAINER_WIDTH = 'md'
const DEFAULT_TOOLBAR_WIDTH = 'md'
