import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import {
  useGlobalFilter,
  useTable,
  useAsyncDebounce,
  usePagination,
  useFilters,
  useSortBy,
} from "react-table";
import "regenerator-runtime/runtime";
import Button from "../inputs/Button";
import Input from "../inputs/Input";
import printPDF from "./Export";

const Table = ({ columns, data, pagination = true }) => {
  const tableColumns = useMemo(
    () =>
      columns.map((column) => {
        return {
          ...column,
          Filter: column.filter ? SelectColumnFilter : undefined,
        };
      }),
    [columns]
  );

  const [showExportPopup, setShowExportPopup] = useState(false);
  const [reportName, setReportName] = useState("");

  const openExportPopup = () => {
    setShowExportPopup(true);
  };

  const closeExportPopup = () => {
    setShowExportPopup(false);
  };

  const TableInstance = useTable(
    {
      columns: tableColumns,
      data,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    setGlobalFilter,
    prepareRow,
    state,
    preGlobalFilteredRows,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = TableInstance;

  return (
    <main className="flex flex-col item-start gap-4">
      <section className="flex flex-col items-center gap-4">
        <section className="w-full flex flex-col items-start justify-start gap-[10px]">
          <span className="w-full items-start flex justify-start">
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </span>
          <span className="flex items-center gap-4">
            {headerGroups.map((headerGroup) =>
              headerGroup.headers.map((column) =>
                column.Filter ? (
                  <button
                    key={column.id}
                    className="p-[5px] px-2 border-accent ring-[1.5px] ring-gray-300 rounded-md focus:border-primary hover:ring-primary max-md:justify-start"
                  >
                    <label htmlFor={column.id}></label>
                    {column.render("Filter")}
                  </button>
                ) : null
              )
            )}
          </span>
        </section>
        <section className="w-full mx-auto h-fit flex flex-col items-start flex-wrap gap-4 max-md:justify-center">
          <span>
            <Button
              className="!border-[1px]"
              value={
                <span className="flex items-center gap-2">
                  Export Report <FontAwesomeIcon icon={faFilePdf} />
                </span>
              }
              onClick={openExportPopup}
            />
          </span>
        </section>
        {/* Export Popup/Modal */}
        {showExportPopup && (
          <section className="fixed inset-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-60">
            <form className="bg-white p-4 rounded-lg shadow-lg min-w-[30rem] flex flex-col gap-4 items-center">
              <h2 className="text-xl font-semibold uppercase">Print PDF</h2>
              <Input
                type="text"
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
                value={reportName}
              />
              <span className="flex gap-3">
                <Button
                  value={
                    <span className="flex items-center gap-2">Export PDF</span>
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    printPDF({ TableInstance, reportName, columns });
                  }}
                />
                <Button
                  value={<span className="flex items-center gap-2">Close</span>}
                  onClick={closeExportPopup}
                />
              </span>
            </form>
          </section>
        )}
      </section>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table
          {...getTableProps()}
          className="w-full text-sm text-left text-gray-800 rounded-md"
        >
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    {...column.getHeaderProps()}
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  key={row.id}
                  {...row.getRowProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {row.cells.map((cell) => {
                    if (cell.column?.Header === 'Entry' && cell?.value?.length > 5000) {
                     return (
                        <td
                          key={cell.id}
                          {...cell.getCellProps()}
                          className="px-6 py-4"
                        >
                         <img className='w-auto h-12' src={cell?.value} />
                        </td>
                     )
                    }
                    return (
                      <td
                        key={cell.id}
                        {...cell.getCellProps()}
                        className="px-6 py-4"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        className={`${
          pagination ? "flex" : "hidden"
        }  justify-between mt-4 mb-8 max-md:flex-col`}
      >
        <div className="text-slate-500">
          <span>
            Page{" "}
            <strong>
              {state.pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 max-sm:flex-col max-sm:items-start">
          <span className="flex items-center gap-2 max-sm:">
            Go to page:{" "}
            <input
              type="number"
              defaultValue={state.pageIndex + 1}
              onChange={(e) => {
                const pageNumber = e.target.value
                  ? Number(e.target.value) - 1
                  : 0;
                gotoPage(pageNumber);
              }}
              className="w-10 text-center border-none py-[6px] ring-[1.5px] ring-gray-300 ring-opacity-50 rounded-md focus:ring-primary"
            />
          </span>
          <span className="flex items-center gap-2">
            <select
              value={state.pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="ring-[1.5px] py-2 ring-gray-300 ring-opacity-50 rounded-md focus:ring-primary"
            >
              {[5, 10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className={`pagination-button ${
                !canPreviousPage ? "pagination-button-disabled" : ""
              }`}
            >
              {"<<"}
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className={`pagination-button ${
                !canPreviousPage ? "pagination-button-disabled" : ""
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className={`pagination-button ${
                !canNextPage ? "pagination-button-disabled" : ""
              }`}
            >
              Next
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className={`pagination-button ${
                !canNextPage ? "pagination-button-disabled" : ""
              }`}
            >
              {">>"}
            </button>
          </span>
        </div>
      </div>
    </main>
  );
};

export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render },
}) {
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <label
      style={{
        whiteSpace: "nowrap",
        display: "flex",
        gap: "10px",
        alignItems: "center",
        width: "100%",
      }}
    >
      <p className="text-[14px] w-fit">{render("Header")}:</p>
      <select
        className="w-full min-w-[6rem] focus:outline-none rounded-md flex items-center justify-center"
        name={id}
        id={id}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option className="text-[13px]" value="">
          All
        </option>
        {options.map((option, i) => (
          <option className="text-[13px] w-fit" key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <label className="relative max-w-[50%] min-w-[30%]">
      <Input
        type="text"
        className="w-full max-w-[20rem] !py-2 !text-[14px] pr-10"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
      <Button
        className="absolute right-20 top-1/2 transform -translate-y-1/2 !bg-transparent !border-none !ring-none !shadow-none hover:!text-primary !p-0"
        value={<FontAwesomeIcon icon={faMagnifyingGlass} />}
        onClick={() => {
          setGlobalFilter(value || undefined);
        }}
      />
    </label>
  );
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  pagination: PropTypes.bool,
};

GlobalFilter.propTypes = {
    preGlobalFilteredRows: PropTypes.array.isRequired,
    globalFilter: PropTypes.string.isRequired,
    setGlobalFilter: PropTypes.func.isRequired,
};

SelectColumnFilter.propTypes = {
    column: PropTypes.shape({
        filterValue: PropTypes.string.isRequired,
        setFilter: PropTypes.func.isRequired,
        preFilteredRows: PropTypes.array.isRequired,
        id: PropTypes.string.isRequired,
        render: PropTypes.func.isRequired,
    }).isRequired,
};

export default Table;
