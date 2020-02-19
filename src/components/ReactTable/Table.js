import React, { useRef } from 'react';
import {
  IoIosFunnel,
  IoIosArrowForward,
  IoIosArrowDown,
  IoMdFiling
} from 'react-icons/io';
import {
  useTable,
  useGroupBy,
  useExpanded,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination
} from 'react-table';
import matchSorter from 'match-sorter';
import {
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage
} from 'react-icons/md';
import { truncateCellValue } from '../../helpers/strings';
import Select from '../Select/Select';
import classes from './Table.module.scss';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
}) {
  const count = preGlobalFilteredRows.length;

  return (
    <span>
      Search:{' '}
      <input
        value={globalFilter || ''}
        onChange={e => {
          e.stopPropagation();
          e.bubbles = false;
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`${count} records...`}
        style={{
          border: '0'
        }}
      />
    </span>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  const count = preFilteredRows.length;

  return (
    <>
      <IoIosFunnel className={classes.FunnelIcon} />
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    </>
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id }
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach(row => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        e.stopPropagation();
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id }
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={e => {
          e.stopPropagation();
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id }
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={e => {
          e.stopPropagation();
          const val = e.target.value;
          setFilter((old = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1]
          ]);
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem'
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={e => {
          e.stopPropagation();
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined
          ]);
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem'
        }}
      />
    </div>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

// Legend
function Legend() {
  return (
    <div
      style={{
        padding: '0.5rem 0'
      }}
    >
      <span
        style={{
          display: 'inline-block',
          background: '#0aff0082',
          padding: '0.5rem'
        }}
      >
        Grouped
      </span>{' '}
      <span
        style={{
          display: 'inline-block',
          background: '#ffa50078',
          padding: '0.5rem'
        }}
      >
        Aggregated
      </span>{' '}
      <span
        style={{
          display: 'inline-block',
          background: '#ff000042',
          padding: '0.5rem'
        }}
      >
        Repeated Value
      </span>
    </div>
  );
}

// This is a custom aggregator that
// takes in an array of leaf values and
// returns the rounded median
function roundedMedian(leafValues) {
  let min = leafValues[0] || 0;
  let max = leafValues[0] || 0;

  leafValues.forEach(value => {
    min = Math.min(min, value);
    max = Math.max(max, value);
  });

  return Math.round((min + max) / 2);
}

// ACTUAL TABLE
function Table({
  columns,
  data,
  onFilter,
  clickHandler,
  rowOptions,
  onRowOptionChange,
  defaultValue
}) {
  let reactTable = useRef(null);

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Instead of using 'rows', we'll use page,
    prepareRow,
    rows,
    headers,
    state,
    flatColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { groupBy, expanded, pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useExpanded, // required to use `useGroupBy` hook
    useSortBy,
    usePagination
  );

  // Getting the filtered rows and pass it upwards to the parent component of this component
  if (onFilter) {
    onFilter(rows);
    console.log(rows, headers);
    console.log(headerGroups);
  }

  const renderPagination = () => {
    return (
      <div className={classes.Pagination}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {<MdFirstPage className="icon" />}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {<MdChevronLeft className="icon" />}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {<MdChevronRight className="icon" />}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {<MdLastPage className="icon" />}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Render the UI for your table
  return (
    <>
      <p>showing {rows.length} rows</p>
      {renderPagination()}
      <div className={classes.TableWrapper}>
        <table className={classes.Table} {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <React.Fragment key={i}>
                <tr {...headerGroup.getHeaderGroupProps()} id={i}>
                  {headerGroup.headers.map((column, i) => (
                    <th
                      {...column.getHeaderProps(
                        column.getSortByToggleProps(),
                        column.getGroupByToggleProps()
                      )}
                      key={i}
                    >
                      {column.canGroupBy ? (
                        // If the column can be grouped, let's add a toggle
                        <span {...column.getGroupByToggleProps()}>
                          {column.isGrouped ? (
                            '🛑 '
                          ) : (
                            <IoMdFiling style={{ color: 'yellow' }} />
                          )}
                        </span>
                      ) : null}
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
                <tr {...headerGroup.getHeaderGroupProps()} key={i + 1}>
                  {headerGroup.headers.map((column, i) => (
                    <th
                      key={i}
                      className={classes.Filter}
                      {...column.getHeaderProps()}
                    >
                      {null}
                      {/* Render the columns filter UI */}
                      <div>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                    </th>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);

              // Check if the rows have a click listener
              const clickable = clickHandler ? classes.Clickable : null;
              return (
                <tr
                  className={clickable}
                  {...row.getRowProps()}
                  id={row.original ? row.original.id : row.id}
                  key={i}
                  onClick={clickHandler}
                >
                  {row.cells.map((cell, i) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        {...cell.getCellProps()}
                        className={
                          cell.isAggregated
                            ? classes.IsAggregated
                            : cell.isGrouped
                            ? classes.IsGrouped
                            : cell.isPlaceholder
                            ? classes.IsPlaceholder
                            : null
                        }
                      >
                        {cell.isGrouped ? (
                          // If it's a grouped cell, add an expander and row count
                          <>
                            <span {...row.getExpandedToggleProps()}>
                              {row.isExpanded ? (
                                <IoIosArrowDown />
                              ) : (
                                <IoIosArrowForward />
                              )}
                            </span>{' '}
                            {cell.render('Cell')} ({row.subRows.length})
                          </>
                        ) : cell.isAggregated ? (
                          // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          cell.render('Aggregated')
                        ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          // cell.render('Cell')
                          truncateCellValue(cell.render('Cell'))
                        )}
                      </td>
                    );
                  })}

                  {rowOptions ? (
                    <td key={i}>
                      <select
                        id={row.original.id}
                        className={classes.Status}
                        name="status"
                        onChange={onRowOptionChange}
                      >
                        {rowOptions.map(option => {
                          return `${option.id}`.toLowerCase() ===
                            `${defaultValue}`.toLowerCase() ? (
                            <option value={option.id}>{option.name}</option>
                          ) : (
                            <option value={option.id}>{option.name}</option>
                          );
                        })}
                      </select>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </>
  );
}

export default Table;
