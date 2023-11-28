/* eslint-disable react/prop-types */
import Button from "../components/inputs/Button";

export const columns = [
  {
    id: 'no',
    name: 'no',
    Header: 'No.',
    accessor: 'no',
  },
  {
    id: 'title',
    name: 'title',
    Header: 'Title',
    accessor: 'title',
  },
  {
    id: 'priority',
    name: 'priority',
    Header: 'Priority',
    accessor: 'priority',
    filter: true,
  },
  {
    id: 'draft',
    name: 'draft',
    Header: 'Draft',
    accessor: 'draft',
  },
  {
    id: 'added_by',
    name: 'added_by',
    Header: 'Added By',
    accessor: 'added_by',
    filter: true,
  },
  {
    id: 'start_date',
    name: 'start_date',
    Header: 'Start Date',
    accessor: 'start_date',
    filter: true,
  },
  {
    id: 'end_date',
    name: 'end_date',
    Header: 'End Date',
    accessor: 'end_date',
  },
  {
    id: 'created_at',
    name: 'created_at',
    Header: 'Date Added',
    accessor: 'created_at',
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    Cell: ({ row }) => (
      <article className="flex w-full items-center gap-[5px]">
        <Button value='Details' primary route={`/tasks/${row?.original?.id}`} />
      </article>
    ),
  },
];

