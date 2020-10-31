const isEmpty = (data) => {
  if(data.trim() === '') {
    return true;
  } else {
    return false;
  }
}

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email.match(emailRegEx)) return true; 
}

exports.validateSignupData = (data) => {
  let errors = {};
  if(isEmpty(data.fullName)) errors.fullName = 'Must not be empty';
  if(isEmpty(data.handle)) errors.handle = 'Must not be empty';
  if(data.handle.trim().indexOf('@') > -1) errors.handle = 'Invalid user handle'
  if(isEmpty(data.email)){
    errors.email = 'Must not be empty'
  } else if(!isEmail(data.email)){
    errors.email = 'Must be valid';
  };
  if(isEmpty(data.password)) errors.password = 'Must not be empty';
  if(data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
};

exports.validateLoginData = (data) => {
  let errors = {};

  if(isEmpty(data.email)) errors.email = 'Must not be empty';
  if(isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if(!isEmpty(data.bio.trim())) {
    userDetails.bio = data.bio.trim();
  } else {
    userDetails.bio = '';
  }
    
  if(!isEmpty(data.location.trim())) {
    userDetails.location = data.location.trim();
  } else {
    userDetails.location = '';
  }
  if(!isEmpty(data.website.trim())) {
    if(data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`;
    } else {
      userDetails.website = data.website.trim();
    }
  } else {
    userDetails.website = '';
  }

  return userDetails;
}