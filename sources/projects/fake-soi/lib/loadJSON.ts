///
<reference path="../../../typings/bluebird/bluebird.d.ts" /> export function loadJSONasync
<T>(fileName: string): Promise
    <T> { return new Promise
        <T>((resolve, reject) => { let ret =
            <T> {}; resolve(ret); }); }