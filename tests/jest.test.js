describe("jest testing", function () {
  it("testing started successfully", function () {
    const bil1 = 1;
    const bil2 = 2;
    const result = bil1 * bil2;
    expect(result).toBe(2);
  });

  it("testing started error", function () {
    const bil1 = 1;
    const bil2 = 2;
    const result = bil1 * bil2;
    expect(result).toBe(3);
  });
});
