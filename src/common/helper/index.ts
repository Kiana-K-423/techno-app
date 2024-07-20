export const generatePageNumbers = (totalPage: number, current: number) => {
  const pageNumbers = [];
  if (totalPage <= 5) {
    for (let i = 1; i <= totalPage; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (current <= 3) {
      pageNumbers.push(1, 2, 3, 4, totalPage);
    } else if (current >= totalPage - 2) {
      pageNumbers.push(
        1,
        totalPage - 3,
        totalPage - 2,
        totalPage - 1,
        totalPage
      );
    } else {
      pageNumbers.push(1, current - 1, current, +current + 1, totalPage);
    }
  }
  return pageNumbers;
};
