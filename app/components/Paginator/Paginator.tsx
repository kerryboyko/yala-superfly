import { Link, useNavigate } from "@remix-run/react";
import { ChangeEventHandler, useMemo } from "react";

const shouldShowPaginator = (totalCount: number, perPage: number) =>
  totalCount > perPage;
const howManyPages = (totalCount: number, perPage: number) =>
  Math.ceil(totalCount / perPage);
const PAGE_AMOUNTS = [10, 25, 50, 100];

export const Paginator = ({ perPage, currentPage, totalCount }: any) => {
  const navigate = useNavigate();
  const handleNewPerPage: ChangeEventHandler<HTMLSelectElement> = (event) =>
    navigate(`.?perPage=${event.target.value}&pageNum=${currentPage}`);
  const handleNewCurrentPage: ChangeEventHandler<HTMLSelectElement> = (event) =>
    navigate(`.?perPage=${perPage}&pageNum=${event.target.value}`);
  const totalPages = useMemo(
    () => howManyPages(totalCount, perPage),
    [totalCount, perPage],
  );
  const pageSpread = useMemo(() => {
    return Array(totalPages)
      .fill(null)
      .map((_, index) => index + 1);
  }, [totalPages]);

  if (!shouldShowPaginator(totalCount, perPage)) {
    return null;
  }
  return (
    <div className="pagination">
      <div className="pagination__entry pagination__go-to-page">
        Go to page #{" "}
        <select onChange={handleNewCurrentPage} name="pagination-per-page">
          {pageSpread.map((amt) => (
            <option selected={currentPage === amt} value={amt}>
              {amt}
            </option>
          ))}
        </select>{" "}
        of {totalPages}
      </div>
      <div className="pagination__entry pagination__per-page">
        View{" "}
        <select onChange={handleNewPerPage} name="pagination-per-page">
          {PAGE_AMOUNTS.map((amt) => (
            <option selected={perPage === amt} value={amt}>
              {amt}
            </option>
          ))}
        </select>{" "}
        per page
      </div>
    </div>
  );
};

export default Paginator;
