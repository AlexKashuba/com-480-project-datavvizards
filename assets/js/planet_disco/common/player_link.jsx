import React, { useState, useEffect, Fragment, useRef } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

function isOverflown(element) {
  return element.scrollWidth > element.clientWidth;
}

const useStyles = makeStyles((theme) => ({
  link: {
    color: "inherit",
    textDecoration: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    maxWidth: "90%",
    '&:hover': {
      textDecoration: "underline",
    },
  },
  marqueeWrapper: {
    display: "inline-block",
    animation: "$marquee-away 12s linear 2s 2",
  },
  "@keyframes marquee-away": {
    "0%": {
      transform: "translate(0, 0)"
    },
    "50%": {
      transform: "translate(-50%, 0)"
    },
    "50.001%": {
      transform: "translate(0, 0)"
    },
    "100%": {
      transform: "translate(0, 0)"
    }
  },
}))

export default function PlayerLink({ href, content, header, playing }) {
  const elementRef = useRef()
  const aRef = useRef()
  const classes = useStyles()

  useEffect(() => {
    if (playing && isOverflown(elementRef.current)) {
      aRef.current.innerHTML = content + "<span style=\"padding: 50px\" \/>"+content;
      elementRef.current.classList.add(classes.marqueeWrapper);
    }else{
      elementRef.current.classList.remove(classes.marqueeWrapper);
    }
  }, [content, playing])

  const getInner = () => (
    <a ref={aRef} className={classes.link} target="_blank" rel="noopener noreferrer"
      href={href}>
      {content}
    </a>
  )

  return (
    <div ref={elementRef} key={content}>
      {header ?
        <Typography variant="body1"> {getInner()} </Typography>
        : <Typography variant="subtitle2" color="textSecondary"> {getInner()} </Typography>}
    </div >
  )
}
