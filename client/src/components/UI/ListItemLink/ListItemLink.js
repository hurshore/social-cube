import React from 'react';
import { Link } from 'react-router-dom';
//MUI stuff
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const ListItemLink = (props) => {
  const { text, to } = props;

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
    [to],
  );

  return (
    <li>
      <ListItem button component={CustomLink} onClick={props.clicked}>
        <ListItemText primary={text} />
      </ListItem>
    </li>
  );
}

export default ListItemLink;