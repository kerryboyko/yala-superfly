import { isFormProcessing } from "./form";

describe("isFormProcessing()", () => {
  it("will tell you if the form is processing", () => {
    expect(isFormProcessing("idle")).toBe(false);
    expect(isFormProcessing("loading")).toBe(true);
    expect(isFormProcessing("submitting")).toBe(true);
  });
});
