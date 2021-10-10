import { merge } from "../core/create/lib/object";

describe("merge", () => {
  it("merges a shallow object", () =>
    expect(merge({ 1: 2, 2: 3 }, { 3: 4, 5: 6 })).toEqual({ 1: 2, 2: 3, 3: 4, 5: 6 })
  );

  it("merges a nested object", () =>
    expect(merge({ 1: 2, 2: { 4: 5 } }, { 2: { 5: 6 } })).toEqual({ 1: 2, 2: { 4: 5, 5: 6 } })
  );
});



