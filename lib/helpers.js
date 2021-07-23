
export const compareNames = (nameA, nameB) => {
  const [firstNameA, lastNameA] = nameA.split(' ');
  const [firstNameB, lastNameB] = nameB.split(' ');

  if (lastNameA < lastNameB) { return -1 }
  if (lastNameA > lastNameB) { return 1 }
  if (lastNameA === lastNameB) { 
    if (firstNameA < firstNameB) { return -1 }
    if (firstNameA > firstNameB) { return 1 }
  }
  return 0
}