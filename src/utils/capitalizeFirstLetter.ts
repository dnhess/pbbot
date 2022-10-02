const capitalizeFirstLetter = (str?: string): string => {
  if (str) {
    return str[0].toUpperCase() + str.slice(1);
  }
  return '';
};

export default capitalizeFirstLetter;
