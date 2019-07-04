import React from 'react'
import {
  Drawer,
  AppBar,
  Toolbar,
  useScrollTrigger,
  Slide,
  Container,
} from '@material-ui/core'

type MUIContainerWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false

interface LayoutProps {
  toolbarContainerWidth?: MUIContainerWidth
  mainContainerWidth?: MUIContainerWidth
}

export const Layout: React.FC<LayoutProps> = props => {
  const { mainContainerWidth, toolbarContainerWidth } = props
  return (
    <div>
      <HideOnScroll>
        <AppBar color='default' style={{ boxShadow: 'none' }}>
          <Toolbar>
            <Container
              maxWidth={toolbarContainerWidth || DEFAULT_TOOLBAR_WIDTH}
            >
              Catechism
            </Container>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <DummyToolbar />
      <Drawer open={false}>Drawer</Drawer>
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
