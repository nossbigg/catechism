import React, { createRef } from 'react'
import { makeStyles } from '@material-ui/styles'
import classnames from 'classnames'
import { WrapperRefMeta } from 'components/Page/pageScrollHooks'

interface HighlightWrapperProps {
  refMeta?: WrapperRefMeta
}

export const HighlightWrapper: React.FC<HighlightWrapperProps> = props => {
  const { children, refMeta = emptyRefMeta } = props
  const { highlighted, ref } = refMeta
  const styles = useStyles()

  return (
    <div
      className={classnames(styles.wrapper, {
        [styles.highlighted]: highlighted,
      })}
      ref={ref}
    >
      {children}
    </div>
  )
}

const useStyles = makeStyles({
  wrapper: {
    backgroundColor: '#24730000',
    transitionProperty: 'background-color',
    transitionDuration: '6s',
  },
  highlighted: {
    backgroundColor: '#247300cc',
    transitionDuration: '0s',
  },
})

const emptyRefMeta: WrapperRefMeta = {
  highlighted: false,
  ref: createRef(),
}
