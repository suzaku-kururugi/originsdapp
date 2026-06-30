import React, { FC } from "react";
import { ReactDatePickerCustomHeaderProps } from "react-datepicker";
import { getMonth, getYear } from "date-fns";
import range from "lodash/range";

import {
  calendarNavigationButtonStyle,
  calendarSelectStyle,
} from "../../styles";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = range(1500, getYear(new Date()) + 1, 1).reverse();

export const CustomHeader: FC<ReactDatePickerCustomHeaderProps> = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  return (
    <div
      style={{
        margin: 10,
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      <select
        // className="w-14 border-2 rounded border-indigo-300 font-medium bg-secondary text-gray-200	"
        className={`w-14 ${calendarSelectStyle}`}
        value={getYear(date)}
        onChange={({ target: { value } }) => changeYear(Number(value))}
      >
        {years.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className={calendarNavigationButtonStyle}
        type="button"
      >
        <div className="px-2 font-medium">{"<"}</div>
      </button>

      <select
        className={calendarSelectStyle}
        value={months[getMonth(date)]}
        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
      >
        {months.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className={calendarNavigationButtonStyle}
        type="button"
      >
        <div className="px-2 font-medium">{">"}</div>
      </button>
    </div>
  );
};
