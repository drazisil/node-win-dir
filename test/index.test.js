const winDir = require("../lib/win-dir")

test('that _shouldSearchSubdirectories() return true when set', () => {
    const options = {
        subdirectories: true
    }
    expect(winDir._shouldSearchSubdirectories(options)).toBeTruthy();
});

test('that _shouldSearchSubdirectories() return false when not set', () => {
    const options = {}
    expect(winDir._shouldSearchSubdirectories(options)).toBeFalsy();
});
