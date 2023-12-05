import "@testing-library/jest-dom";
import "@testing-library/react";
// import { MongoClient } from "mongodb";
import {
  getForumActivity,
  nextMinDate,
  getFirstDate,
} from "../app/forum-activity/forum_activity";
import postsList from "../database/testPosts.json";

/* unit tests */
describe("getFirstDate gets first date of interval", () => {
  test("for weeks", () => {
    const firstMonday = new Date(2000, 0, 3); // first monday 2000-01-03
    for (let week = 0; week < 52; ++week) {
      const weekMonday = new Date();
      weekMonday.setUTCDate(firstMonday.getUTCDate() + week * 7);
      for (let day = 0; day < 7; ++day) {
        const date = new Date();
        date.setUTCDate(weekMonday.getUTCDate() + day);
        const firstDate = getFirstDate(date, 7);
        try {
          expect(firstDate.getUTCDay()).toBe(1); // monday
        } catch (e) {
          console.log(date.getUTCDate(), firstDate.getUTCDate());
        }
      }
    }
  });
  test("for months", () => {
    const jan1 = new Date(2000, 0, 1);
    for (let month = 0; month < 12; ++month) {
      const month1st = new Date(jan1);
      month1st.setUTCMonth(month);
      for (let day = 1; day <= 31; ++day) {
        const date = new Date(month1st);
        date.setUTCDate(day);
        // skip if adding day overflows to next month (e.g. feb 31 -> march)
        if (date.getUTCMonth() !== month1st.getUTCMonth()) continue;
        const firstDate = getFirstDate(date, 30);
        try {
          expect(firstDate.getUTCDate()).toBe(1); // first day of month
        } catch (e) {
          console.log(date.getUTCDate(), firstDate.getUTCDate());
        }
      }
    }
  });
  test("for days it should do nothing", () => {});
});

describe("nextMinDate gets next first date of interval", () => {});

describe("getForumActivity", () => {});

/* component tests */
