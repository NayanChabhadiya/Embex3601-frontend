export const getPaginationRange = ({
  totalPages,
  currentPage,
  siblingCount = 1,
  boundaryCount = 1,
}) => {
  const DOTS = "...";

  const totalPageNumbers = siblingCount * 2 + boundaryCount * 2 + 3;

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const startPages = Array.from({ length: boundaryCount }, (_, i) => i + 1);
  const endPages = Array.from(
    { length: boundaryCount },
    (_, i) => totalPages - boundaryCount + i + 1
  );

  const siblingsStart = Math.max(
    currentPage - siblingCount,
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    currentPage + siblingCount,
    totalPages - boundaryCount - 1
  );

  const pages = [];

  if (siblingsStart > boundaryCount + 2) {
    pages.push(...startPages, DOTS);
  } else {
    const visibleStart = Array.from(
      { length: siblingsStart - 1 },
      (_, i) => i + 1
    );
    pages.push(...visibleStart);
  }

  pages.push(
    ...Array.from(
      { length: siblingsEnd - siblingsStart + 1 },
      (_, i) => siblingsStart + i
    )
  );

  if (siblingsEnd < totalPages - boundaryCount - 1) {
    pages.push(DOTS, ...endPages);
  } else {
    const visibleEnd = Array.from(
      { length: totalPages - siblingsEnd },
      (_, i) => siblingsEnd + i + 1
    );
    pages.push(...visibleEnd);
  }

  return pages;
};