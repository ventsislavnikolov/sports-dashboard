import { describe, expect, it } from "vitest";
import { formatMinute } from "../formatMinute";

describe("formatMinute", () => {
  it("formats a normal minute", () => {
    expect(formatMinute(70)).toBe("70'");
  });

  it("formats minute zero as 0'", () => {
    expect(formatMinute(0)).toBe("0'");
  });

  it("formats 90+ minutes with plus sign", () => {
    expect(formatMinute(93)).toBe("90+3'");
  });

  it("formats exactly 90 as 90'", () => {
    expect(formatMinute(90)).toBe("90'");
  });

  it("formats 45+ as first-half stoppage", () => {
    expect(formatMinute(47, "1H")).toBe("45+2'");
  });

  it("returns '—' for null", () => {
    expect(formatMinute(null)).toBe("—");
  });
});
